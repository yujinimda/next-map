'use client';

import Image from 'next/image';
//import { StoreType } from '@/interface';
import axios from 'axios';
//import { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useEffect, useRef } from 'react';

//클라이언트는 /api/stores?limit=20 요청함
//서버는 20개 보내주고, 마지막 아이템의 id를 nextCursor로 줌
//클라이언트는 그걸 lastStoreId로 저장하고 다음 요청에 씀
export default function StoreListPage() {
  const loadMoreRef = useRef(null);
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

  //스크롤이 페이지 하단에 도달했을 떄 자동으로 fetchNextPage()를 실행
  useEffect(() => {
    //아직 ref가 없거나, 더 불러올 페이지가 없으면 실행하지 않는다.
    //loadMoreRef.current: 화면에 표시된 로딩용 div가 DOM에 존재하는지 확인
    //hasNextPage: React Query가 다음 페이지가 있는지 알려줌
    if (!loadMoreRef.current || !hasNextPage) return;

    //IntersectionObserver: 특정 요소가 뷰포트에 들어오는지 감지하는 브라우저 API
    //entry.isIntersecting: 요소가 화면에 들어오면 true가 됨
    //threshold: 1; 요소 전체가 화면에 100% 보여질 때만 트리거됨(스크롤 끝 감지)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage(); // 실제 다음 페이지 요청
        }
      },
      { threshold: 1 }
    );

    //감시를 시작함: loadMoreRef가 가리키는 div가 화면에 들어오면 fetchNextPage() 실행
    observer.observe(loadMoreRef.current);

    //useEffect 클린업 함수로 컴포넌트가 리렌더링되면 기존 observer 제거
    //메모리 누수 방지 및 중복 observe 방지
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

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

      {/* 감시용 div */}
      <div ref={loadMoreRef} className="h-40" />
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
