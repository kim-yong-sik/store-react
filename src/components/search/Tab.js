import React from 'react';

//lib-css
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/swiper.scss';
import { Swiper, SwiperSlide } from 'swiper/react';

import { TAB_MAP } from '../../const/search';

const tabs = Object.keys(TAB_MAP);

export default function Tab({ tabState, setTabState, count }) {
  return (
    <>
      <div className="swipe_tab swiper-container">
        <div className="swiper-button-prev">
          <a href="#" title="메뉴 더보기">
            메뉴 더보기
          </a>
        </div>
        <Swiper
          className="swiper-wrapper"
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          tag={'ul'}
          slidesPerView={'auto'}
          freeMode={true}
        >
          {tabs.map((tab, idx) => (
            <SwiperSlide key={`${tab}${idx}`} className={`swiper-slide ${tabState === tab && 'active'}`} tag={'li'}>
              <a
                href={`#${tab}`}
                onClick={(event) => {
                  event.preventDefault();
                  setTabState(tab);
                }}
              >
                {TAB_MAP[tab]}
                {`(${count[tab]})`}
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-next">
          <a href="#" title="메뉴 더보기">
            메뉴 더보기
          </a>
        </div>
      </div>
    </>
  );
}
