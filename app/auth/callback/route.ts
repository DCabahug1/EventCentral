import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'
import { safeNextPath } from '@/lib/redirect'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const cookieStore = await cookies()
  const cookieNext = cookieStore.get('auth_next')?.value
  // Prefer the query param; fall back to the cookie set before OAuth started.
  // Supabase's OAuth flow can drop query strings from `redirectTo`, so the
  // cookie keeps us from defaulting to `/discover` when a real `next` exists.
  const rawNext =
    searchParams.get('next') ??
    (cookieNext ? decodeURIComponent(cookieNext) : null)
  const next = safeNextPath(rawNext)

  const buildResponse = (url: string) => {
    const response = NextResponse.redirect(url)
    response.cookies.delete('auth_next')
    return response
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return buildResponse(`${origin}${next}`)
      } else if (forwardedHost) {
        return buildResponse(`https://${forwardedHost}${next}`)
      } else {
        return buildResponse(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return buildResponse(`${origin}/auth/auth-code-error`)
}
