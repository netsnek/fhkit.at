# emailwerk setup for the fhkit.at contact form

Everything in this file happens **outside this repository**, in emailwerk and
in its deployment. The site reads exactly one value from here: the template id
that goes into `CONTACT_TEMPLATE_ID` at the top of `src/services/contact.tsx`.

## Where things stand (checked 2026-10-10)

- emailwerk has **no fhkit template**. The tenant `netsnek` holds 122
  templates, and none of them belongs to fhkit.
- emailwerk answers the CORS preflight from `https://fhkit.at` with 401 and no
  `Access-Control-Allow-Origin`, so a browser on fhkit.at cannot post to it at
  all. The preflights from netsnek.com, nadine-hauswirth.com, booklimo.at and
  limosen.at get 204.
- Until both are fixed the site does not use emailwerk. `CONTACT_TEMPLATE_ID`
  is `null`, and the form opens a prefilled mail to office@fhkit.at instead.
  It used to carry netsnek.com's template, which would have delivered every
  fhkit enquiry to netsnek's inbox the moment the origin was allowed.

Three steps fix it, in this order: create the templates, allow the origin,
put the id into the site and deploy it.

## How the send works, so the templates make sense

The form calls `sendTemplateMail` from `gatsby-jaen-emailwerk`. Without a CMS
session it carries no credentials, and emailwerk takes its **public branch**
(`src/public/send.ts` in the emailwerk repository):

- The template must be flagged `isPublic`. An id alone authorizes nothing.
- **Recipients come from the template's stored envelope.** Passing `to` is
  rejected, so the fhkit inbox is configured on the template, not in the site.
- The only overrides allowed are `envelope.replyTo` and `values`. The subject
  lives on the template.
- A template with `verifyReplyTo` or `requiresSignature` set is not publicly
  sendable. Both stay off.
- Sends are rate limited per client IP and globally.

The confirmation to the visitor is **not** sent by the site. emailwerk enqueues
every public template whose `parentId` is the contact template, addressed to
the `replyTo` of the send, and renders it from the same `values`. That is why
the site sends the confirmation's text as `t_` values in the visitor's
language, and why every `t_` placeholder keeps a German default.

## 1. The templates

Both are derived from netsnek.com's pair, Contact
(`cmsmguuxh0038rb2pgsrpzhur`) and Contact Confirmation
(`cmsmgusf60007rb2pyiuzaj54`), and changed only where those name netsnek.com
(or, in netsnek's office mail, Barbara Mauz): the links go to fhkit.at and its
legal notice, the mailbox is office@fhkit.at, the rights line names Florian
Herbert Kleber IT, and the confirmation's German defaults address the visitor
as "Sie", like the site does. The sources are in this folder:

| | `emailwerk/fhkit-contact.html` | `emailwerk/fhkit-contact-confirmation.html` |
| --- | --- | --- |
| Description | `fhkit Contact` | `fhkit Contact Confirmation` |
| Engine | TWIG | TWIG |
| `isPublic` | true | true |
| `verifyReplyTo`, `requiresSignature` | false | false |
| Sender | `cmsmhy0ag004drb2pzezqi0v2` | `cmsmhy0ag004drb2pzezqi0v2` |
| Envelope `to` | `office@fhkit.at` | empty, the server uses `replyTo` |
| Envelope subject | `Neue Anfrage auf fhkit.at` | `{{ t_subject \| default: 'Ihre Anfrage auf fhkit.at' }}` |
| `parentId` | none | the id of `fhkit Contact` |

Notes on the values:

- **Recipient office@fhkit.at.** It is the site's own documented mailbox (the
  footer, the legal notice and the confirmation text give it), and fhkit.at's
  Cloudflare Email Routing has an enabled catch-all forward, so mail to it is
  delivered. Use the owner's kleber@snek.at instead if office@fhkit.at should
  not receive enquiries any more.
- **Sender** `cmsmhy0ag004drb2pzezqi0v2` is office@snek.at, "Netsnek Office",
  the sender netsnek.com's pair uses.
- **Engine.** The body is Twig, like netsnek's, and escapes visitor input with
  `|escape` and `|nl2br`. `t_questions` carries the two links and is rendered
  `|raw`. The subject is always rendered with Liquid, whatever the engine.
- Both files were rendered offline with emailwerk's own `twig` and `liquidjs`,
  with and without the `t_` values, before they were committed.

Create both, the link between them included, with:

```sh
EMAILWERK_BASIC='admin:<password>' docs/emailwerk/create-templates.sh
```

It prints the id of `fhkit Contact` and refuses to run a second time.

## 2. Allow the origin

`EMAILWERK_CORS_ORIGINS` in the ConfigMap `emailwerk-config` (namespace
`emailwerk`, `deploy/k8s/emailwerk/20-app.yaml` in the emailwerk repository)
needs `https://fhkit.at`. The entry is matched verbatim against the `Origin`
header. As of 2026-10-10 the line reads, with fhkit.at appended:

```yaml
EMAILWERK_CORS_ORIGINS: "https://netsnek.com,https://www.netsnek.com,https://nadine-hauswirth.com,https://www.nadine-hauswirth.com,https://walther.exp.univie.ac.at,https://limosen.at,https://www.limosen.at,https://new.limosen.at,https://new.booklimo.at,https://booklimo.at,https://www.booklimo.at,https://fhkit.at"
```

The list is read when the process starts, so the deployment needs a restart
after the ConfigMap changes. `www.fhkit.at` answers with Cloudflare error 522
today, so it stays off the list until that host serves the site.

The preflight from an allowed origin already reaches the application and gets
204, so no Cloudflare Access rule stands in front of `/graphql`.

## 3. Put the id into the site

Set `CONTACT_TEMPLATE_ID` in `src/services/contact.tsx` to the id the script
printed and delete the TODO above it. The id is not a secret and not an
authorization. Then build and deploy the site.

## Verifying

1. The preflight answers 204 with the origin echoed:

   ```sh
   curl -4 -i -X OPTIONS -H 'Origin: https://fhkit.at' \
     -H 'Access-Control-Request-Method: POST' \
     -H 'Access-Control-Request-Headers: content-type' \
     https://emailwerk.com/graphql
   ```

2. Without sending a mail: an anonymous `sendTemplateMail` with the new id and
   a deliberately invalid `replyTo` fails with `PUBLIC_SEND_INVALID_REPLY_TO`
   instead of `TEMPLATE_NOT_FOUND` once the template is public.
3. One real message from the deployed site, in a language other than German:
   the enquiry arrives at office@fhkit.at with `Reply-To` set to the visitor,
   and exactly one confirmation arrives at the visitor, in that language.

Every refusal on the public branch is an error with a code in
`extensions.code`: `TEMPLATE_NOT_FOUND` (missing **or** not public, on purpose
indistinguishable), `PUBLIC_SEND_RECIPIENT_NOT_ALLOWED`,
`PUBLIC_SEND_RATE_LIMITED` with `retryAfterSeconds`. The messages are German.
