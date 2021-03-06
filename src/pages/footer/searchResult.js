import { React, useEffect, useState } from 'react';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//api
import { productSearch } from "../../api/product";

//css
import "../../assets/scss/contents.scss"
import "../../assets/scss/category.scss"

//lib
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay, Controller } from 'swiper/core';

//lib-css
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import "swiper/swiper.scss"

//utils
import {useWindowSize} from '../../utils/utils'
import Product from '../../components/Product';

export default function SearchResult({match}) {
    const {keyword} = match.params;

    const size = useWindowSize();

    //ui
    const [tabState, setTabState] = useState("total");
    const [mobileOrderOpen, setMobileOrderOpen] = useState(false);

    //data
    const [productList, setProductList] = useState([]);
    const [exhibitionList, setExhibitionList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [noticeList, setNoticeList] = useState([]);

    //data-else
    const [productCount, setProductCount] = useState(0);
    const [exhibitionCount, setExhibitionCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [noticeCount, setNoticeCount] = useState(0);

    //keyword
    const [searchKeyword, setSearchKeyword] = useState(keyword);
    const [finalKeyword, setFinalKeyword] = useState(keyword);

    //sort
    const [orderBy, setOrderBy] = useState('RECENT_PRODUCT');

    const _productSearch = async(_keyword, _orderBy) => {
        const response = await productSearch(_keyword, _orderBy);
        if(response.status == 200){
          if(response.data.items){
            setProductList(response.data.items)
          }
          setProductCount(response.data.totalCount);          
        }

        console.log(response)
    }

    useEffect(()=>{
      _productSearch(finalKeyword, orderBy)
    },[finalKeyword, orderBy])


    SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay, Controller]);
    
    return (
        <>
        <SEOHelmet title={"?????? ?????? ?????????"} />
        <div className="contents category">

        <div className="container">
  <div className="content no_margin">{/* ?????? ?????? ???????????? no_margin ????????? ?????? */}
    {/* ?????? ?????? ?????? */}
    <div className="searchResult">
      <div className="searchResult__form">
        <form>
          <label htmlFor="search-input">????????????</label>
          <input type="text" id="search-input" className="input-txt" defaultValue={searchKeyword} onChange={(e)=>{
            setSearchKeyword(e.target.value)
          }} />
          <button type="button" className="btn_search" title="??????" onClick={()=>{
            _productSearch(searchKeyword)
            setFinalKeyword(searchKeyword)
          }}>??????</button>
        </form>
      </div>
      <div className="result-message">
        <p>
          <strong>???{finalKeyword}???</strong>??? ?????? ??????????????? ??? <strong>{productCount + exhibitionCount + categoryCount + noticeCount}</strong>??? ?????????.
        </p>
      </div>
    </div>
    {/*// ?????? ?????? ?????? */}
    {/* ???????????? ????????? */}
        { 
            size.width < 1281 ?
            <div className="swipe_tab swiper-container">

        <Swiper className="swiper-wrapper"
        navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }}
        slidesPerView="auto"
        freeMode={true}
      >
        <SwiperSlide className={`swiper-slide ${tabState == "total" ? "active" : ""}`}>
          <a  onClick={()=>{
            setTabState("total");
          }}>?????? ({productCount + exhibitionCount + categoryCount + noticeCount})</a>
        </SwiperSlide>
        <SwiperSlide className={`swiper-slide ${tabState == "product" ? "active" : ""}`}>
          <a  onClick={()=>{
            setTabState("product");
          }}>?????? ({productCount})</a>
        </SwiperSlide>
        <SwiperSlide className={`swiper-slide ${tabState == "exhibition" ? "active" : ""}`}>
          <a  onClick={()=>{
            setTabState("exhibition");
          }}>????????? ({exhibitionCount})</a>
        </SwiperSlide>
        <SwiperSlide className={`swiper-slide ${tabState == "category" ? "active" : ""}`}>
          <a  onClick={()=>{
            setTabState("category");
          }}>???????????? ({categoryCount})</a>
        </SwiperSlide>
        <SwiperSlide className={`swiper-slide ${tabState == "notice" ? "active" : ""}`}>
          <a  onClick={()=>{
            setTabState("notice");
          }}>???????????? ({noticeCount})</a>
        </SwiperSlide>
        </Swiper>
      <div className="swiper-button-prev">
      <a  title="?????? ?????????">?????? ?????????</a>
    </div>
    <div className="swiper-button-next">
      <a  title="?????? ?????????">?????? ?????????</a>
    </div>
  </div>
        :
<div class="swipe_tab swiper-container">
        <ul class="swiper-wrapper">
          <li className={`swiper-slide ${tabState == "total" ? "active" : ""}`}>
            <a  onClick={()=>{
            setTabState("total");
          }}>?????? ({productCount + exhibitionCount + categoryCount + noticeCount})</a>
          </li>
          <li className={`swiper-slide ${tabState == "product" ? "active" : ""}`}>
            <a  onClick={()=>{
            setTabState("product");
          }}>?????? ({productCount})</a>
          </li>
          <li className={`swiper-slide ${tabState == "exhibition" ? "active" : ""}`}>
            <a  onClick={()=>{
            setTabState("exhibition");
          }}>????????? ({exhibitionCount})</a>
          </li>
          <li className={`swiper-slide ${tabState == "category" ? "active" : ""}`}>
            <a  onClick={()=>{
            setTabState("category");
          }}>???????????? ({categoryCount})</a>
          </li>
          <li className={`swiper-slide ${tabState == "notice" ? "active" : ""}`}>
            <a  onClick={()=>{
            setTabState("notice");
          }}>???????????? ({noticeCount})</a>
          </li>
        </ul>
        <div class="swiper-button-prev">
          <a  title="?????? ?????????">?????? ?????????</a>
        </div>
        <div class="swiper-button-next">
          <a  title="?????? ?????????">?????? ?????????</a>
        </div>
      </div>

        }
                <div className="product">


    { (tabState == "total" || tabState == "product") &&
      <>
      <div className="section_top">
        <h2 className="title">??????<span>({productCount})</span></h2>
        <div className={`itemsort ${mobileOrderOpen ? "itemsort--open" : ""}`} aria-label="?????? ??????">
                    <button className="itemsort__button" onClick={()=>{
                        setMobileOrderOpen(!mobileOrderOpen)
                    }}>
                        <span className="itemsort__button__label sr-only">????????????:</span>
                        <span className="itemsort__button__selected">{orderBy == "RECENT_PRODUCT" ? "?????????" : (orderBy == "TOP_PRICE" ? "?????? ?????????" : "?????? ?????????")}</span>
                    </button>
          <div className="itemsort__drawer">
                        <ul className="itemsort__items">
                        <li className={`itemsort__item ${orderBy == "RECENT_PRODUCT" ? "itemsort__item--active" : ""}`}><a  className="itemsort__item__link" onClick={()=>{
                            setOrderBy("RECENT_PRODUCT")
                        }}>?????????</a></li>
                        <li className={`itemsort__item ${orderBy == "TOP_PRICE" ? "itemsort__item--active" : ""}`}><a  className="itemsort__item__link" onClick={()=>{
                            setOrderBy("TOP_PRICE")
                        }}>?????? ?????????</a></li>
                        <li className={`itemsort__item ${orderBy == "DISCOUNTED_PRICE" ? "itemsort__item--active" : ""}`}><a  className="itemsort__item__link" onClick={()=>{
                            setOrderBy("DISCOUNTED_PRICE")
                        }}>?????? ?????????</a></li>
                        </ul>
                    </div>
        </div>      
        </div>
      {/* item-list */}
      <div className="product__list product__list--lite">
        {/* item */}
        {productList && productList.map((item, itemIndex) => {
          return(<Product product={item} />)
        })}

      </div>
      {/* ????????? ???????????? */}
      <div className="btn_area">
        <button type="button" className="btn_more" title="?????? ?????????">?????????<span className="ico_plus" /></button>
      </div>
      {/*// ????????? ???????????? */}
      </>
    }

      {/* ????????? ????????? ?????? */}

      {
        (tabState == "total" || tabState == "exhibition") &&
          <>
      <div className="section_top">
        <h2 className="title">?????????<span>({exhibitionCount})</span></h2>
        <div className="itemsort" aria-label="????????? ??????">
          <button className="itemsort__button">
            <span className="itemsort__button__label sr-only">????????????:</span>
            <span className="itemsort__button__selected">?????????</span>
          </button>
          <div className="itemsort__drawer">
            <ul className="itemsort__items">
              <li className="itemsort__item itemsort__item--active"><a  className="itemsort__item__link">?????????</a></li>
              <li className="itemsort__item"><a  className="itemsort__item__link">????????????</a></li>
            </ul>
          </div>
        </div>      </div>
      <ul className="product_List grid">
        <li>
          <div className="grid_inner">
            <div className="grid_img">
              <a href="#none">
                <img src="/images/_tmp/@tmp_img04.png" alt="" />
              </a>
            </div>
            <dl className="grid_info">
              <dt><a href="#none">5?????? ??????</a></dt>
              <dd>2021. 05. 10 ~ 2021. 05. 23</dd>
            </dl>
          </div>
        </li>
        <li>
          <div className="grid_inner">
            <div className="grid_img">
              <a href="#none">
                <img src="/images/_tmp/@tmp_img05.png" alt="" />
              </a>
            </div>
            <dl className="grid_info">
              <dt><a href="#none">??????, ?????? ????????????????</a></dt>
              <dd>2021. 05. 10 ~ 2021. 05. 23</dd>
            </dl>
          </div>
        </li>
        <li>
          <div className="grid_inner">
            <div className="grid_img">
              <a href="#none">
                <img src="/images/_tmp/@tmp_img06.png" alt="" />
              </a>
            </div>
            <dl className="grid_info">
              <dt><a href="#none">??????, ????????? ??????</a></dt>
              <dd>2021. 05. 10 ~ 2021. 05. 23</dd>
            </dl>
          </div>
        </li>
        <li>
          <div className="grid_inner">
            <div className="grid_img">
              <a href="#none">
                <img src="/images/_tmp/@tmp_img07.png" alt="" />
              </a>
            </div>
            <dl className="grid_info">
              <dt><a href="#none">??????????????? ?????? ?????? ?????????</a></dt>
              <dd>2021. 05. 10 ~ 2021. 05. 23</dd>
            </dl>
          </div>
        </li>
        <li>
          <div className="grid_inner">
            <div className="grid_img">
              <a href="#none">
                <img src="/images/_tmp/@tmp_img08.png" alt="" />
              </a>
            </div>
            <dl className="grid_info">
              <dt><a href="#none">????????? ????????? ?????? ????????? ?????????<br />CMT-X3CD</a></dt>
              <dd>2021. 05. 10 ~ 2021. 05. 23</dd>
            </dl>
          </div>
        </li>
        <li>
          <div className="grid_inner">
            <div className="grid_img">
              <a href="#none">
                <img src="/images/_tmp/@tmp_img09.png" alt="" />
              </a>
            </div>
            <dl className="grid_info">
              <dt><a href="#none">??????????????? ????????? ????????? ?????????<br />????????? ?????? ?????????</a></dt>
              <dd>2021. 05. 10 ~ 2021. 05. 23</dd>
            </dl>
          </div>
        </li>
      </ul>
      {/* ????????? ???????????? */}
      <div className="btn_area">
        <button type="button" className="btn_more" title="????????? ?????????">?????????<span className="ico_plus" /></button>
      </div>
      {/*// ????????? ???????????? */}
      {/*// ????????? ????????? ?????? */}
          </>
      }

