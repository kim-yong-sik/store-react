import qs from 'qs';
import React, { useContext, useState, createRef, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import GlobalContext from "../../../context/global.context";
import { getCart, postCart, postOrderSheets, postPaymentsReserve } from "../../../api/order";
import { postProfileLikeProducts } from "../../../api/product";
import Alert from '../../common/Alert';
import Notification from '../Notification';
import { useAlert } from '../../../hooks';
import gc from '../../../storage/guestCart';
import HsValidator from '../../cart/HsValidator';
import _, { add } from 'lodash';

const getOrderSheetNo = async (productNo, selectedOption) => {
  try {
    const { data } = await postOrderSheets({
      productCoupons: null,
      trackingKey: null,
      cartNos: null,
      channelType: null,
      products: selectedOption.map(p => ({
        channelType: null,
        orderCnt: p.buyCnt,
        optionInputs: null,
        optionNo: p.optionNo,
        productNo: p.productNo ?? productNo
      }))
    });
    return data;
  } catch(e) {
    console.error(e);
  }
};

const getCartRequest = (productNo, options) => {
  return options.map(
    ({ buyCnt, ...rest }) => ({
      productNo,
      orderCnt: buyCnt,
      channelType: null,
      optionInputs: null,
      ...rest,
    })
  )
};

const ERROR_CODE_MAPPING_ROUTE = {
  O8001: {
    msg: `회원만 구매 가능한 상품입니다.<br/>로그인해 주세요.`,
    route: '/member/login',
  },

};

const mergeWithOrderCnt = (accProduct, currProduct) => {
      if (accProduct.productNo === currProduct.productNo) {
        accProduct.orderCnt = accProduct.orderCnt + currProduct.orderCnt;
      } else {
        accProduct = {
          ...accProduct,
          ...currProduct,
        }
      };
      return accProduct;
    }

export default function ButtonGroup ({ selectedOption, productNo, canBuy, wish, setWish, saleStatus, memberOnly, hsCode, isMobileSize, setOptionVisible, optionVisible, limitaions }) {
  const $body = document.querySelector('body');
  const history = useHistory();
  const { openAlert, closeModal, alertVisible, alertMessage } = useAlert();
  const { isLogin } = useContext(GlobalContext);
  const [giftVisible, setGiftVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [wishVisible, setWishVisible] = useState(false);
  const [orderVisible, setOrderVisible] = useState(false);

  const maxBuyTimeCnt = useMemo(() => limitaions?.maxBuyTimeCnt, [limitaions]);

  const preventScroll = value => value ? $body.classList.add('no_scroll') : $body.classList.remove('no_scroll')
  useEffect(() => {
    isMobileSize && optionVisible ? preventScroll(true) : preventScroll(false);
    return () => preventScroll(false);
  }, [isMobileSize, optionVisible]);

  const nextUri = history.location.pathname;
  const getHistoryInfo = pathname => ({
    pathname,
    state: { next: nextUri },
  });

  const goToOrderPage = (result, pathname) => {
    if (result?.code) {
        ERROR_CODE_MAPPING_ROUTE[result.code]?.msg 
          ?
            openAlert(
              ERROR_CODE_MAPPING_ROUTE[result.code]?.msg, 
              () => () => history.push(getHistoryInfo(ERROR_CODE_MAPPING_ROUTE[result.code]?.route))
            )
          :
            openAlert(result?.message);
      } else {
        history.push({
          pathname,
          search: '?' + qs.stringify(result),
        });
      }
  }

  const fetchOrderSheetNo = async (no = productNo, option = selectedOption, pathname = '/order/sheet') => {
    try {
      const result = await getOrderSheetNo(no, option);
      goToOrderPage(result, pathname);

    } catch(e) {
      e?.message && openAlert(e.message);
      console.log(e);
    }
  }

  const order = async (pathname = '/order/sheet') => {
    if (isMobileSize && !optionVisible) {
      setOptionVisible(true);
      return;
    }

    if (!canBuy) {
      openAlert('옵션을 선택하세요.');
      return;
    };

    if (memberOnly && !isLogin) {
      const GUEST_ERROR = 'O8001';
      openAlert(
        ERROR_CODE_MAPPING_ROUTE[GUEST_ERROR]?.msg, 
        () => () => history.push(getHistoryInfo(ERROR_CODE_MAPPING_ROUTE[GUEST_ERROR]?.route))
      );
      return;
    }

    if (isLogin) {
      fetchOrderSheetNo(productNo, selectedOption, pathname);
      return;
    }
    setOrderVisible(true);
  }

  const gift = () => {
    if (isLogin) {
      order('/gift/sheet');
    } else {
      setGiftVisible(true);
    }
  };

  const _getCartRequest = async (productNo, selectedOption) => {
    
    const products = getCartRequest(productNo, selectedOption);

    try {
      if (isLogin) {
        
        const result = await postCart(products);
        result?.error && result?.message && openAlert(result.message);
      } else {
        
        gc.set(products.map(product => ({ ...product, hsCode }))); // TODO.
                                                                   // 확인필요. @jk
      }
      
      setCartVisible(true);
    } catch(e) {
      e?.message && openAlert(e.message);
      console.log(e);
    }
  };

  const sameProductCount = async productNos => {
    const mapOrderCnt = products => _.chain(products)
                                    .filter(o => productNos.includes(o.productNo))
                                    .map(({ productNo, optionNo, orderCnt }) => ({ productNo, optionNo, orderCnt  }))
                                    .reduce(mergeWithOrderCnt, {})
                                    .value();
                                    
    if (isLogin) {
      const { data } = await getCart();
      return mapOrderCnt(
              _.chain(data.deliveryGroups)
              .flatMap(({ orderProducts }) => orderProducts)
              .flatMap(({ orderProductOptions }) => orderProductOptions)
            )
              
    } else {
      return mapOrderCnt(gc.items);
    }
  };

  const hasLimitedProduct = async () => {
    if (maxBuyTimeCnt > 0) {
      const counts = await sameProductCount(selectedOption.flatMap(({ productNo }) => productNo));
      return !_.every(counts, c => maxBuyTimeCnt - c.orderCnt > 0);
    }
    return false
  }

  const cart = async () => {
    
    if (!canBuy) {
      openAlert('옵션을 선택하세요.');
      return;
    };

    if (memberOnly && !isLogin) {
      const GUEST_ERROR = 'O8001';
      openAlert(
        ERROR_CODE_MAPPING_ROUTE[GUEST_ERROR]?.msg,
        () => () => history.push(
          getHistoryInfo(ERROR_CODE_MAPPING_ROUTE[GUEST_ERROR]?.route)),
      );
      return;
    };

    if (await hasLimitedProduct()) {
      openAlert(`구매 수량 제한 상품입니다. (제한 수량: ${maxBuyTimeCnt})`);
      return;
    }

    const succeed = await hsValidation(!!hsCode);
    
    if (succeed) {
      _getCartRequest(productNo, selectedOption);
    }
  };

  const wishHandler = async () => {
    try {
      if (isLogin) {
        const requestBody = { productNos: [productNo] };
        const { data } = await postProfileLikeProducts(requestBody);
        setWish(data[0].result);
      } else {
        setWishVisible(true)
      }
    } catch (e) {
      e?.message && openAlert(e.message);
    }
  };

  const handleClick = (e, type) => {
    e.preventDefault();
    switch(type) {
      case 'gift':
        gift();
        break;
      case 'order':
        order();
        break;
      case 'cart':
        cart();
        break;
      case 'wish':
        wishHandler();
        break;
      case 'reserve':
        order();
        break;
      default:
        break;
    }
  }

  // hsValidation
  const hsValidator = createRef(null);
  const hsValidation = async validation => await hsValidator.current.validation(validation);

  return (
    <>
      <div className="result_btn_inner">
        <div className="result_btn_box">
          <ul>
            <li className="like">
              <a href="#none" className={`btn_icon ${wish && 'on'}`}
                 onClick={e => handleClick(e, 'wish')}>찜하기</a>
            </li>
            <li className="cart">
              <a
                href="/cart"
                className="btn_icon"
                onClick={e => handleClick(e, 'cart')}
                data-popup="popup_cart"
              >장바구니</a>
              <HsValidator ref={hsValidator} />
            </li>
            <li className="gift">
              <a 
                href="/gift/sheet" 
                className="btn_icon" 
                onClick={ e => handleClick(e, 'gift') }
              >선물</a>
            </li>
            <li className="final">
              { saleStatus === '' && <a 
                href="/order/sheet" 
                onClick={ e => handleClick(e, 'order')} 
                className="btn_style direct" 
                style={{backgroundColor: '#000'}}
              >바로 구매하기</a>}
              {saleStatus === 'RESERVE' && <a onClick={ e => handleClick(e, 'reserve') } href="#none" className="btn_style reservation" style={{display: 'block', backgroundColor: '#5865F5'}}>예약판매</a>}
              {saleStatus === 'READY_RESERVE' && <a href="#none" className="btn_style disabled" style={{display: 'block', backgroundColor: '#ff4e4e'}}>출시예정</a>}
              {saleStatus === 'READY' && <a href="#none" className="btn_style disabled" style={{display: 'block', backgroundColor: '#888'}}>임시품절</a>}
              {saleStatus === 'SOLDOUT' && <a href="#none" className="btn_style disabled" style={{display: 'block', backgroundColor: '#ddd'}}>품절</a>}
            </li>
          </ul>
        </div>
      </div>
      <a href="#none" onClick={ e => {
        e.preventDefault();
        setOptionVisible(false);
      } } className="select_closed" title="선택 목록 닫기">닫기</a>
      {
        giftVisible 
          && <Notification setNotificationVisible={setGiftVisible} type='gift' />
      }
      {
        cartVisible
          && <Notification setNotificationVisible={setCartVisible} type='cart' />
      }
      {
        wishVisible
          && <Notification setNotificationVisible={setWishVisible} unusableIcon={true} type='wish' />
      }
      {
        orderVisible
          && <Notification setNotificationVisible={setOrderVisible} type='order' unusableIcon={true} fetchOrderSheetNo={fetchOrderSheetNo} popupType="popCont" />
      }
      {
        alertVisible 
          && <Alert onClose={closeModal}>{alertMessage}</Alert>
      }
    </>
  )
}