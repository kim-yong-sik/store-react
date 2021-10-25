import React, { useContext, useState } from 'react';
import { useMallState } from '../../context/mall.context';
import { getItem, KEY, removeAccessToken, setAccessToken, setItem } from '../../utils/token';
import { encodeString, generateRandomString } from '../../utils/utils';
import { getOauthLoginUrl } from '../../api/member';
import Alert from '../common/Alert';
import { useHistory } from 'react-router-dom';
import GlobalContext from '../../context/global.context';
import { fetchMyProfile, resetProfile, setProfile, useProileDispatch } from '../../context/profile.context';
import { loginApi } from '../../api/auth';
import Cookies from 'js-cookie';

const label = {
  naver: '네이버',
  facebook: '페이스북',
  kakao: '카카오톡',
};
const CLIENT_ID = {
  naver: process.env.REACT_APP_NAVER_JAVASCRIPT_KEY,
  facebook: process.env.REACT_APP_FACEBOOK_JAVASCRIPT_KEY,
  kakao: process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY,
};
const OPEN_URL = {
  naver: process.env.REACT_APP_NAVER_OPEN_URL,
  facebook: process.env.REACT_APP_FACEBOOK_OPEN_URL,
  kakao: process.env.REACT_APP_KAKAO_OPEN_URL,
};

const OpenLogin = ({ title, message, customCallback }) => {
  let popup = null;
  const history = useHistory();
  const { openIdJoinConfig } = useMallState();
  const { onChangeGlobal } = useContext(GlobalContext);
  const profileDispatch = useProileDispatch();

  const openIdData = openIdJoinConfig?.providers.sort((a) => a === 'naver' ? -1 : 1).map(provider => ({
    provider,
    label: label[provider],
  }));

  // alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCloseFunc, setAlertCloseFun] = useState(null);

  const openAlert = (message, onClose) => {
    setAlertVisible(true);
    setAlertMessage(message);
    setAlertCloseFun(onClose);
  };
  const closeModal = () => {
    setAlertVisible(false);
    alertCloseFunc?.();
  };

  const openIdLogin = async (type) => {
    const provider = type.substring(0, 1).toUpperCase();
    popup = null;
    popup = window.open('about:blank', '간편 로그인', 'width=420px,height=550px,scrollbars=yes');
    popup.focus();
    const clientId = CLIENT_ID[type];
    const state = generateRandomString();
    const redirectUri = encodeURI(`${window.location.origin}/callback`);

    setItem(KEY.OPENID_PROVIDER, provider, 30 * 60 * 1000);
    setItem(KEY.OPENID_TOKEN, state, 30 * 60 * 1000);

    const loginUrl = OPEN_URL[type].replace('{clientId}', clientId).replace('{redirectUri}', redirectUri).replace('{state}', state);
    popup.location.href = loginUrl;
    openLoginPopup();
  };

  const openLoginPopup = () => {
    window.shopOauthCallback = customCallback || _openIdAuthCallback;
  };

  const _openIdAuthCallback = async (errorCode, profileResult = null) => {
    window.shopOauthCallback = null;

    console.log(profileResult);
    if (errorCode === '2000') {
      history.push({
        pathname: '/member/join-agree?sns=true',
        state: {
          email: profileResult.customerid,
        }
      });
    } else if (errorCode === '0000') {
      const redirectedProvider = getItem(KEY.OPENID_PROVIDER);
      const response = await loginApi(profileResult.customerid, CLIENT_ID[redirectedProvider]);
      const code = response.data?.message ? JSON.parse(response.data.message).errorCode : '';

      if (code === '3003') { // 계정 잠금
        history.push('/member/lockedAccounts');
      } else if (response?.data?.dormantMemberResponse) { // 휴먼 계정
        const { accessToken, expireIn } = response.data;
        setAccessToken(accessToken, expireIn);
        history.push('/member/inactiveAccounts');
      } else {
        const { accessToken, expireIn } = response.data;
        setAccessToken(accessToken, expireIn);
        onChangeGlobal({ isLogin: true });
        openAlert('로그인이 완료 되었습니다.', () => history.push('/'));
        // await fetchProfile(profileDispatch);
      }
    } else {
      openAlert('간편 인증에 실패하였습니다.');
    }

  };

  return (
    <>
      {alertVisible && <Alert onClose={closeModal}>{alertMessage}</Alert>}
      {openIdJoinConfig && <div className="sns_login_box">
        {title ? (<div className="txt_lft">
          <strong className="sns_title">{message}</strong>
          <p>{title}</p>
        </div>) : (<>
          <strong className="sns_title" dangerouslySetInnerHTML={{ __html: message }} />
        </>)}
        <ul className="sns_list">
          {openIdData.map(({ provider, label }) => {
            return (
              <li className={provider} key={provider}>
                <a href="javascript:void(0)" onClick={() => openIdLogin(provider)}>{label}</a>
              </li>
            );
          })}
        </ul>
      </div>}
    </>
  );
};

OpenLogin.defaultProps = {
  title: '',
  message: 'SNS 계정으로 <span>간편하게 로그인하세요.</span>',
  customCallback: null,
};

export default OpenLogin;
