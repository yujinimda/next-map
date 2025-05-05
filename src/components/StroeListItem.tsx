import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function StoreListPage({ store, style }) {
  return (
    <li style={style} className="flex justify-between gap-x-6 py-5 px-5">
      <div className="flex gap-x-4">
        <LazyLoadImage
          src={
            store?.category
              ? `/images/markers/${store?.category}.png`
              : `/images/markers/default.png`
          }
          alt="아이콘 이미지"
          width={48}
          height={48}
          //effect="blur" // 부드럽게 로딩되는 효과 추가
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
  );
}
