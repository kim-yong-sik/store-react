
import { React ,useState, useEffect, useCallback, useMemo } from 'react';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//lib
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay, Controller } from 'swiper/core';

//lib-css
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import "swiper/swiper.scss"

//api
import { getProductDetail, getProductOptions, getProductSearch } from "../../api/product";

//css
import "../../assets/scss/contents.scss"
import "../../assets/scss/product.scss"

//context
import GlobalContext from '../../context/global.context';

//util
import {useWindowSize} from '../../utils/utils';
import { getInfoLinks, getMainSliderStyle, mapContents } from './utils';
import MainImage from './productView/MainImage';
import TobContent from './productView/TopContent';
import RelatedProducts from './productView/RelatedProducts';
import Event from './productView/Event';
import BottomContent from './productView/BottomContent';
import { useHistory } from 'react-router';
import qs from 'qs';

//image


export default function ProductView({ match, ...props }) {
  const { productNo } = match.params;
  const history = useHistory();

  //ui
  const [headerHeight, setHeaderHeight] = useState(0);
  const size = useWindowSize();

  SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay, Controller]);

  useEffect(()=>{
    const header = document.getElementsByClassName("header").clientHeight;
    setHeaderHeight(header);
  },[]);

  //data
  
  const [productData, setProductData] = useState();
  const [productOptions, setProductOptions] = useState();
  const [contents, setContents] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // product init data

  const mapProductData = useCallback(([productData, optionData]) => {
    setProductData(productData);
    setProductOptions(optionData);
    setContents(mapContents(productData.baseInfo));
  }, [])

  const fetchProductData = useCallback(async (productNo) => {
    const ret = await  Promise.all([
      getProductDetail(productNo),
      getProductOptions(productNo),
    ]);
    mapProductData(ret.map(({ data }) => data));
  }, [mapProductData]);

  const fetchRelatedProducts = useCallback(async (categories) => {
    if (!categories) return;
    
    const ret = await getProductSearch({
      'order.by': 'POPULAR',
      categoryNos: categories
                      .flatMap(({ categories }) => categories)
                      .flatMap(({ categoryNo }) => categoryNo)
                      .join()
    });
    setRelatedProducts(ret.data.items);
  }, [])

  useEffect(() => fetchProductData(productNo), [fetchProductData, productNo]);
  useEffect(() => fetchRelatedProducts(productData?.categories), [fetchRelatedProducts, productData?.categories])

  //
  const showProductDetail = useMemo(() => (headerHeight > 0 || size.height < 1280) && productData, [headerHeight, size.height, productData] )

    return (
      <>        
        <SEOHelmet title={"?????? ??????"} />
        <div className="contents product">
        {
          showProductDetail &&
          <div className="product_view_wrap" style={{backgroundColor:"#fff"}}>
            <div className="product_view_main">
              <div className="prd_main_slider" style={getMainSliderStyle(size)}>
                <MainImage imageUrls={ productData.baseInfo.imageUrls } />
              </div>
              <TobContent 
                baseInfo={productData.baseInfo}
                deliveryFee={productData.deliveryFee}
                price={productData.price}
                options={productOptions?.flatOptions}
                productNo={productNo}
              />
            </div>
            <RelatedProducts 
              products={relatedProducts}
            />
            <Event />
            <div className="product_cont full">
              <div className="relation_link">
                <ul className="link_inner">
                  {
                    getInfoLinks().map(({
                      name,
                      href,
                      imgUrl,
                      label
                    }) => (
                      <li key={ name }>
                        <a 
                          href={href} 
                          className="link_btn" 
                          rel="noreferrer"
                          target="_blank" 
                          title="??? ??? ??????"
                        >
                          <i className="ico">
                            <img src={ imgUrl } alt={ name } />
                          </i>
                          <span className="link_txt">{ label }</span>
                        </a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            {/* ?????? ??? ?????? */}
            <BottomContent 
              contents={contents}
            />
          </div>
        }
        </div>
      </>  
    )
}