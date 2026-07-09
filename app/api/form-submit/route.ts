import {NextResponse} from 'next/server'

type SubmitBody = {
  formName?: string
  recipientEmail?: string
  fields?: Record<string, string>
}

const fallbackEmail = 'contact@wondering.com'

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitBody
  const recipientEmail = body.recipientEmail && isEmail(body.recipientEmail) ? body.recipientEmail : fallbackEmail
  const formName = body.formName || 'Wondering form'
  const fields = body.fields || {}
  const origin = request.headers.get('origin') || new URL(request.url).origin
  const referer = request.headers.get('referer') || `${origin}/contact`

  const payload = new FormData()
  payload.set('_subject', formName)
  payload.set('_template', 'table')
  payload.set('_captcha', 'false')
  payload.set('_replyto', fields.email || fields.Email || '')

  for (const [key, value] of Object.entries(fields)) {
    payload.set(key, value)
  }

  let response: Response

  try {
    response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Origin: origin,
        Referer: referer,
      },
      body: payload,
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    return NextResponse.json({ok: false, message: 'Unable to submit form'}, {status: 502})
  }

  const result = await response.json().catch(() => null)

  if (!response.ok || result?.success === false || result?.success === 'false') {
    const message = typeof result?.message === 'string' ? result.message : 'Unable to submit form'

    return NextResponse.json({ok: false, message}, {status: 502})
  }

  return NextResponse.json({ok: true})
}
