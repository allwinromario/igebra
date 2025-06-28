import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  console.log('Middleware processing path:', pathname);

  // Check if we're on the loading page
  if (pathname === '/loading') {
    return res;
  }

  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Session status:', session ? 'Authenticated' : 'Not authenticated');

  // Handle root path
  if (pathname === '/') {
    console.log('First visit, redirecting to loading page');
    return NextResponse.redirect(new URL('/loading', request.url));
  }

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log('No session, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return res;
  }

  // Auth routes (login, register)
  if (pathname.startsWith('/auth/')) {
    if (session) {
      console.log('Session exists, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return res;
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 