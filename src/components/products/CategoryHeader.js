
import React, { useState, useEffect, useMemo, useRef } from 'react';

//util
import { Link, useHistory } from 'react-router-dom';
import categoryLeft from '../../assets/images/category/btn_category_left.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay, Controller } from 'swiper/core';
import categoryRight from '../../assets/images/category/btn_category_right.svg';
import { categoriesLinkMap } from '../../const/category';
import { useWindowSize } from '../../utils/utils.js';

const MO = 640;
const TAB = 1_280;

export default function CategoryHeader({category, changeCurrentCategoryByNo}) {
  const history = useHistory();
  const categoryLabel = useMemo(() => {
    const path = category.url.split('/');
    return path[path.length - 1];
  }, [category]);
  
  let backgroundImage = '';
  if (category && category.content) {
    const imageMatch = category.content.match(/(\/\/).+(jpg|png)/g);
    backgroundImage = imageMatch[0] || '';
  }

  let rootParent = category.parent;
  while (rootParent && rootParent.parent) {
    rootParent = category.parent;
  }

  const [currentCategoryNo, setCurrentCategoryNo] = useState(category.categoryNo);

  useEffect(() => {
    setCurrentCategoryNo(category.categoryNo);
  }, [category]);

  useEffect(() => {
    changeCurrentCategoryByNo(currentCategoryNo);
  }, [currentCategoryNo]);

  SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay, Controller]);

  const openLink = ({isAvailableMoveProductCompare, isAvailableMoveAccessoryCompatibility, e}) => {
    if (isAvailableMoveProductCompare) {
      window.open(categoriesLinkMap[categoryLabel], "_blank");
    }

    if (isAvailableMoveAccessoryCompatibility) {
      window.open('https://support.d-imaging.sony.co.jp/www/cscs/accessories/top.php?area=ap&lang=ko', "_blank");
    }

    e.preventDefault();
  };

  // tab 정렬
  const categoryRef = useRef(null);
  const wrapperRef = useRef(null);
  const submenuRef = useRef(null);
  const firstChildRef = useRef(null);

  const size = useWindowSize();

  const displayFirstDepth = () => {
    if (!firstChildRef?.current) return;
    const vw = size.width;
    let itemWidth;
    
    if (vw > TAB) {
      // PC의 경우 중앙 정렬
      wrapperRef.current.classList.add('centered');
      firstChildRef.current.removeAttribute('style');
    } else {
      // mobile의 경우 좌측 정렬
      wrapperRef.current.classList.remove('centered');
      if (vw <= MO) {
        // mobile의 경우
        itemWidth = 304;
      } else {
        // tablet의 경우
        itemWidth = 632;
      };
      if (vw > itemWidth) {
        firstChildRef.current.style.marginLeft = `${(vw - itemWidth) / 2}px`;
      } else {
        firstChildRef.current.removeAttribute('style');
      }
    }
  };

  const categoryRef2 = useRef(null);
  const submenuRef2 = useRef(null);
  const firstChildRef2 = useRef(null);

  const displaySecondDepth = () => {
    if (!submenuRef2?.current) return;
    const vw = size.width;
    const count = 1 + category?.children.length;

    if (vw <= TAB) {
      categoryRef2.current.style.width = `${vw / count}px`;
      firstChildRef2.current.style.display = 'block';
      firstChildRef2.current.style.width = '100%';
      firstChildRef2.current.style.paddingTop = '1em';
      if (vw <= MO) {
        firstChildRef2.current.style.paddingTop = '1.2em';
      } 
    } else {
      submenuRef2.current.removeAttribute("style");
      firstChildRef2.current.removeAttribute("style");
    }
  }

  useEffect(() => {
    displayFirstDepth();
    displaySecondDepth();
  }, [size?.width]);

  useEffect(() => {
    history?.location?.pathname && displayFirstDepth();
  }, [history?.location?.pathname]);

  return (
    <div className={ category?.depth > 1 ? 'category__header category__header__sub' : 'category__header '} style={{backgroundImage: `url(${backgroundImage})`}}>
      {category?.parent && <a href="#" className="category__header__back" onClick={e => {
        history.goBack();
        e.preventDefault();
      }}>{category.parent.label}</a>}

      <h1 className="category__header__name">{category.label}</h1>

      {category?.depth === 1 &&
      <div ref={categoryRef} className="category__header__menu swiper-container">
        <ul ref={wrapperRef} className="swiper-wrapper">
          {category?.children.length > 0 && <li ref={submenuRef} className="swiper-slide all category__header__menu--active"><a ref={firstChildRef}><span>전체보기</span></a></li>}

          {category?.depth === 1 && category?.children.map(c => {
            return <li className="swiper-slide" style={{backgroundImage: `url(${c.icon})`}} key={`sub-category-${c.categoryNo}`}>
              <Link to={c.url}><span>{c.label}</span></Link>
            </li>
          })}
        </ul>
      </div>
      }
      {rootParent &&
        <div className="category__header__links">
          {rootParent.isAvailableMoveProductCompare && <a href="#" className="category__header__link" onClick={e => {
            openLink({isAvailableMoveProductCompare: true, e});
            e.preventDefault();
          }}>제품 비교</a>}
          {(rootParent.isAvailableMoveAccessoryCompatibility && categoryLabel !== 'audio') && <a href="#" className="category__header__link" onClick={e => {
            openLink({isAvailableMoveAccessoryCompatibility: true, e});
          }}>액세서리 호환성</a>}
          {rootParent.isAvailableMoveESP && <Link to="/esp" className="category__header__link">연장 서비스 플랜 ESP 보기</Link>}
        </div>
      }

      {category?.depth > 1 &&
      <div ref={categoryRef2} className="category__header__menu swiper-container">
        {category?.children.length > 2 && <button type="button" className="swiper-button-prev"><img src={categoryLeft} alt="이전" /></button>}

        {category?.children.length > 0 &&
        <Swiper
          ref={wrapperRef}
          className="swiper-wrapper"
          slidesPerView="auto"
          freeMode={true}
          observer={true}
          resizeObserver={true}
          observeParents={true}
          breakpoints={
            {
              320: {
                allowTouchMove: true
              },
              1281: {
                allowTouchMove: false
              }
            }
          }
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
        >
          <SwiperSlide ref={submenuRef2} className={`swiper-slide all ${currentCategoryNo === category.categoryNo ? "category__header__menu--active" : ""}`}>
            <a ref={firstChildRef2} href="#" onClick={e => {
              setCurrentCategoryNo(category.categoryNo);
              e.preventDefault();
              
            }}><span>전체보기</span></a>
          </SwiperSlide>
          {category?.children.map(c => {
            return <SwiperSlide className={`swiper-slide ${currentCategoryNo === c.categoryNo ? "category__header__menu--active" : "" }`} key={`sub-category-${c.categoryNo}`}>
              <a href="#" onClick={e => {
                setCurrentCategoryNo(c.categoryNo);
                e.preventDefault();
              }}><span>{c.label}</span></a>
            </SwiperSlide>
          })}
        </Swiper>
        }
        {category?.children.length > 2 && <button type="button" className="swiper-button-next"><img src={categoryRight} alt="다음" /></button>}
      </div>
      }


    </div>
  );
}


                                    