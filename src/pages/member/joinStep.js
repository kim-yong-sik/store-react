import React, { useState, useEffect, useContext } from 'react';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//api
import {registerApi} from '../../api/sony/member';
import {sendSMS, verifySMS} from '../../api/auth';

//css
import "../../assets/scss/contents.scss"

//utils
import { emptyCheck, getUrlParam, timeFormat } from '../../utils/utils';
import { useHistory, useLocation } from "react-router-dom";

//context
import GlobalContext from '../../context/global.context';
import Alert from '../../components/common/Alert';

export default function JoinStep() {
  const {isLogin} = useContext(GlobalContext)

  const history = useHistory();
  const location = useLocation();

  const [isPwVisible, setPwVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);

  //state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [authSent, setAuthSent] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authCheck, setAuthCheck] = useState(false);

  //validation
  const [isEmail, setIsEmail] = useState(true);
  const [isPassword, setIsPassword] = useState(true);
  const [isConfirm, setIsConfirm] = useState(true);
  const [isName, setIsName] = useState(true);
  const [isBirthday, setIsBirthday] = useState(true);
  const [isPhone, setIsPhone] = useState(true);
  const [isAuthCode, setIsAuthCode] = useState(true);

  const [authAvailable, setAuthAvailable] = useState(false);

  //wrongType
  const [pwWrongType, setPwWrongType] = useState('');
  const [confirmWrongType, setConfirmWrongType] = useState('');
  const [birthdayWrongType, setBirthdayWrongType] = useState('');
  const [phoneWrongType, setPhoneWrongType] = useState('');
  const [authWrongType, setAuthWrongType] = useState('');

  //timer
  const [time, setTime] = useState(179)
  const [expireAt, setExpireAt] = useState('');

  // alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const openAlert = (message) => {
    setAlertVisible(true);
    setAlertMessage(message);
  }
  const closeModal = () => {
    setAlertVisible(false);
  }
  const _registerApi = async() =>{
    //?????????
    if(emptyCheck(email.trim())){
      setIsEmail(false);
      return;
    } else{
      //email check 
      if (email.match(/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/g)) {
        setIsEmail(true);
      } else {
        setIsEmail(false);
        return;
      }
    }
    
    //????????????
    if(emptyCheck(password.trim())){
      setPwWrongType(1);
      setIsPassword(false);
      return;
    }else{
      if(password.match(/^[a-zA-Z0-9]{10,15}$/)){
        setIsPassword(true);
      } else{
        setPwWrongType(2);
        setIsPassword(false);
        return;
      }
    }

    //???????????? ??????
    if(emptyCheck(confirm.trim())){
      setConfirmWrongType(1);
      setIsConfirm(false);
      return;
    }else{
      if(password.trim() == confirm.trim()){
        setIsConfirm(true);
      }else{
        setConfirmWrongType(2);
        setIsConfirm(false); 
      }      
    }

    //??????
    if(emptyCheck(name.trim())){
      setIsName(false);
      return;
    }
    else{
      setIsName(true);
    }

    //????????????
    if(emptyCheck(birthday.trim())){
      setBirthdayWrongType(1);
      setIsBirthday(false);
      return;
    }else{
      if(birthday.match(/^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/)){
        setIsBirthday(true);
      } else{
        setBirthdayWrongType(2);
        setIsBirthday(false);
        return;
      }
    }

    //????????? ??????
    if(emptyCheck(phone)){
      setPhoneWrongType(1);
      setIsPhone(false);
      return;
    }else{
      if(phone.match(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g)){
        setIsPhone(true);
      } else{
        setPhoneWrongType(2);
        setIsPhone(false);
        return;
      }
    }

    //authCheck
    if(authCheck !== true) {
      openAlert("????????? ????????? ????????????.");
      return;
    }

    //final
    const data = {
      customerid : email,
      custcategory: "01",
      gender: "1",
      firstname: name,
      mobile: phone.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-"),
      birthday: birthday,
      email: email,
      viasite: "SonyStyle",
      sms:getUrlParam('sms') === 'true' ? 'Y' : 'N',
      mobileflag: "N",
      servicesite: {news: getUrlParam('email') === 'true' ? 'Y' : 'N', snsinfo:null},
      password : password,
    }

    const response = await registerApi(data);
    if(response.status === 200){
      if(response.data.errorCode === "0000"){
        //??????
        openAlert("??????????????? ?????????????????????.")
        history.push("/member/login")
      } else{
        openAlert(response.data.errorMessage)
      }
    }
  }

  const _sendSMS = async(phoneNum) => {
    const response = await sendSMS(phoneNum, "JOIN");
    if(response.status === 200){
      //????????????
      setAuthSent(true);
    } else{
      openAlert(response.data.message);
    }
  }

  const _verifySMS = async(phoneNum, code) => {
    const response = await verifySMS(phoneNum, code, "JOIN");
    if(response.status === 200){
      //????????????
      setAuthCheck(true);
      openAlert('?????????????????????.');
      } else{
      openAlert(response.data.message);
    }
  }

  useEffect(()=>{
    if(phone.match(/^\d{2,3}\d{3,4}\d{4}$/)){
      setAuthAvailable(true);
    } else{
      setAuthAvailable(false);
    }
  },[phone])

  useEffect(() => {
    if(authSent === true){
      if (time > 0) {
        const Counter = setInterval(() => {
          const gap = Math.floor((new Date(expireAt).getTime() - new Date().getTime()) / 1000)
          setTime(gap)
        }, 1000)
        return () => clearInterval(Counter)
      }
    }
  }, [expireAt, time, authSent])

  //componentDidMount
  useEffect(()=>{
    //????????? ????????? ??????, ?????????????????? ?????? ????????????
    if (isLogin) {
      history.push('/');
    }

  },[])

    return (
        <>
        <SEOHelmet title={"??????????????? ????????????"} />
        {alertVisible && <Alert onClose={closeModal}>{alertMessage}</Alert>}
          <div className="contents">
          <div className="container" id="container">
            <div className="login join_step">
              <h2 className="login__title">????????????</h2>
              <p className="login__desc">??????????????? ?????? ????????? ?????? ??? ??????????????? <strong>??? 14??? ????????? ?????? ??????????????? ???????????????.</strong></p>
              <div className="join_inp_box">
                <div className={`group ${isEmail === false && "error"}`}>
                  <div className="inp_box">
                    <label className="inp_desc" htmlFor="loginName">
                      <input type="text" id="loginName" className="inp" placeholder=" " autoComplete="off" tabIndex={1} value={email} onChange={(e)=>{ setEmail(e.target.value) }} />
                      <span className="label">????????? ?????????<span>(??? : sony@sony.co.kr)</span></span>
                      <span className="focus_bg" />
                    </label>
                  </div>
                  <div className="error_txt"><span className="ico" />????????? ???????????? ????????? ?????????.</div>
                </div>
                <div className="rowgroup">
                  <div className={`group ${isPassword === false && "error"}`}>
                    <div className="inp_box password_box">
                      <label className="inp_desc" htmlFor="loginPw1">
                        <input type={`${isPwVisible === true ? "text" : "password"}`} id="loginPw1" className="inp" placeholder=" " autoComplete="off" tabIndex={2} value={password} onChange={(e)=>{ setPassword(e.target.value) }} />
                        <span className="label">????????????<span>(??????/?????? ?????? 10~15?????? ??????)</span></span>
                        <span className="focus_bg" />
                        <div className="eyes"><button type="button" title="???????????? ??????" onClick={()=>{
                          setPwVisible(!isPwVisible);
                        }}><i className="ico ico_eyes" /></button></div>
                      </label>
                    </div>
                    <div className="error_txt"><span className="ico" />{pwWrongType == 1 ? "??????????????? ????????? ?????????." : "???????????? ????????? ?????? ????????????."}</div>
                  </div>
                  <div className={`group ${isConfirm === false && "error"}`}>
                    <div className="inp_box password_box">
                      <label className="inp_desc" htmlFor="loginPw2">
                        <input type={`${isConfirmVisible === true ? "text" : "password"}`} id="loginPw2" className="inp" placeholder=" " autoComplete="off" tabIndex={3} value={confirm} onChange={(e)=>{ setConfirm(e.target.value) }} />
                        <span className="label">???????????? ??????</span>
                        <span className="focus_bg" />
                        <div className="eyes"><button type="button" title="???????????? ??????" onClick={()=>{
                          setConfirmVisible(!isConfirmVisible);
                        }}><i className="ico ico_eyes" /></button></div>
                      </label>
                    </div>
                    <div className="error_txt"><span className="ico" />{confirmWrongType == 1 ? "??????????????? ????????? ????????????." : "??????????????? ????????? ?????? ????????????."}</div>
                  </div>
                </div>
                <div className="rowgroup">
                  <div className={`group ${isName === false && "error"}`}>
                    <div className="inp_box">
                      <label className="inp_desc" htmlFor="username">
                        <input type="text" id="username" className="inp" placeholder=" " autoComplete="off" tabIndex={4} value={name} onChange={(e)=>{ setName(e.target.value) }} />
                        <span className="label">??????<span>(???????????? ?????? ???????????????.)</span></span>
                        <span className="focus_bg" />
                      </label>
                    </div>
                    <div className="error_txt"><span className="ico" />????????? ????????? ?????????.</div>
                  </div>
                  <div className={`group ${isBirthday === false && "error"}`}>
                    <div className="inp_box">
                      <label className="inp_desc" htmlFor="userbirth">
                        <input type="text" id="userbirth" className="inp" placeholder=" " value={birthday} onChange={(e)=>{ setBirthday(e.target.value) }} />
                        <span className="label">????????????<span>(??? : 20210307)</span></span>
                        <span className="focus_bg" />
                      </label>
                    </div>
                    <div className="error_txt"><span className="ico" />{birthdayWrongType == 1 ? "??????????????? ??????????????????." : "???????????? ????????? ?????? ????????????."}</div>
                  </div>
                </div>
                <div className={`group btn_type ${isPhone === false && "error"}`}>
                  <div className="inp_box">
                    <label className="inp_desc" htmlFor="phonenumber">
                      <input type="text" id="phonenumber" className="inp" placeholder=" " autoComplete="off" tabIndex={5} value={phone} onChange={(e)=>{ setPhone(e.target.value) }} readOnly={authSent ? true : false}  />
                      <span className="label">????????? ??????<span>(-?????? ???????????????.)</span></span>
                      <span className="focus_bg" />
                    </label>
                    <div className="btn_box">
                      { (authSent && authCheck == false) ? 
                        <button type="button" className={`btn btn_default`} onClick={()=>{
                          if(authAvailable === true) {
                            //???????????? ?????? 
                            let now = new Date().getTime();
                            const target = new Date(now + (3*60000));
                            setTime(179);
                            setExpireAt(target);

                            //???????????? ?????? 
                            _sendSMS(phone)
                            
                          }
                        }}>?????????</button>
                        :
                        <button type="button" className={`btn ${(authAvailable == true && authCheck == false) ? "btn_primary" : "btn_disable"}`} onClick={()=>{
                          if(authAvailable === true) {
                            //???????????? ?????? 
                            let now = new Date().getTime();
                            const target = new Date(now + (3*60000));
                            setTime(179);
                            setExpireAt(target);

                            //???????????? ?????? 
                            _sendSMS(phone)
                          }
                        }}>????????????</button>
                      }
                    </div>
                  </div>
                  <div className="error_txt"><span className="ico" />{phoneWrongType == 1 ? "????????? ????????? ??????????????????." : "????????? ?????? ????????? ?????? ????????????."}</div>
                </div>
                {
                  authSent === true &&
                    <div className="group btn_type">
                      <div className="inp_box">
                        <label className="inp_desc" htmlFor="certifynumber">
                          <input type="text" id="certifynumber" className="inp" placeholder=" " autoComplete="off" tabIndex={6} value={authCode} onChange={(e)=>{ setAuthCode(e.target.value) }} readOnly={authCheck ? true : false} />
                          <span className="label">????????????</span>
                          {authCheck === false &&
                            <span className="timer" id="timer">{timeFormat(time)}</span>
                          }
                          <span className="focus_bg" />
                        </label>
                        <div className="btn_box">
                          <button type="button" className={`btn ${authCheck !== true ? "btn_primary" : "btn_disable"}`} onClick={()=>{
                            if(authCheck !== true){
                              if(time == 0){
                                openAlert("??????????????? ?????????????????????. ????????? ??? ??????????????????.");
                              } else{
                                if(authCode === ''){
                                  openAlert('??????????????? ??????????????????.');
                                  return;
                                }
                                _verifySMS(phone, authCode, "JOIN");
                              }
                            }
                          }}>??????</button>
                        </div>
                      </div>
                      <div className="certify_txt">??? ???????????? ????????? ??????????????? ?????????????????????.</div>
                    </div>
                }
                

                <div className="btn_box full">
                  <button type="button" className="btn btn_dark" onClick={async ()=>{
                      await _registerApi();
                  }}>?????? ??????</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
    );
}