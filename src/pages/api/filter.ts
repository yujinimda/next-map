import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // query string에서 검색어(q), 지역(district), 커서(cursor), 개수(limit) 추출
  // q, district는 기본값을 빈 문자열로 지정하여 필터가 없어도 동작하도록 설정
  const { q = '', district = '', cursor, limit = 20 } = req.query;

  const parsedLimit = Number(limit);
  const parsedCursor = cursor ? Number(cursor) : 0;

  try {
    // DB에서 조건에 맞는 가게 목록 조회
    // skip: parsedCursor만큼 건너뜀
    // take: parsedLimit만큼 데이터 가져옴
    // where: 검색어(name)와 지역(address)에 대한 필터 적용 (AND 조건)
    // contains: 문자열 포함 여부
    // mode: 'insensitive'로 대소문자 구분 없이 검색
    // orderBy: id 오름차순 정렬
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
