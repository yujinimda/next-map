//context는 상태이기 때문에 csr에서만 사용이 가능하다.
'use client';
import { SessionProvider } from 'next-auth/react';
type Props = {
  children: React.ReactNode;
};

export default function AuthContext({ children }: Props) {
  return (
    <>
      {/* SessionProvider: 실제 로그인 한 정보 : 세션정보 받아오기 */}
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
