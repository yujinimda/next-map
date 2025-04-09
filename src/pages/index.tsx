/* glbal kakao */
import MapTest from '@/components/Map';
import Script from 'next/script';

const { kakao } = window;

declare global {
  interface Window {
    kakao: any;
  }
}
export default function Home() {
  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      new window.kakao.maps.Map(mapContainer, mapOption);
    });
  };
  return (
    <>
      <MapTest />
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=%REACT_APP_KAKAOMAP_KEY%&libraries=services,clusterer"
        onReady={loadKakaoMap}
      />
      <div id="map" className="w-full h-screen"></div>
    </>
  );
}
