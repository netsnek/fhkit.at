# emailwerk setup for the fhkit.at contact form

Everything in this file happens **outside this repository**, in emailwerk and in
its deployment. The site code is already finished and reads exactly one value
from here: the template id, which goes into `CONTACT_TEMPLATE_ID` at the top of
`src/services/contact.tsx`.

Until that id exists the constant carries netsnek.com's, so the form can be
exercised end to end during development. Left alone it would deliver fhkit
enquiries into netsnek's inbox, with netsnek's branding on the confirmation.

## How the send works, so the templates make sense

The form calls `sendTemplateMail` from `gatsby-jaen-emailwerk`. With no CMS
session it carries no `Authorization` header and no credentials, and emailwerk
takes its **public branch**. That branch is deliberately narrow:

- The template must be flagged `isPublic`. A template id is not an
  authorization; it is public only because an admin said so.
- **Recipients come from the template's stored envelope, server-side.** Passing
  `to` is rejected, not ignored. That is what stops the mutation being an open
  relay, and it is why the fhkit inbox is configured on the template rather than
  in the site.
- The only overrides allowed are `envelopeOverride.replyTo` and `values`.
  `subject` is refused, so the subject line lives on the template.
- A template with `verifyReplyTo` or `requiresSignature` set is not publicly
  sendable at all. Both must be off.
- Sends are rate limited per client IP and globally, on a sliding ten-minute
  window. Only accepted sends consume budget.

The confirmation to the visitor is **not** sent by the site. emailwerk enqueues
every `isPublic` template whose `parentId` is the contact template, to the
address in `replyTo`. Sending it from the client as well delivers it twice.

## 1. The contact template

Create it as an emailwerk admin, in the fhkit organisation.

| Field | Value |
| --- | --- |
| Name | `fhkit Contact` |
| `isPublic` | **true** |
| `verifyReplyTo` | false |
| `requiresSignature` | false |
| Envelope `to` | the fhkit inbox, e.g. `office@fhkit.at` |
| Envelope `subject` | `Neue Kontaktanfrage über fhkit.at` |
| Engine | Liquid |

### Variables the site sends

These arrive in `values` on every send. All are primitives; the serialised
object must stay under 16 KB.

| Key | Meaning |
| --- | --- |
| `firstName` | given name |
| `lastName` | family name |
| `email` | the visitor's address, also sent as `replyTo` |
| `phone` | may be an empty string |
| `message` | free text |
| `invokedOnUrl` | the page the form was opened from |
| `locale` | `de`, `en`, `sl`, `it` or `ja` |
| `t_*` | the confirmation's own text, see below |

### Body

The inquiry mail is read by Florian, not by the visitor, so it stays German and
needs no `t_` placeholders.

```liquid
<p><strong>Name:</strong> {{ firstName }} {{ lastName }}</p>
<p><strong>E-Mail:</strong> {{ email }}</p>
<p><strong>Telefon:</strong> {{ phone | default: "nicht angegeben" }}</p>
<p><strong>Seite:</strong> {{ invokedOnUrl }}</p>
<p><strong>Sprache:</strong> {{ locale | default: "de" }}</p>
<hr>
<p>{{ message | newline_to_br }}</p>
```

## 2. The confirmation template

Create a second template, then set its `parentId` to the contact template's id.

| Field | Value |
| --- | --- |
| Name | `fhkit Contact Confirmation` |
| `isPublic` | **true** (a non-public child is never enqueued) |
| `parentId` | the id from step 1 |
| Envelope `to` | leave empty; the server addresses it to `replyTo` |
| Envelope `subject` | `{{ t_subject | default: "Ihre Anfrage auf fhkit.at" }}` |

### Why the text arrives as variables

emailwerk renders the confirmation server-side from the **same `values`** the
contact send carried, and it has no notion of locale. So the only way the
visitor's language reaches this mail is for the site to send the text with it.
Each `t_` key below is a placeholder here and is filled by
`src/services/contact.tsx` from the same react-intl catalogue the page uses.

**Every placeholder keeps its German original as its own `default`.** An older
build that sends none of them still produces a correct German mail, which is
what makes this safe to deploy before the site is.

```liquid
<h1>{{ t_title | default: "Ihre Anfrage" }}</h1>
<h2>{{ t_heading | default: "Kontaktanfrage" }}</h2>

<p>{{ t_thanks | default: "Vielen Dank für Ihre Kontaktanfrage. Ich melde mich so schnell wie möglich bei Ihnen." }}</p>

<p>
  <strong>{{ t_labelName | default: "Name:" }}</strong> {{ firstName }} {{ lastName }}<br>
  <strong>{{ t_labelEmail | default: "E-Mail:" }}</strong> {{ email }}<br>
  <strong>{{ t_labelPhone | default: "Telefonnummer:" }}</strong> {{ phone }}<br>
  <strong>{{ t_labelMessage | default: "Nachricht:" }}</strong><br>
  {{ message | newline_to_br }}
</p>

<p>{{ t_questions }}</p>

<hr>
<p>{{ t_rights | default: "Alle Rechte vorbehalten. © 2026 Florian Herbert Kleber IT" }}</p>
```

`t_questions` is the only key carrying markup: it holds two links whose word
order moves with the language, so the anchors are built on the site with an
inline style. Email clients drop stylesheets, so the style has to ride along on
the anchor. Render it raw, and note that **Twig does not escape by default while
Liquid does** — if the template is switched to Twig, `t_questions` needs no
filter, and on Liquid it needs `| raw`-equivalent handling. It is the one place
where the engine choice is visible.

## 3. Allow the origin

`EMAILWERK_CORS_ORIGINS` currently lists only netsnek's two origins. A browser
on fhkit.at gets a 401 on the OPTIONS preflight and the POST is never sent, so
the form fails with no useful error.

In `deploy/k8s/emailwerk/20-app.yaml` of the emailwerk repository:

```yaml
EMAILWERK_CORS_ORIGINS: "https://netsnek.com,https://www.netsnek.com,https://fhkit.at,https://www.fhkit.at"
```

Matched verbatim against the `Origin` header, so scheme matters and a
non-default port would matter. Restart the deployment afterwards.

Add the Cloudflare Pages preview origin too if the form should be testable
before the domain switches over.

## 4. Check the Access bypass

Both emailwerk deployments sit behind Cloudflare Access, which gates the whole
host. Anonymous sending additionally needs a **path bypass policy on
`/graphql`**, the same arrangement `/sign/*` has. Without it the request never
reaches the application and no template flag makes a difference.

## 5. Hand back the id

Put the contact template's id into `CONTACT_TEMPLATE_ID` in
`src/services/contact.tsx` and delete the TODO above it. It is not a secret and
belongs in the source; it is also not an authorization.

## Verifying

Submit the form from a browser on the deployed origin, in a language other than
German, and check three things:

1. The mutation returns `QUEUED`.
2. The inquiry arrives at the fhkit inbox with `Reply-To` set to the visitor.
3. Exactly one confirmation arrives at the visitor, in the language the form was
   filled in.

Every refusal on the public branch is a loud error with a code in
`extensions.code`, never a silent drop. The ones worth recognising:
`TEMPLATE_NOT_FOUND` (missing **or** not `isPublic`, the two are deliberately
indistinguishable), `PUBLIC_SEND_RECIPIENT_NOT_ALLOWED`,
`PUBLIC_SEND_RATE_LIMITED` with `retryAfterSeconds`. The messages are German.
