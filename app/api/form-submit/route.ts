import {NextResponse} from 'next/server'

type SubmitBody = {
  formName?: string
  recipientEmail?: string
  fields?: Record<string, string>
}

const fallbackEmail = 'contact@wondering.com'
const fallbackFromEmail = 'Wondering <forms@wonderingcic.co.uk>'

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function fieldLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function buildEmailHtml(fields: Record<string, string>) {
  const rows = Object.entries(fields)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `
      <tr>
        <th style="border:1px solid #d9d9d9;padding:10px 12px;text-align:left;vertical-align:top;width:220px;">${escapeHtml(fieldLabel(key))}</th>
        <td style="border:1px solid #d9d9d9;padding:10px 12px;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>
    `)
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;color:#1b143f;">
      <table style="border-collapse:collapse;width:100%;max-width:760px;">
        <tbody>${rows}</tbody>
      </table>
    </div>
  `
}

function buildEmailText(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `${fieldLabel(key)}:\n${value}`)
    .join('\n\n')
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return NextResponse.json({ok: false, message: 'Email service is not configured'}, {status: 500})
  }

  const body = (await request.json()) as SubmitBody
  const recipientEmail = body.recipientEmail && isEmail(body.recipientEmail) ? body.recipientEmail : fallbackEmail
  const formName = body.formName || 'Wondering form'
  const fields = body.fields || {}
  const replyTo = fields.email || fields.Email
  const fromEmail = process.env.RESEND_FROM_EMAIL || fallbackFromEmail

  let response: Response

  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        reply_to: replyTo && isEmail(replyTo) ? replyTo : undefined,
        subject: formName,
        html: buildEmailHtml(fields),
        text: buildEmailText(fields),
      }),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    return NextResponse.json({ok: false, message: 'Unable to submit form'}, {status: 502})
  }

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    const message = typeof result?.message === 'string' ? result.message : 'Unable to submit form'

    return NextResponse.json({ok: false, message}, {status: 502})
  }

  return NextResponse.json({ok: true})
}
