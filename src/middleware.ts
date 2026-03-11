/**
 * Middleware disabled — no Supabase backend for portfolio site.
 * Re-enable by uncommenting the original code below.
 */

// import { type NextRequest } from 'next/server';
// import { updateSession } from '@/lib/supabase/middleware';
//
// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }
//
// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };
