import { AiOutlineSearch } from 'react-icons/ai'; // 검색 아이콘
import { DISTRICT_ARR } from '@/data/store'; // 지역 목록 배열

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  district: string;
  onDistrictChange: (value: string) => void;
}

export default function SearchFilter({
  search,
  onSearchChange,
  district,
  onDistrictChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-[10px] pl-6 pr-3">
      <div className="flex items-center w-full gap-2">
        <AiOutlineSearch className="w-6 h-6" />
        <input
          type="search"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="음식점 검색"
          className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-blue-500"
        />
      </div>
      <select
        value={district}
        onChange={e => onDistrictChange(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-sm md:max-w-[200px] rounded-lg focus:border-blue-500 outline-none block w-full p-3"
      >
        <option value="">지역 선택</option>
        {DISTRICT_ARR.map(data => (
          <option value={data} key={data}>
            {data}
          </option>
        ))}
      </select>
    </div>
  );
}
