// auth.ts - auth 설정파일
// auth.d.ts - auth type 설정파일
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});
