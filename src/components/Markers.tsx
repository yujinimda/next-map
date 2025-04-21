// import { StoreType, } from '@/interface';
import { StoreType } from '@/interface';
import { useCallback, useEffect, Dispatch, SetStateAction } from 'react';

interface MarkerProps {
  map: any;
  stores: StoreType[];
  setCurrentStore: Dispatch<SetStateAction<any>>;
}

export default function Markers({ map, stores, setCurrentStore }: MarkerProps) {
  const loadKakaoMarkers = useCallback(() => {
    if (map) {
      //식당 데이터 마커 띄우기
      stores?.map(store => {
        const imageSrc = store?.category //한글명이여서
            ? `/images/markers/${store?.category}.png`
            : 'images/markers/default.png', // 마커이미지의 주소입니다
          imageSize = new window.kakao.maps.Size(40, 40), // 마커이미지의 크기입니다
          imageOption = { offset: new window.kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );
        //마커가 표시될 위치입니다.
        const markerPosition = new window.kakao.maps.LatLng(
          store?.lat,
          store?.lng
        );

        //마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });

        // 마커가 지도 위에 표시 되도록 설정
        marker.setMap(map);

        // 마커 커서가 오버되었을 때 마커 위에 표시할 인포윈도우 생성
        //인포 윈도우에 표시 될 내용
        const content = `<div class='infowindow'>${store?.name}</div>`;

        // 커스텀 오버레이를 생성합니다
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          yAnchor: 0.6, //세로 기준점
          xAnchor: 0.91, //가로 기준점
        });

        // 마커에 마우스오버 이벤트를 등록합니다
        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
          // 마커에 마우스오버 이벤트가 발생하면 커스텀 오버레이를 마커위에 표시합니다
          customOverlay.setMap(map);
        });

        // 마커에 마우스아웃 이벤트를 등록합니다
        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
          // 마커에 마우스아웃 이벤트가 발생하면 커스텀 오버레이를 제거합니다
          customOverlay.setMap(null);
        });
        // 선택한 가게 저장
        window.kakao.maps.event.addListener(marker, 'click', function () {
          setCurrentStore(store);
        });
      });
    }
  }, [map, setCurrentStore, stores]);

  useEffect(() => {
    loadKakaoMarkers();
  }, [loadKakaoMarkers, map]);
  return <></>;
}
