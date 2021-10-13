import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { addMonth, changeDateFormat } from '../../utils/dateFormat';
import DateBox from '../../components/myPage/DateBox';
import OldOrderListItem from '../../components/myPage/order/OldOrderListItem';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//api
import { getOldOrders } from '../../api/sony/order';

//css
import '../../assets/scss/contents.scss';
import '../../assets/scss/mypage.scss';

export default function OldOrderList() {
  //FIXME: 개발후 삭제
  const mockData = [
    {
      orderid: '20210727-2V3743',
      createdate: '2021-07-27 17:06:13',
      customernr: '2780336',
      totalprice: 1800,
      status: '01',
      seqno: 'HDR-AZ1/W',
    },
    {
      orderid: '20210720-203G03',
      createdate: '2021-07-20 12:02:46',
      customernr: '2780336',
      totalprice: 1500,
      status: '07',
      seqno: 'A5000L/B',
    },
  ];

  const [searchPeriod, setSearchPeriod] = useState({
    startDate: new Date(addMonth(new Date(), -3)),
    endDate: new Date(),
  });
  const [loadMoreBtnVisible, setLoadMoreBtnVisible] = useState(false);
  const nextPage = useRef(2);

  // const [oldOrderProducts, setOldOrderProducts] = useState([...mockData]);
  const [oldOrderProducts, setOldOrderProducts] = useState([]);

  useEffect(() => {
    search({
      startDate: new Date(addMonth(new Date(), -3)),
      endDate: new Date(),
      pageNumber: 1,
      pageSize: 10,
      orderType: null,
    });
  }, []);

  const search = async ({ startDate, endDate, pageNumber, pageSize }) => {
    const schStrtDt = changeDateFormat(startDate, 'YYYY-MM-DD').replaceAll('-', '');
    const schEndDt = changeDateFormat(endDate, 'YYYY-MM-DD').replaceAll('-', '');

    const res = await getOldOrders({
      requsetBody: { schStrtDt, schEndDt, pageIdx: pageNumber, rowsPerPage: pageSize, orderType: null },
    });

    showLoadMoreBtn(res.data.body);
    setOldOrderProducts(res.data.body);
    setSearchPeriod({ startDate, endDate });
    nextPage.current = 2;
  };

  const onClickLoadMore = (e) => {
    e.preventDefault();
    loadMore(nextPage.current, 10);
  };

  const loadMore = async (pageIdx, rowsPerPage) => {
    const { startDate, endDate } = searchPeriod;
    const schStrtDt = changeDateFormat(startDate, 'YYYY-MM-DD').replaceAll('-', '');
    const schEndDt = changeDateFormat(endDate, 'YYYY-MM-DD').replaceAll('-', '');

    const res = await getOldOrders({
      requsetBody: { schStrtDt, schEndDt, pageIdx, rowsPerPage, orderType: null },
    });
    showLoadMoreBtn(res.data.body);
    setOldOrderProducts([...oldOrderProducts, ...res.data.body]);

    nextPage.current += 1;
  };

  // 다음 페이지가 없는 경우 loadmore 버튼 숨김
  const showLoadMoreBtn = (newOldOrderProducts) => {
    if (newOldOrderProducts.length === 0) {
      setLoadMoreBtnVisible(false);
      return;
    }

    setLoadMoreBtnVisible(true);
  };

  return (
    <>
      <SEOHelmet title={'마이페이지 : 이전 주문/배송 내역'} />
      <div className="contents mypage">
        <div className="container my">
          <div className="content">
            <div className="common_head">
              <Link to="/my-page/order-list" className="common_head_back">
                주문/배송내역
              </Link>
              <h1 className="common_head_name">이전 주문/배송내역</h1>
            </div>

            <div className="cont recent_order prev_order">
              <div className="tit_head mileage_inquiry">
                <h3 className="cont_tit">2021년 9월 이전 주문 내역</h3>
                <DateBox search={search} />
              </div>

              <div className="col_table_wrap order_list">
                <div className="col_table">
                  <div className="col_table_head">
                    <div className="col_table_row">
                      <div className="col_table_cell">주문날짜/번호</div>
                      <div className="col_table_cell">제품</div>
                      <div className="col_table_cell">처리상태</div>
                    </div>
                  </div>
                  {oldOrderProducts.length > 0 && (
                    <div className="col_table_body">
                      {oldOrderProducts.map((oldOrderProduct) => (
                        <OldOrderListItem
                          orderid={oldOrderProduct.orderid}
                          createdate={oldOrderProduct.createdate}
                          status={oldOrderProduct.status}
                          seqno={oldOrderProduct.seqno}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {loadMoreBtnVisible && (
                  <div className="my btn_article" style={{ textAlign: 'center' }}>
                    <a href="#" className="more_btn" onClick={onClickLoadMore}>
                      더보기
                    </a>
                  </div>
                )}

                {/* 내역 없는 경우 .col_table_body, .btn_article 노출 안되어야 합니다.  */}
                {oldOrderProducts.length === 0 && <div className="no-data">내역이 없습니다</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
