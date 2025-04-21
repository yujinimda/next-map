This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

# next-map

<!-- Next.js API Routes -->

Next.js 안에서 서버 API를 만들 수 있는 기능
즉, 백엔드 서버 따로 만들 필요 없이
pages/api/ 폴더에 파일만 만들면 바로 API가 된다
req: 브라우저가 보낸 요청 정보 (method, body, query 등)
res: 서버가 돌려주는 응답 정보 (상태 코드 + JSON 데이터)

<!-- React Query -->

[useQuery]
fetch() 같은 API 요청을 대신 관리
자동 캐싱

[자동리패치]
리로딩/리페치 처리
로딩, 에러 상태 관리
서버 상태를 클라이언트에 안전하게 반영

<!-- Axios -->

HTTP 클라이언트 라이브러리
기본 fetch API 보다 HTTP 요청 및 응답 처리, 설정, 요청 취소등의 부분에서 더 풍부한 기능을 제공
