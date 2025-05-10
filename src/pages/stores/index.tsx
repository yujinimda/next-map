'use client';

//import { StoreType } from '@/interface';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { useEffect, useRef, useState } from 'react';
import StoreListItem from '@/components/StroeListItem';
import { FixedSizeList } from 'react-window'; // dom 가상화
import AutoSizer from 'react-virtualized-auto-sizer';
import SearchFilter from '@/components/SearchFilter';

//클라이언트는 /api/stores?limit=20 요청함
//서버는 20개 보내주고, 마지막 아이템의 id를 nextCursor로 줌
//클라이언트는 그걸 lastStoreId로 저장하고 다음 요청에 씀
export default function StoreListPage() {
  const listRef = useRef(null);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const isFilterActive = search !== '' || district !== '';

  const getGoodPlaceList = async ({ pageParam = null }) => {
    const url = isFilterActive
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/filter` //  필터용 API
      : `${process.env.NEXT_PUBLIC_API_URL}/api/stores`; //  기본 목록 API

    const res = await axios.get(url, {
      params: {
        limit: 20,
        cursor: pageParam,
        q: search,
        district,
      },
    });

    return {
      data: res.data.stores,
      nextCursor: res.data.nextCursor,
    };
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
    ['goodPlaceList', search, district], //data의 이름 : goodPlaceList , 서치값, 선택한 디렉토리값 넘기기
    () => getGoodPlaceList(search, district), //fetch callback, 위 data를 불러올 함수
    {
      // 💡 getNextPageParams가 무한스크롤의 핵심이다.
      // getNextPageParms 메서드가 falsy한 값을 반환하면 추가 fetch를 실행하지 않는다.
      // falsy하지 않은 값을 return할 경우 Number로 리턴해야 한다.
      // 위의 fetch callback의 인자로 자종으로 pageParam을 전달.
      // useInfiniteQuery의 getNextPageParam 시그니처
      // 첫 번째 인자 lastPage: 가장 마지막으로 받아온 페이지 (필수)
      // 두 번째 인자 allPage: 지금까지 받아온 모든 페이지 배열 (써야할때 사용)
      // 언제 allPage를 사용하는데? 총 페이지 수를 제한하고 싶을때, 중복 커서 방지, 전체길이 판단할때(allPage.length)
      getNextPageParam: lastPage => {
        //console.log('📦 lastPage:', lastPage.nextCursor);

        //nudefined 지워야해?
        return lastPage.nextCursor ?? undefined;
      },
    }
  );

  const allStores = data?.pages.flatMap(p => p.data) || [];

  //복원
  useEffect(() => {
    const saved = localStorage.getItem('storeScrollIndex');
    const index = saved ? parseInt(saved, 10) : 0;
    requestAnimationFrame(() => {
      listRef.current?.scrollToItem(index, 'start');
    });
  }, [data]);

  return (
    <div className="h-[calc(100vh-73px)] w-full overflow-hidden mt-[20px]">
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        district={district}
        onDistrictChange={setDistrict}
      />
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            ref={listRef}
            itemCount={allStores.length}
            itemSize={100}
            onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
              localStorage.setItem(
                'storeScrollIndex',
                String(visibleStartIndex)
              );

              if (
                hasNextPage &&
                visibleStopIndex >= allStores.length - 1 &&
                !isFetchingNextPage
              ) {
                fetchNextPage();
              }
            }}
          >
            {({ index, style }) => (
              <StoreListItem store={allStores[index]} style={style} />
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
}
