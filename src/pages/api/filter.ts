import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q = '', district = '', cursor, limit = 20 } = req.query;

  const parsedLimit = Number(limit);
  const parsedCursor = cursor ? Number(cursor) : 0;

  try {
    const stores = await prisma.store.findMany({
      skip: parsedCursor,
      take: parsedLimit,
      where: {
        AND: [
          q
            ? {
                name: {
                  contains: String(q),
                  mode: 'insensitive', // 대소문자 구분 없이 검색
                },
              }
            : {},
          district
            ? {
                address: {
                  contains: String(district),
                  mode: 'insensitive',
                },
              }
            : {},
        ],
      },
      orderBy: {
        id: 'asc',
      },
    });

    const nextCursor =
      stores.length === parsedLimit ? parsedCursor + parsedLimit : null;

    res.status(200).json({
      stores,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 에러' });
  }
}
