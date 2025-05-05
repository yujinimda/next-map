'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import Markers from '@/components/Markers';
import StoreBox from '@/components/StoreBox';
//프리스마가 있는데 StoreType 이거 필요한가?
import { StoreType } from '@/interface';
//그냥 아예 디비 접근으로 수정하자
import { PrismaClient } from '@prisma/client';

//프리스마를 통해서 수퍼베이스 db접근
const prisma = new PrismaClient();

export default function Home({ stores }: { stores: StoreType[] }) {
  const [map, setMap] = useState(null);
  //[다시보기] 뭘 저장 하는거였지 얘는??
  const [currentStore, setCurrentStore] = useState(null);

  return (
    <>
      <Map setMap={setMap} />
      <Markers stores={stores} map={map} setCurrentStore={setCurrentStore} />
      <StoreBox store={currentStore} setStore={setCurrentStore} />
    </>
  );
}

//store에 데이터를 가져온다
export async function getStaticProps() {
  const stores = await prisma.store.findMany();

  return {
    props: { stores },
    revalidate: 60 * 60,
  };
}
