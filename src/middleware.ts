import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'x-request-id': req.headers.get('x-request-id') || '',
          },
        },
      }
    );

    // Get session from cookie
    const authCookie = req.cookies.get('sb-auth-token');
    if (authCookie) {
      try {
        const session = JSON.parse(decodeURIComponent(authCookie.value));
        if (session?.access_token) {
          supabase.auth.setSession(session.access_token);
        }
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
      }
    }

    // Refresh session if expired
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return handleUnauthenticated(req);
    }

    // Get the pathname of the request
    const path = req.nextUrl.pathname;

    // Check if the path is for admin routes
    const isAdminRoute = path.startsWith('/admin');
    // Check if the path is for user dashboard
    const isUserDashboard = path.startsWith('/dashboard');

    // If user is not authenticated and trying to access protected routes
    if (!session) {
      if (isAdminRoute || isUserDashboard) {
        return handleUnauthenticated(req);
      }
      return res;
    }

    // If user is authenticated
    if (session) {
      try {
        // Check user role in profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          return handleUnauthenticated(req);
        }

        const isAdmin = profile?.role === 'admin';

        // If trying to access admin routes, check if user is admin
        if (isAdminRoute && !isAdmin) {
          // Redirect to dashboard if not admin
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // If trying to access login page while authenticated
        if (path === '/login') {
          // Redirect to appropriate dashboard based on user role
          return NextResponse.redirect(
            new URL(isAdmin ? '/admin' : '/dashboard', req.url)
          );
        }

        // Set session cookie in response
        if (session.access_token) {
          res.cookies.set({
            name: 'sb-auth-token',
            value: encodeURIComponent(JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at,
            })),
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
          });
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        return handleUnauthenticated(req);
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return handleUnauthenticated(req);
  }
}

function handleUnauthenticated(req: NextRequest) {
  const redirectUrl = new URL('/login', req.url);
  redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
  ],
}; 