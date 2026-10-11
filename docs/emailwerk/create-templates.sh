#!/bin/bash
# Create fhkit's two emailwerk templates from the HTML next to this script.
#
#   "fhkit Contact"               the enquiry, to office@fhkit.at
#   "fhkit Contact Confirmation"  the copy to the visitor, a linked child
#
# Both are modelled on netsnek.com's Contact and Contact Confirmation and use
# the same settings: TWIG, public, sender office@snek.at. See
# ../emailwerk-setup.md for why each value is what it is.
#
# Usage, as an emailwerk operator (the Basic door of emailwerk.com):
#
#   EMAILWERK_BASIC='admin:<password>' docs/emailwerk/create-templates.sh
#
# It prints the id of "fhkit Contact", which goes into CONTACT_TEMPLATE_ID in
# src/services/contact.tsx. It refuses to run when a template whose
# description starts with "fhkit" exists already, so a second run cannot
# create duplicates.
set -euo pipefail

: "${EMAILWERK_BASIC:?set EMAILWERK_BASIC to user:password of the emailwerk Basic door}"
URL="${EMAILWERK_URL:-https://emailwerk.com/graphql}"
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# The sender netsnek.com's pair uses: office@snek.at, "Netsnek Office".
SENDER_ID='cmsmhy0ag004drb2pzezqi0v2'
RECIPIENT='office@fhkit.at'

post() {
  # -4: IPv6 is routed but dead on the machine this was written on.
  curl -4 -sS --fail-with-body --max-time 60 -u "$EMAILWERK_BASIC" \
    -H 'content-type: application/json' --data-binary @"$1" "$URL"
}

# Write a GraphQL request body with variables, so the HTML needs no escaping.
body() {
  python3 - "$@" <<'PY'
import json, sys
out, query, variables = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
for key, path in [a.split('=', 1) for a in sys.argv[4:]]:
    variables['args'][key] = open(path, encoding='utf-8').read()
json.dump({'query': query, 'variables': variables}, open(out, 'w'))
PY
}

# Pull one field out of a response, failing on GraphQL errors.
field() {
  python3 -c '
import json, sys
d = json.load(sys.stdin)
if d.get("errors"):
    sys.exit("emailwerk: " + json.dumps(d["errors"], ensure_ascii=False))
v = d["data"]
for k in sys.argv[1].split("."):
    v = v[k]
print(v if isinstance(v, str) else json.dumps(v))' "$1"
}

VARS_CONTACT='[
  {"name":"firstName","type":"STRING","isRequired":true,"isConstant":false},
  {"name":"lastName","type":"STRING","isRequired":true,"isConstant":false},
  {"name":"email","type":"STRING","isRequired":true,"isConstant":false},
  {"name":"phone","type":"STRING","isRequired":false,"isConstant":false},
  {"name":"message","type":"STRING","isRequired":true,"isConstant":false},
  {"name":"invokedOnUrl","type":"STRING","isRequired":false,"isConstant":false}
]'
VARS_CONFIRMATION='[
  {"name":"firstName","type":"STRING","isRequired":true,"isConstant":false},
  {"name":"lastName","type":"STRING","isRequired":true,"isConstant":false},
  {"name":"email","type":"STRING","isRequired":true,"isConstant":false},
  {"name":"phone","type":"STRING","isRequired":false,"isConstant":false},
  {"name":"message","type":"STRING","isRequired":true,"isConstant":false}
]'

# 1. Refuse to run twice.
body "$WORK/find.json" \
  'query Find($args: TemplateListArgsInput!) { templates(args: $args) { nodes { id description } } }' \
  '{"args":{"first":50,"filters":{"search":"fhkit"}}}'
existing="$(post "$WORK/find.json" | field templates.nodes)"
if [ "$existing" != "[]" ]; then
  echo "fhkit templates exist already, nothing created: $existing" >&2
  exit 1
fi

# 2. The enquiry template.
body "$WORK/contact.json" \
  'mutation Create($args: TemplateCreateInput!) { templateCreate(args: $args) { id } }' \
  "{\"args\":{\"description\":\"fhkit Contact\",\"engine\":\"TWIG\",\"senderId\":\"$SENDER_ID\",\"verifyReplyTo\":false,\"requiresSignature\":false,\"isPublic\":true,\"variables\":$VARS_CONTACT,\"envelope\":{\"to\":[\"$RECIPIENT\"],\"subject\":\"Neue Anfrage auf fhkit.at\"}}}" \
  "content=$HERE/fhkit-contact.html"
CONTACT_ID="$(post "$WORK/contact.json" | field templateCreate.id)"

# 3. The confirmation. templateCreate takes no parentId, so the link to the
#    enquiry template is set with an update right after. emailwerk sends a
#    public child to the replyTo of every send of its parent.
body "$WORK/confirmation.json" \
  'mutation Create($args: TemplateCreateInput!) { templateCreate(args: $args) { id } }' \
  "{\"args\":{\"description\":\"fhkit Contact Confirmation\",\"engine\":\"TWIG\",\"senderId\":\"$SENDER_ID\",\"verifyReplyTo\":false,\"requiresSignature\":false,\"isPublic\":true,\"variables\":$VARS_CONFIRMATION,\"envelope\":{\"to\":[],\"subject\":\"{% assign lang = locale | append: '' | downcase | split: '-' | first | split: '_' | first %}{% case lang %}{% when 'en' %}Your enquiry on fhkit.at{% when 'sl' %}Vaše povpraševanje na fhkit.at{% when 'it' %}La tua richiesta su fhkit.at{% when 'ja' %}fhkit.at へのお問い合わせ{% else %}Ihre Anfrage auf fhkit.at{% endcase %}\"}}}" \
  "content=$HERE/fhkit-contact-confirmation.html"
CONFIRMATION_ID="$(post "$WORK/confirmation.json" | field templateCreate.id)"

body "$WORK/link.json" \
  'mutation Link($args: TemplateUpdateArgsInput!) { templateUpdate(args: $args) { id parentId } }' \
  "{\"args\":{\"id\":\"$CONFIRMATION_ID\",\"parentId\":\"$CONTACT_ID\"}}"
post "$WORK/link.json" | field templateUpdate.parentId >/dev/null

# 4. Read both back, the way the send path will see them.
for id in "$CONTACT_ID" "$CONFIRMATION_ID"; do
  body "$WORK/read.json" \
    'query Read($args: TemplateArgsInput!) { template(args: $args) { id description engine isPublic verifyReplyTo requiresSignature senderId parentId envelope { to subject } } }' \
    "{\"args\":{\"id\":\"$id\"}}"
  post "$WORK/read.json" | field template
done

echo
echo "fhkit Contact:              $CONTACT_ID"
echo "fhkit Contact Confirmation: $CONFIRMATION_ID"
echo "Put $CONTACT_ID into CONTACT_TEMPLATE_ID in src/services/contact.tsx."
