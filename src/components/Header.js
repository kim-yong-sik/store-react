import React, {useState, useContext, useEffect} from "react";

//images
import logo from "../assets/images/common/logo.svg";
import search from "../assets/images/common/ic_search.svg";
import mypage from "../assets/images/common/ic_mypage.svg";
import cart from "../assets/images/common/ic_cart.svg";
import menu from "../assets/images/common/ic_menu.svg";
import close from "../assets/images/common/ic_close.svg";

//component
import Gnb from "./Gnb";
import Search from "./Search";

//context
import GlobalContext from '../context/global.context';

//utils
import { useHistory } from "react-router-dom";
import { removeAccessToken } from '../utils/token';
import { getProfile } from '../api/member';
import { fetchMyProfile, fetchProfile, useProfileState, useProileDispatch } from "../context/profile.context";

export default function Header() {
  const history = useHistory();
  const {onChangeGlobal, isLogin} = useContext(GlobalContext);
  const profileDispatch = useProileDispatch();
  const profile = useProfileState();

  // const [profile, setProfile] = useState(null);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [sideBarOpen, setMobileSideBarOpen] = useState(false);

  useEffect(() => isLogin && fetchProfile(profileDispatch), []);
  
  useEffect(() => {
    if (!profile.customerId) return;
    if (profile.my?.customerid) return;

    const data = { type: '30', customerid: profile.customerId };
    profile.customerId && fetchMyProfile(profileDispatch, data);
    
  }, [profileDispatch, profile.customerId, profile.my?.customerid])

  return (
    <>
      <header id="header" className={`header ${sideBarOpen == true && "header--active"}`}>
        <div className="header__wrapper">
            <h1 className="header__logo"><a  onClick={()=>{history.push('/')}}><img src={logo} alt="SONY" /></a></h1>
            <div className="header__menu">
                <button className="btn btn__mo__hidden btn__search" onClick={()=>{
                  setSearchOpen(true)
                }}><img src={search} alt="????????? ??????" /></button>
                <a  className="btn btn__desktop btn__mypage"><img src={mypage} alt="???????????????" onClick={()=>{
                  setInfoOpen(!isInfoOpen)
                }} /></a>
                <a  onClick={()=>{history.push('/cart')}} className="btn btn__cart"><img src={cart} alt="????????????" /></a>
                <button type="button" className="btn btn__mo btn__menu__open" onClick={()=>{
                  setMobileSideBarOpen(true)
                }}><img src={menu} alt="?????? ??????" /></button>
                <button type="button" className="btn btn__mo btn__mo__hidden btn__menu__close" onClick={()=>{
                  setMobileSideBarOpen(false)
                }}><img src={close} alt="?????? ??????" /></button>
            </div>
        
            <div className="header__inner">
  
            {/* ?????????/????????? ??? */}
            {
              !isLogin &&
              <>
              <div className={`member ${isInfoOpen && "member--visible"}`}>
            <div className="member__inner">
                <a  onClick={()=>{history.push('/member/login')}} className="member__msg member__msg__login">????????????<br />???????????????</a>
                <button type="button" className="btn btn__login" onClick={()=>{
                  history.push("/member/login")
                  setInfoOpen(false);
                }}>?????????</button>
                <div className="member__menu">
                <ul>
                    <li className="member__menu__mypage"><a  onClick={()=>{history.push('/member/join-agree')}}>????????????</a></li>
                    <li className="member__menu__order"><a  onClick={()=>{history.push('/my-page/order-list')}}>??????/?????? ??????</a></li>
                    <li className="member__menu__cart"><a  onClick={()=>{history.push('/cart')}}>????????????<span className="badge">99</span></a></li>
                </ul>
                </div>
            </div>
            </div>
              </>
            }
            
            {/* ??????/????????? */}
            {
              isLogin && profile &&
              <>
              <div className={`member ${isInfoOpen && "member--visible"}`}>
                <div className="member__inner">
                    <p className="member__msg">{profile.memberName}???<br />???????????????!</p>
                    <div className="member__menu">
                    <ul>
                        <li className="member__menu__mypage"><a  onClick={()=>{history.push('/my-page')}}>???????????????</a></li>
                        <li className="member__menu__order"><a  onClick={()=>{history.push('/my-page/order-list')}}>??????/?????? ??????</a></li>
                        <li className="member__menu__cart"><a  onClick={()=>{history.push('/cart')}}>????????????<span className="badge">99</span></a></li>
                    </ul>
                    </div>
                    <button type="button" className="btn btn__logout" onClick={()=>{
                      setInfoOpen(false)
                      removeAccessToken();
                      onChangeGlobal({isLogin: false})
                    }}>????????????</button>
                </div>
                </div>
              </>
            }
            

            <Gnb />

            {/* ??? ?????? ?????? */}
            <div className="appmenu">
            <ul>
                <li className="appmenu__qr"><a >QR??????</a></li>
                <li className="appmenu__setting"><a >??????</a></li>
            </ul>
            </div>
        </div>
        {/* ?????? */}
            {
              isSearchOpen === true && <Search setSearchOpen={setSearchOpen} />
            }
      {/* ?????? */}
    </div>
  </header>
    </>
  );
}