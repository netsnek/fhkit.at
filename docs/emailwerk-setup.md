# emailwerk setup for the fhkit.at contact form

Everything in this file happens **outside this repository**, in emailwerk and
in its deployment. The site reads exactly one value from here: the template id
that goes into `CONTACT_TEMPLATE_ID` at the top of `src/services/contact.tsx`.

## Where things stand (2026-10-10, 23:30 UTC)

The templates exist, the origin is allowed and the site carries the id. The
build with the id is not deployed yet.

- emailwerk holds fhkit's two templates in the tenant `netsnek` (124
  templates now, 122 before). The script below created them at 13:29 UTC.
  `fhkit Contact` is `cmv2fl2cu14ebps2p05nwpoev`, the id the site needs, and
  `fhkit Contact Confirmation` is `cmv2fl2pd14ekps2peogq6lq1`, linked to it as
  its child. Both are public, their stored content is byte-identical to the
  files in `emailwerk/`, and both rendered cleanly through emailwerk's own
  `templatePreview`.
- `https://fhkit.at` is in `EMAILWERK_CORS_ORIGINS`. Its preflight answers 204
  with the origin echoed, the eleven origins listed before still get 204,
  and an unlisted origin still gets 401.
- `www.fhkit.at` no longer answers 522. A Cloudflare zone redirect rule sends
  every request to `https://fhkit.at` with 301 and keeps the path and query.
- The site posts to `cmv2fl2cu14ebps2p05nwpoev` since commit `82d7096`, and
  the prefilled mail it opened until then is gone. The dialog shows the
  outcome in the page's language: a thank-you when emailwerk accepted the
  enquiry, or a notice that it was not sent, with the enquiry offered as a
  prepared mail to office@fhkit.at. The live site (Pages deployment
  `51e0ce34`, built from `be8afbd`) still opens the prefilled mail until the
  new build is deployed. The id used to be netsnek.com's template, which would
  have delivered every fhkit enquiry to netsnek's inbox the moment the origin
  was allowed.

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
- A send that fails on the network (the connection breaks, or the browser
  blocks the answer because the preflight was refused) is repeated by the
  plugin's GraphQL client, gqty, three times one second apart before the
  dialog reports it. A refusal from emailwerk is an answer and is
  not repeated. gqty's default policy does this, and `sendTemplateMail` in
  jaen does not switch it off.

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
- **Editing them later.** The build running on the netcup node (image of
  2026-08-27) is older than emailwerk `3ca79e1`. On that build a
  `templateUpdate` that names only some envelope fields resets the others, so
  sending `{subject}` alone empties `to`, and the public send then refuses
  every enquiry with `PUBLIC_SEND_NO_STORED_RECIPIENT`. Until the build is
  replaced, send the whole envelope with any envelope change, or none.

Create both, the link between them included, with:

```sh
EMAILWERK_BASIC='admin:<password>' docs/emailwerk/create-templates.sh
```

It prints the id of `fhkit Contact` and refuses to run a second time. It ran
once against production on 2026-10-10, so a second run now stops at its check.

## 2. Allow the origin

`EMAILWERK_CORS_ORIGINS` in the ConfigMap `emailwerk-config` (namespace
`emailwerk`, `deploy/k8s/emailwerk/20-app.yaml` in the emailwerk repository)
needs `https://fhkit.at`. The entry is matched verbatim against the `Origin`
header. Since 2026-10-10 the live ConfigMap and the line in the emailwerk
repository (commit `de53e7c`) both read:

```yaml
EMAILWERK_CORS_ORIGINS: "https://netsnek.com,https://www.netsnek.com,https://nadine-hauswirth.com,https://www.nadine-hauswirth.com,https://walther.exp.univie.ac.at,https://limosen.at,https://www.limosen.at,https://new.limosen.at,https://new.booklimo.at,https://booklimo.at,https://www.booklimo.at,https://fhkit.at"
```

The list is read when the process starts, so the deployment needs a restart
after the ConfigMap changes. The deployment uses the `Recreate` strategy, so a
restart means emailwerk is down for about half a minute (24 s on 2026-10-10).
`www.fhkit.at` redirects to `https://fhkit.at` at the Cloudflare edge and
never serves the form, so it stays off the list.

The preflight from an allowed origin already reaches the application and gets
204, so no Cloudflare Access rule stands in front of `/graphql`.

## 3. Put the id into the site

Done on 2026-10-10 in `82d7096`: `CONTACT_TEMPLATE_ID` in
`src/services/contact.tsx` is the id the script printed,
`cmv2fl2cu14ebps2p05nwpoev`. The id is not a secret and not an authorization.
What is left is to build and deploy the site.

## Verifying

Before a deploy, `tests/fhkit-browser.ipynb` presses Send in every language on
the local build. It answers the request inside the browser, so no mail goes
out. It checks that one press makes one POST to `https://emailwerk.com/graphql`
(repeated only by gqty, after a network failure) with this template id, the
form fields as typed, the visitor as `replyTo` only and the confirmation's
twelve `t_` texts in the page's language, and that the dialog shows the
outcome in that language.

1. The preflight answers 204 with the origin echoed:

   ```sh
   curl -4 -i -X OPTIONS -H 'Origin: https://fhkit.at' \
     -H 'Access-Control-Request-Method: POST' \
     -H 'Access-Control-Request-Headers: content-type' \
     https://emailwerk.com/graphql
   ```

2. Without sending a mail, read the template through the Basic door:
   `template(args: {id: "cmv2fl2cu14ebps2p05nwpoev"}) { isPublic envelope { to } }`
   gives `isPublic: true` and `to: ["office@fhkit.at"]`. The anonymous
   mutation cannot show this. It rejects an invalid `replyTo` with
   `PUBLIC_SEND_INVALID_REPLY_TO` before it looks the template up, so that
   error comes back for any id, even one that does not exist (checked on
   2026-10-10).
3. One real message from the deployed site, in a language other than German:
   the enquiry arrives at office@fhkit.at with `Reply-To` set to the visitor,
   and exactly one confirmation arrives at the visitor, in that language.

Every refusal on the public branch is an error with a code in
`extensions.code`: `TEMPLATE_NOT_FOUND` (missing **or** not public, on purpose
indistinguishable), `PUBLIC_SEND_RECIPIENT_NOT_ALLOWED`,
`PUBLIC_SEND_RATE_LIMITED` with `retryAfterSeconds`. The messages are German.
