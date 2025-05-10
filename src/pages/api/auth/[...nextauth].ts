// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import KakaoProvider from 'next-auth/providers/kakao';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/\bdb';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || '',
      clientSecret: process.env.NAVER_CLIENT_SECRET || '',
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
      profile(profile) {
        const kakaoAccount = profile.kakao_account || {};
        const profileData = kakaoAccount.profile || {};

        return {
          id: profile.id.toString(),
          name: profileData.nickname || null,
          email: kakaoAccount.email || null, // 이메일이 있을 경우에만
          image: profileData.profile_image_url || null,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('user:', user);
      console.log('account:', account);
      console.log('profile:', profile);
      return true;
    },
  },
});
