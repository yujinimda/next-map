import type { NextApiRequest, NextApiResponse } from 'next';
import { StoreType } from '@/interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreType[]>
) {
  //서버는 20개로 limit 설정
  const limit = parseInt((req.query.limit as string) || '20');
  const cursor =
    req.query.cursor !== undefined ? Number(req.query.cursor) : null;

  //const cursor = req.query.cursor ? Number(req.query.cursor) : null;

  let stores;

  if (cursor) {
    stores = await prisma.store.findMany({
      take: limit,
      skip: 1,
      cursor: { id: cursor },
      orderBy: { id: 'asc' },
    });
  } else {
    stores = await prisma.store.findMany({
      take: limit,
      orderBy: { id: 'asc' },
    });
  }

  //서버는 위에 20개로 설정하고 마지막 아이템의 아이디를 nextCursor로 설정
  const nextCursor =
    stores.length === limit ? stores[stores.length - 1].id : null;

  res.status(200).json({ stores, nextCursor });
  console.log('📌 cursor:', cursor);
  console.log('stores.length:', stores.length);
  console.log('last store:', stores[stores.length - 1]);
  console.log('📌 nextCursor:', nextCursor);
}
