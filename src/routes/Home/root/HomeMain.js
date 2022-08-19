import { useState } from 'react';
import Style from "./HomeMain.module.css";
import Logo from "../../../logo/mainLogo";
import SearchBar from "./searchBar";
import NumberNotice from "./numberNotice";

import LeftPage from "../leftInner/page/page";
import LeftPageList from "../leftInner/pageList/pageList";
import LeftChat from "../leftInner/chat/chat";
import LeftNewPost from "../leftInner/newPost/newPost";
import LeftSetting from "../leftInner/setting/settingMain";

import RightNewPost from "../rightInner/newPost/newPost";
import RightChat from "../rightInner/chat/chat";
import RightNotice from "../rightInner/notice/notice";
import RightFriend from "../rightInner/friend/friend";
import RightSetting from "../rightInner/setting/setting";

const Home = ({ logout }) => {
  //오른쪽 책의 내용을 바꿔주는 state => newPost // chat // notice // friend // setting
  const [rightBookState, setRightBookState] = useState("friend");
  //왼쪽 책의 내용을 바꿔주는 state => page(글) // pageList //chat // newPost // setting
  const [leftBookState, setLeftBookState] = useState("page");
  //setting의 내용을 바꿔주는 state => initial(클릭 없음) // profile // Snotice // password // filtering // block
  const [settingState, setSettingState] = useState("initial");

  //우측 태그 클릭 hander
  const tagClickHandler = (event) =>{
    event.preventDefault();
    const tmp = event.target.id;
    if(tmp === "setting" || tmp === 'newPost'){
      setRightBookState(event.target.id);
      setLeftBookState(event.target.id);
    }
    else{
      if(leftBookState === 'setting' || leftBookState === 'newPost') setLeftBookState("page");
      setRightBookState(event.target.id);
    }
    if(settingState !== 'initial'){//다른 태그 클릭 시 설정을 다시 원래대로 돌린다.
      setSettingState('initial');
    }
  };

  //우측 내용 클릭시 좌측 내용 변화 함수
  //채팅, 알림, 친구의 경우 이 함수를 사용해야 좌측이 달라진다.
  const leftChange = (val) => {
    setLeftBookState(val);
  };

  //setting 변경 함수
  const SettingChangeHandler = (val) => {
    setSettingState(val);
  }
  
  //글 읽어오기 함수

  //세부 글 읽어오기 함수

  //댓글 읽어오기 함수

  //대댓글 읽어오기 함수

  //유저 정보 조회 함수

  //친구 정보 조회 함수

  //채팅방 정보 읽어오기 함수

  //알림 정보 읽어오기 함수

  //내 게시글 읽어오기 함수

  //친구 게시글 읽어오기 함수

  //글 게시 함수


  return(
    <div className={Style.pageCover}>
      <div />
      <div className={Style.mainPage}>
        <div className={Style.bookCover}>
          <div className={Style.leftBook}>
            <div className={Style.splitBookCover}>
              <div className={Style.leftHeader}>
                <div className={Style.leftHeaderCover}>
                    <Logo />
                    <div />
                    <SearchBar />
                </div>
              </div>
              <div className={Style.leftMain}>
                {leftBookState === "page" ? <LeftPage /> : null}
                {leftBookState === "pageList" ? <LeftPageList /> : null}
                {leftBookState === "chat" ? <LeftChat /> : null}
                {leftBookState === "newPost" ? <LeftNewPost /> : null}
                {leftBookState === "setting" ? <LeftSetting settingState={settingState} /> : null}
              </div>
            </div>
          </div>
          <div className={Style.leftRightGap} />
          <div className={Style.rightBook}>
            <div className={Style.splitBookCover}>
              <div className={Style.rightHeader}>
                <div className={Style.rightHeaderCover}>
                  <div className={Style.tag}>
                    { rightBookState === "newPost" ?
                      <div className={Style.activeTag} onClick={tagClickHandler} id="newPost" >글</div>
                      :
                      <div className={Style.inactiveTag} onClick={tagClickHandler} id="newPost">글</div>
                    }
                  </div>
                  <div className={Style.tag}>
                    {
                      rightBookState === "chat" ?
                      <div className={Style.activeTag} onClick={tagClickHandler} id="chat">챗</div>
                      :
                      <div className={Style.inactiveTag} onClick={tagClickHandler} id="chat">챗</div>
                    }
                  </div>
                  <div className={Style.tag}>
                    {
                      rightBookState === "notice" ?
                      <div className={Style.activeTag} onClick={tagClickHandler} id="notice">알</div>
                      :
                      <div className={Style.inactiveTag} onClick={tagClickHandler} id="notice">알</div>
                    }
                  </div>
                  <div className={Style.tag}>
                    {
                      rightBookState === "friend" ?
                      <div className={Style.activeTag} onClick={tagClickHandler} id="friend">친</div>
                      :
                      <div className={Style.inactiveTag} onClick={tagClickHandler} id="friend">친</div>
                    }
                  </div>
                  <div className={Style.tag}>
                    {
                      rightBookState === "setting" ?
                      <div className={Style.activeTag} onClick={tagClickHandler} id="setting">설</div>
                      :
                      <div className={Style.inactiveTag} onClick={tagClickHandler} id="setting">설</div>
                    }
                  </div>
                </div>
              </div>
              <div className={Style.rightMain}>
                { rightBookState === "newPost" ? <RightNewPost /> :  null}
                { rightBookState === "chat" ? <RightChat /> : null}
                { rightBookState === "notice" ? <RightNotice /> : null}
                { rightBookState === "friend" ? <RightFriend /> : null}
                { rightBookState === "setting" ? <RightSetting settingState={settingState} SettingChangeHandler={SettingChangeHandler} logout={logout} /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
}
  
export default Home;