{
        (tabState == "total" || tabState == "category") &&
          <>
                {/* ???????????? ????????? ?????? */}
      <div className="section_top">
        <h2 className="title">????????????<span>({categoryCount})</span></h2>
      </div>
      <div className="result_list">
        <ul className="category">
          <li>
            <a href="#none">
              <span>??????</span><span>?????????</span><span>?????????/?????????</span><strong className="keword">          ??????</strong>
            </a>
          </li>
          <li>
            <a href="#none">
              <span>??????</span><span>?????????</span><span>?????????/?????????</span><strong className="keword">????????? ??????????????? ??????????????? ??????</strong>
            </a>
          </li>
          <li>
            <a href="#none">
              <span>??????</span><span>?????????</span><span>?????????/?????????</span><strong className="keword">????????? ???????????????</strong>
            </a>
          </li>
        </ul>
      </div>
      {/* ????????? ???????????? */}
      <div className="btn_area">
        <button type="button" className="btn_more" title="???????????? ?????????">?????????<span className="ico_plus" /></button>
      </div>
      {/*// ????????? ???????????? */}
      {/* ???????????? ????????? ?????? */}
          </>
}


{
        (tabState == "total" || tabState == "notice") &&
          <>
                {/* ???????????? ????????? ?????? */}
      <div className="section_top">
        <h2 className="title">????????????<span>({noticeCount})</span></h2>
        <div className="itemsort" aria-label="????????? ??????">
          <button className="itemsort__button">
            <span className="itemsort__button__label sr-only">????????????:</span>
            <span className="itemsort__button__selected">?????????</span>
          </button>
          <div className="itemsort__drawer">
            <ul className="itemsort__items">
              <li className="itemsort__item itemsort__item--active"><a  className="itemsort__item__link">?????????</a></li>
              <li className="itemsort__item"><a  className="itemsort__item__link">????????????</a></li>
            </ul>
          </div>
        </div>      </div>
      <div className="result_list">
        <ul className="noti">
          <li>
            <a href="#none">
              <span className="num">29240</span>
              <span className="tit">???????????? ???????????? MDR HRA <strong className="keword">?????????</strong> ???????????? ????????? ????????? ??????</span>
              <span className="date">2015. 08. 11</span>
            </a>
          </li>
          <li>
            <a href="#none">
              <span className="num">29240</span>
              <span className="tit">?????? <strong className="keword">?????????</strong> ?????? ???????????? ????????? ??????</span>
              <span className="date">2015. 08. 11</span>
            </a>
          </li>
        </ul>
      </div>
      {/* ????????? ???????????? */}
      <div className="btn_area">
        <button type="button" className="btn_more" title="???????????? ?????????">?????????<span className="ico_plus" /></button>
      </div>
      {/*// ????????? ???????????? */}
      {/* ???????????? ????????? ?????? */}
          </>
}
    </div>
  </div>
</div>
</div>


        </>
    );
}