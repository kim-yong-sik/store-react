import { useImperativeHandle, forwardRef, useRef } from 'react';
import { handleChange } from '../../utils/state';

// 주문자 정보
const OrdererForm = forwardRef((prop, ref) => {
  // ordererName, ordererContact1, ordererEmail
  const { orderer, setOrderer } = prop;

  const handleOrdererChange = event => {
    if (event.target.value.trim()) {
      event.target.parentNode.classList.remove(
        'error');
    }
    handleChange(event)(setOrderer);
  };

  const ordererName = useRef();
  const ordererContact1 = useRef();
  const ordererEmail = useRef();

  useImperativeHandle(ref, () => ({
    fieldValidation (chekAll = false) {
      const refs = { ordererName, ordererEmail, ordererContact1 };

      if (chekAll) {
        Object.entries(refs)
              .filter(([k]) => !orderer[k])
              .map(([_, r]) => r)
              .forEach(r => attachError(r));
        return;
      }

      const emptyRef = Object.entries(refs).find(([k]) => !orderer[k])?.[1];
      if (!emptyRef) {
        return true;
      }

      attachError(emptyRef);
      return false;
    },
  }));

  function attachError (ref) {
    const el = ref.current;
    el.parentNode.classList.add('error');
    el.focus();
  }

  return (
    <>
      <div className="acc_form">
        <div className="acc_cell vat">
          <label htmlFor="user_name">이름<i
            className="necessary" /></label>
        </div>
        <div className="acc_cell">
          <div
            className="acc_group parent">{/* error 문구 제어 */}
            <div className="acc_inp type3">
              <input type="text" className="inp"
                     id="user_name"
                     placeholder="이름을 입력하세요."
                     value={orderer.ordererName}
                     name="ordererName"
                     onChange={handleOrdererChange}
                     ref={ordererName}
              />
              <span className="focus_bg" />
              <p className="error_txt"><span
                className="ico" />이름을 입력해 주세요.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="acc_form">
        <div className="acc_cell vat">
          <label htmlFor="user_email">이메일<i
            className="necessary" /></label>
        </div>
        <div className="acc_cell">
          <div
            className="acc_group parent">
            <div className="acc_inp type3">
              <input type="text" className="inp"
                     id="user_email"
                     placeholder="이메일 아이디 (예 : sony@sony.co.kr)"
                     value={orderer.ordererEmail}
                     name="ordererEmail"
                     onChange={handleOrdererChange}
                     ref={ordererEmail}
              />
              <span className="focus_bg" />
              <p className="error_txt"><span
                className="ico" />이메일 아이디를 입력해 주세요.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="acc_form">
        <div className="acc_cell vat">
          <label htmlFor="user_number">휴대폰 번호<i
            className="necessary" /></label>
        </div>
        <div className="acc_cell">
          <div
            className="acc_group parent">
            <div className="acc_inp type3">
              <input type="text" className="inp"
                     id="user_number"
                     value={orderer.ordererContact1}
                     name="ordererContact1"
                     onChange={handleOrdererChange}
                     ref={ordererContact1}
              />
              <span className="focus_bg" />
              <p className="error_txt"><span
                className="ico" />휴대폰 번호를 입력해 주세요.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default OrdererForm