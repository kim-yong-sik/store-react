import LayerPopup from '../common/LayerPopup';
import { Link } from 'react-router-dom';

const Solicitation = ({ goOrder, close }) => {

  return (
    <LayerPopup
      size={'m'}
      onClose={close}
      className="login_chk_order"
    >
      <p className="pop_tit">로그인 후 주문해주세요.</p>
      <p className="pop_txt">소니스토어 회원으로 로그인 하시고 다양한 멤버십 혜택을 누리세요!
        비회원으로 제품을 구매하시면 소니스토어의 쿠폰 및 마일리지 적립 혜택을 받으실 수 없습니다. </p>
      <div className="btn_article">
        <button onClick={goOrder}
                className="button button_negative button-m closed"
                type="button">비회원 구매
        </button>
        <Link to="/member/login?nextLocation=cart"
              className="button button_positive button-m"
              type="button">회원 구매
        </Link>
      </div>
    </LayerPopup>
  );
};

export default Solicitation;