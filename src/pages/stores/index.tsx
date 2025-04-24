'use client';

import Image from 'next/image';
import { StoreType } from '@/interface';
import axios from 'axios';
//import { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';

interface Props {
  stores: StoreType[];
  nextCursor: number | null;
}

//클라이언트는 /api/stores?limit=20 요청함
//서버는 20개 보내주고, 마지막 아이템의 id를 nextCursor로 줌
//클라이언트는 그걸 lastStoreId로 저장하고 다음 요청에 씀
export default function StoreListPage({ stores, nextCursor }: Props) {
  // const storesData = () => {
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/stores?limit=20&cursor=${nextCursor}`
  //     )
  //     .then(res => console.log(res));
  // };

  // useEffect(() => {
  //   storesData();
  // }, []);

  const getGoodPlaceList = async ({ pageParam = null }) => {
    const params: any = { limit: 20 };
    if (pageParam !== null && pageParam !== undefined) {
      params.cursor = pageParam;
    }

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stores`,
      {
        params,
      }
    );

    return {
      data: res.data.stores, // 배열
      nextCursor: res.data.nextCursor, //다음커서
    };

    // return axios
    //   .get(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/stores?limit=20&cursor=${nextCursor}`,
    //     {
    //       params: {
    //         limit: 20,
    //         cursor: pageParam,
    //       },
    //     }
    //   )
    //   .then(res => res?.data);
  };

  const {
    data,
    error, // error객체
    fetchNextPage, // 다음 페이지를 불러오는 함수
    hasNextPage, // 다음 페이지가 있는지 여부, Boolean (가져올 수 있는 다음페이지가 있는 경우 true)
    isFetching, // 첫 페이지 fetching 여부, Boolean
    isFetchingNextPage, // 추가 페이지 fetching 여부, Boolean (다음 페이지를 가져오는 동안 true)
    status, // loading, error, success 중 하나의 상태, string
    //data.pages, //: 모든 페이지 데이터를 포한하는 배열이다.
    //data.pageParams, //: 모든 페이지 매개변수를 포함하는 배열이다.
    //fetchPreviousPage : 이전 페이지를 fetch 할 수 있다.
    //isFetchingPreviousPage : fetchPreviousPage 메서드가 이전 페이지를 가져오는 동안 true
    //hasPreviousPage : 가져올 수 있는 이전 페이지가 있을 경우 true
  } = useInfiniteQuery(
    'goodPlaceList', //data의 이름
    getGoodPlaceList, //fetch callback, 위 data를 불러올 함수
    {
      // 💡 getNextPageParams가 무한스크롤의 핵심이다.
      // getNextPageParms 메서드가 falsy한 값을 반환하면 추가 fetch를 실행하지 않는다.
      // falsy하지 않은 값을 return할 경우 Number로 리턴해야 한다.
      // 위의 fetch callback의 인자로 자종으로 pageParam을 전달.
      getNextPageParam: lastPage => {
        console.log('📦 lastPage:', lastPage.nextCursor);
        return lastPage.nextCursor ?? undefined;
      },
    }
  );

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <ul role="list" className="divide-y divide-gray-100">
        {data?.pages
          .flatMap(p => p.data)
          .map((store, index) => (
            <li className="flex justify-between gap-x-6 py-5" key={index}>
              <div className="flex gap-x-4">
                <Image
                  src={
                    store?.category
                      ? `/images/markers/${store?.category}.png`
                      : '/images/markers/default.png'
                  }
                  width={48}
                  height={48}
                  alt="아이콘 이미지"
                />
                <div>
                  <div className="text-sm font-semibold leading-6 text-gray-900">
                    {store?.name}
                  </div>
                  <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                    {store?.storeType}
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <div className="text-sm font-semibold leading-6 text-gray-900">
                  {store?.address}
                </div>
                <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                  {store?.phone || '번호없음'} | {store?.foodCertifyName} |{' '}
                  {store?.category}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

// export async function getServerSideProps() {
//   //console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);

//   const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);

//   return {
//     props: { stores: stores.data },
//   };
// }
