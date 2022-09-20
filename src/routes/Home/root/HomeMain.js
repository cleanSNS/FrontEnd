import { useState, useEffect } from 'react';
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

import addTagImg from "./tagImages/add.png";
import messageTagImg from "./tagImages/message.png";
import notificationTagImg from "./tagImages/notification.png";
import settingTagImg from "./tagImages/settings.png";
import userTagImg from "./tagImages/user.png";

import {
  newPostUrl
} from "../../../apiUrl";
import axios from 'axios';

const Home = ({ logout, refreshAccessToken }) => {
  //오른쪽 책의 내용을 바꿔주는 state => newPost // chat // notice // friend // setting
  const [rightBookState, setRightBookState] = useState("friend");
  //왼쪽 책의 내용을 바꿔주는 state => page(글) // pageList //chat // newPost // setting
  const [leftBookState, setLeftBookState] = useState("page");
  //setting의 내용을 바꿔주는 state => initial(클릭 없음) // profile // Snotice // password // filtering // block
  const [settingState, setSettingState] = useState("initial");

  /* 새 글을 올리는 기능을 위한 부분 */
  /* 좌, 우로 나뉘어져있는 정보를 추합해서 서버에 보내야 하기 때문에 상위 요소에서 작성 */
  //아래는 좌측 페이지로 이동할 정보
  //이미지 리스트
  const [newPostImages, setNewPostImages] = useState([]);
  //해시태그 리스트
  const [newPostHashtag, setNewPostHashtag] = useState([]);
  //글
  const [newPostContent, setNewPostContent] = useState("");

  //아래는 우측 페이지로 이동할 정보
  //좋아요 알림
  const [newPostLikeNotice, setNewPostLikeNotice] = useState(true);
  //댓글 알림
  const [newPostCommentNotice, setNewPostCommentNotice] = useState(true);
  //읽기 권한
  const [newPostReadPostAuth, setNewPostReadPostAuth] = useState("ALL");
  //댓글 읽기 권한
  const [newPostReadCommentAuth, setNewPostReadCommentAuth] = useState(true);
  //댓글 쓰기 권한
  const [newPostWriteCommentAuth, setNewPostWriteCommentAuth] = useState(true);
  //좋아요 읽기 권한
  const [newPostReadLikeAuth, setNewPostReadLikeAuth] = useState(true);

  //글 검색
  const [userSearch, setUserSearch] = useState("");

  //글 검색 input Change Handler
  const userSearchChangeHandler = (event) => {
    event.preventDefault();
    setUserSearch(event.target.value);
  }

  //글 검색 submit Handler
  const userSearchSubmitHandler = (event) => {
    event.preventDefault();
    if(userSearch === '') return;
    
    axios.get()
    /*

    <------------------------------------------------------이 부분 작업 해야함 아직

    */
  }

  //글 올리는 함수 => 좌측 페이지로 넘어가야한다.
  const uploadNewPostHandler = (event) => {
    event.preventDefault();
    if(newPostImages.length === 0){
      alert("이미지를 하나 이상 업로드 해주세요.");
      return;
    }
    if(newPostContent.length === 0){
      alert("글을 입력해 주세요/.");
      return;
    }

    axios.post(newPostUrl, {
      content: newPostContent,
      pageSetting : {
        notificationLike: newPostLikeNotice,
        notificationComment: newPostCommentNotice,
        readAuth: newPostReadPostAuth,
        commentReadAuth: newPostReadCommentAuth,
        commentWriteAuth: newPostWriteCommentAuth,
        likeReadAuth: newPostReadLikeAuth,
      },
      imgUrlList: newPostImages,
      pageHashtagList: newPostHashtag,
    })
    .then((res) => {
      alert("업로드 되었습니다.");
      //window.location.href = "/main";
    })
    .catch((res) => {
      console.log("잘못된 양식입니다.");
      console.log(res);
      alert("문제 발생");
      //window.location.href = "/main";
    })
  };


  //첫 render시 친구 tag를 칠해준다.
  const firstRender = () => {
    document.querySelector("#friend").style.backgroundColor = "rgb(145, 145, 145)";
  };
  useEffect(firstRender, []);

  //우측 태그 클릭 hander
  const tagClickHandler = (event) =>{
    event.preventDefault();
    const targetID = event.target.id;//누른 위치
    if(targetID === rightBookState) return; //같은 태그를 여러번 누르는 경우 아무 변화도 주지 않는다.
    
    //태그 색상 변경
    document.querySelector(`#${targetID}`).style.backgroundColor = "rgb(145, 145, 145)";//누른 버튼 어둡게 변경
    document.querySelector(`#${rightBookState}`).style.backgroundColor = "rgb(190, 190, 190)";//원래 눌려있던 버튼 밝게 변경

    if(targetID === "setting" || targetID === 'newPost'){
      setRightBookState(targetID);
      setLeftBookState(targetID);
    }
    else{
      if(leftBookState === 'setting' || leftBookState === 'newPost') setLeftBookState("page");
      setRightBookState(targetID);
    }

    if(settingState !== 'initial'){//다른 태그 클릭 시 설정을 다시 원래대로 돌린다.
      setSettingState('initial');
    }
  };

  //우측 내용 클릭시 좌측 내용 변화 함수
  //채팅, 알림, 친구의 경우 이 함수를 사용해야 좌측이 달라진다.
  const leftBookChangeHandler = (val) => {
    setLeftBookState(val);
  };

  //setting 변경 함수
  const SettingChangeHandler = (val) => {
    setSettingState(val);
  }

  return(
    <div className={Style.pageCover}>
      {/* 좌 상단 - 로고와 검색창 */}
      <div className={Style.Cover}>
        <div className={Style.leftHeader}>
          <Logo />
          <div />
          <SearchBar userSearch={userSearch} userSearchChangeHandler={userSearchChangeHandler} userSearchSubmitHandler={userSearchSubmitHandler} />
        </div>
      </div>
      {/* 우 상단 - 태그 */}
      <div className={Style.Cover}>
        <div className={Style.tagArea}>
          <div className={Style.Cover}>
            <div className={Style.tag} id="newPost">
              <div className={Style.Cover}>
                <img src={addTagImg} className={Style.tagImg} onClick={tagClickHandler} id="newPost"/>
              </div>
            </div>
          </div>
          <div className={Style.Cover}>
            <div className={Style.tag} id="chat">
              <div className={Style.Cover}>
                <img src={messageTagImg} className={Style.tagImg} onClick={tagClickHandler} id="chat" />
              </div>
            </div>
          </div>
          <div className={Style.Cover}>
            <div className={Style.tag} id="notice">
              <div className={Style.Cover}>
                <img src={notificationTagImg} className={Style.tagImg} onClick={tagClickHandler} id="notice" />
              </div>
            </div>
          </div>
          <div className={Style.Cover}>
            <div className={Style.tag} id="friend">
              <div className={Style.Cover}>
                <img src={userTagImg} className={Style.tagImg} onClick={tagClickHandler} id="friend" />
              </div>
            </div>
          </div>
          <div className={Style.Cover}>
            <div className={Style.tag} id="setting">
              <div className={Style.Cover}>
                <img src={settingTagImg} className={Style.tagImg} onClick={tagClickHandler} id="setting" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 좌측 페이지 */}
      <div className={Style.Cover}>
        <div className={Style.bookCover}>
          <div className={Style.leftbook}>
            <div className={Style.Cover}>
                {leftBookState === "page" ? <LeftPage refreshAccessToken={refreshAccessToken}/> : null}
                {leftBookState.includes("pageList") ? <LeftPageList refreshAccessToken={refreshAccessToken}/> : null}
                {leftBookState === "chat" ? <LeftChat refreshAccessToken={refreshAccessToken}/> : null}
                {leftBookState === "newPost" ? <LeftNewPost newPostImages={newPostImages} setNewPostImages={setNewPostImages} newPostHashtag={newPostHashtag} setNewPostHashtag={setNewPostHashtag} newPostContent={newPostContent} setNewPostContent={setNewPostContent} uploadNewPostHandler={uploadNewPostHandler} /> : null}
                {leftBookState === "setting" ? <LeftSetting settingState={settingState} refreshAccessToken={refreshAccessToken}/> : null}
            </div>
          </div>
        </div>
      </div>
      {/* 우측 페이지 */}
      <div className={Style.Cover}>
      <div className={Style.bookCover}>
          <div className={Style.rightbook}>
            <div className={Style.Cover}>
              { rightBookState === "newPost" ? <RightNewPost newPostLikeNotice={newPostLikeNotice} setNewPostLikeNotice={setNewPostLikeNotice} newPostCommentNotice={newPostCommentNotice} setNewPostCommentNotice={setNewPostCommentNotice} newPostReadPostAuth={newPostReadPostAuth} setNewPostReadPostAuth={setNewPostReadPostAuth} newPostReadCommentAuth={newPostReadCommentAuth} setNewPostReadCommentAuth={setNewPostReadCommentAuth} newPostWriteCommentAuth={newPostWriteCommentAuth} setNewPostWriteCommentAuth={setNewPostWriteCommentAuth} newPostReadLikeAuth={newPostReadLikeAuth} setNewPostReadLikeAuth={setNewPostReadLikeAuth}/> :  null}
              { rightBookState === "chat" ? <RightChat refreshAccessToken={refreshAccessToken} /> : null}
              { rightBookState === "notice" ? <RightNotice refreshAccessToken={refreshAccessToken}/> : null}
              { rightBookState === "friend" ? <RightFriend leftBookChangeHandler={leftBookChangeHandler} refreshAccessToken={refreshAccessToken}/> : null}
              { rightBookState === "setting" ? <RightSetting settingState={settingState} SettingChangeHandler={SettingChangeHandler} logout={logout} refreshAccessToken={refreshAccessToken}/> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
export default Home;