import { React } from 'react';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//api


//css
import "../../assets/scss/contents.scss"
import "../../assets/scss/mypage.scss"

export default function orderList() {

    return (
        <>
        <SEOHelmet title={"구매상담 이용약관 동의"} />
        <div className="contents mypage">
        <div className="container">
  <div className="content">
    <div className="common_head">
      <a href="../../html/mypage/myPageMain.html" className="common_head_back">마이페이지</a>
      <h1 className="common_head_name">주문/배송내역</h1>
    </div>
    <div className="cont history_order">
      <div className="history_inner">
        <div className="my_order">
          <ul className="order_list">
            <li className="step_1 on">{/* 1건 이상 부터 class: on 추가 */}
              <div className="ship_box">
                <span className="ico_txt">입금대기</span>
                <a  className="val_txt"><span className="val">4</span><span>건</span></a>
              </div>
            </li>
            <li className="step_2">
              <div className="ship_box">
                <span className="ico_txt">결제완료</span>
                <a  className="val_txt"><span className="val">0</span><span>건</span></a>
              </div>
            </li>
            <li className="step_3">
              <div className="ship_box">
                <span className="ico_txt">배송준비</span>
                <a  className="val_txt"><span className="val">0</span><span>건</span></a>
              </div>
            </li>
            <li className="step_4 on">
              <div className="ship_box">
                <span className="ico_txt">배송중</span>
                <a  className="val_txt"><span className="val">1</span><span>건</span></a>
              </div>
            </li>
            <li className="step_5 on">
              <div className="ship_box">
                <span className="ico_txt">배송완료</span>
                <a  className="val_txt"><span className="val">1</span><span>건</span></a>
              </div>
            </li>
          </ul>
        </div>
        <div className="my_claim">
          <p className="txt cancel on">주문 취소 <a  title="주문 취소 건"><strong className="val_txt"><span className="val">4</span> 건</strong></a></p>
          <p className="txt return">교환 반품 <a  title="교환 반품 건"><strong className="val_txt"><span className="val">0</span> 건</strong></a></p>
        </div>
      </div>
    </div>
    <div className="cont recent_order">
      <div className="tit_head mileage_inquiry">
        <h3 className="cont_tit">최근주문</h3>
        <div className="date_box">
          <ul className="date3_tab">
            <li className="tabs on">
              <a  className="date3_btn">3개월</a>
            </li>
            <li className="tabs">
              <a  className="date3_btn">6개월</a>
            </li>
            <li className="tabs">
              <a  className="date3_btn">1년</a>
            </li>
          </ul>
          <div className="date_rang">
            <div className="calendar_box">
              <input type="text" id="datepicker1" className="inp datepicker" autoComplete="off" />
            </div>
            <div className="calendar_box">
              <input type="text" id="datepicker2" className="inp datepicker" autoComplete="off" />
            </div>
            <button className="button button_positive button-s" type="button">조회</button>
          </div>
        </div>
      </div>
      {/* 주문 정보 */}
      <div className="col_table_wrap order_list">
        <div className="col_table">
          <div className="col_table_head">
            <div className="col_table_row">
              <div className="col_table_cell">주문날짜/번호</div>
              <div className="col_table_cell">제품</div>
              <div className="col_table_cell">수량</div>
              <div className="col_table_cell">처리상태</div>
            </div>
          </div>
          <div className="col_table_body">
            <div className="col_table_row">
              <div className="col_table_cell order">
                <span className="order_date">21.05.12</span>
                <a  className="order_number">20210512-663W24</a>
              </div>
              <div className="col_table_cell prd_wrap">
                <div className="prd">
                  <div className="prd_thumb">
                    <img className="prd_thumb_pic" src="../../images/_tmp/item640x640_01.png" alt="상품명입력" />
                  </div>
                  <div className="prd_info">
                    <div className="prd_info_name">AK-47 Hi-Res 헤드폰 앰프</div>
                    <p className="prd_info_option">128Bit/피아노블랙</p>
                  </div>
                </div>
              </div>
              <div className="col_table_cell prd_count">
                2 <span className="unit">개</span>
              </div>
              <div className="col_table_cell order">
                <span className="order_status">결제완료</span>
                <button type="button" className="button button_negative button-s">주문취소</button>
              </div>
            </div>
            <div className="col_table_row">
              <div className="col_table_cell order">
                <span className="order_date">21.05.12</span>
                <a  className="order_number">20210512-663W24</a>
              </div>
              <div className="col_table_cell prd_wrap">
                <div className="prd">
                  <div className="prd_thumb">
                    <img className="prd_thumb_pic" src="../../images/_tmp/item640x640_02.png" alt="상품명입력" />
                  </div>
                  <div className="prd_info">
                    <div className="prd_info_name">AK-47 Hi-Res 헤드폰 앰프</div>
                    <p className="prd_info_option">128Bit/피아노블랙</p>
                  </div>
                </div>
              </div>
              <div className="col_table_cell prd_count">
                2 <span className="unit">개</span>
              </div>
              <div className="col_table_cell order">
                <span className="order_status">주문취소</span>
                <button type="button" className="button button_negative button-s popup_comm_btn" data-popup-name="refund_account">환불 계좌 정보</button>
              </div>
            </div>
          </div>
        </div>
        <div className="btn_article">
          <a  className="more_btn">더보기</a>
        </div>
        {/* 내역 없는 경우 .col_table_body, .btn_article 노출 안되어야 합니다. */}
        {/* <div class="no-data">
      내역이 없습니다
    </div> */}
      </div>
      {/*// 주문 정보 */}
    </div>
    <div className="order_notice">
      <h3 className="order_notice_title">주문/배송 시 주의사항</h3>
      <ul className="list_dot">
        <li>주문 취소 접수 후에는 사용하신 쿠폰은 사라지며, 재 주문 시에 다시 복원되지 않습니다.</li>
        <li>처리 상태가 <strong>배송 완료 상태</strong>인 경우는 온라인 상으로 주문 취소 접수가 되지 않으며, 소니코리아 고객지원센터(<strong>1588-0911</strong>)를 통해서 주문 취소 요청을 하실 수 있습니다.</li>
        <li>주문 마감 기간의 경우는 주문 취소 접수가 되지 않을 수 있습니다.</li>
        <li><strong>신용카드 영수증, 현금영수증 신청을 클릭하시면 출력하실 수 있습니다. (PC버전에서만 가능합니다.)</strong></li>
      </ul>
    </div>
    <div className="ico_box_link">
      <a  className="box_link_inner ico_type3">
        <div className="txt_box">
          <p className="tit">고객지원 센터</p>
          <p className="txt">제품 서비스 및 보증기간을 확인하세요!</p>
        </div>
      </a>
    </div>
  </div>
</div>
</div>
        </>
    );
}