import Link from 'next/link';
import { useState } from 'react';
import { IoMenu } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className="navbar">
        <Link className="navbar__logo" href="/">
          nextmap
        </Link>
        <div className="navbar__list">
          <Link href="/stores" className="navbar__list--item">
            맛집 목록
          </Link>
          <Link href="/stores/new" className="navbar__list--item">
            맛집 등록
          </Link>
          <Link href="/users/likes" className="navbar__list--item">
            찜한 가게
          </Link>
          <Link href="/users/login" className="navbar__list--item">
            로그인
          </Link>
        </div>
        {/* 모바일 버튼 */}
        <div
          role="presentation"
          className="navbar__button"
          onClick={() => setIsOpen(val => !val)}
        >
          {isOpen ? <IoClose /> : <IoMenu />}
        </div>
      </div>
      {/* mobile navbar */}
      {isOpen && (
        <div className="navbar--mobile">
          <div className="navbar__list--mobile">
            <Link href="/stores" className="navbar__list--item--mobile">
              맛집 목록
            </Link>
            <Link href="/stores/new" className="navbar__list--item--mobile">
              맛집 등록
            </Link>
            <Link href="/users/likes" className="navbar__list--item--mobile">
              찜한 가게
            </Link>
            <Link href="/users/login" className="navbar__list--item--mobile">
              로그인
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
