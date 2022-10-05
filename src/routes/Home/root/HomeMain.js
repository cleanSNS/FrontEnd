import { useState, useEffect } from 'react';
import Style from "./HomeMain.module.css";
import Logo from "../../../logo/mainLogo";
import SearchBar from "./searchBar";
import NumberNotice from "./numberNotice";
import DetailPage from './detailPage';

import LeftPage from "../leftInner/page/page";
import LeftPageList from "../leftInner/pageList/pageList";
import LeftChat from "../leftInner/chat/chat";
import LeftNewPost from "../leftInner/newPost/newPost";
import LeftSetting from "../leftInner/setting/settingMain";
import LeftNewChat from "../leftInner/newChat/newChat";
import LeftHashtagPage from "../leftInner/hashtagPage/hashtagPage";

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
  newPostUrl,
  getNoticeNumber,
  getMyUserIdUrl,
  getUserNicknameAndImageUrl,
  pageloadHashtagNumUrl,
} from "../../../apiUrl";
import axios from 'axios';

const Home = ({ logout, refreshAccessToken }) => {
  //오른쪽 책의 내용을 바꿔주는 state => newPost // newChat // chat // notice // friend // setting
  const [rightBookState, setRightBookState] = useState("friend");
  //왼쪽 책의 내용을 바꿔주는 state => page(글) // pList // chat // newPost // setting
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

  /*************************글 검색 부분****************************/
  //필요 변수 선언
  const [userSearch, setUserSearch] = useState("");//사용자의 search input이다.
  const [isSubmitted, setIsSubmitted] = useState(false);//제출된 상태인지 입력중인 상태인지를 나타낸다.
  const [searchedList, setSearchedList] = useState([]);//검색 결과 list이다.
  const [hashtagPageNumber, setHashtagPageNumber] = useState(0);//해당 해시태그에 속하는 글의 수이다.

  //사용자의 input에 따라 input의 value를 바꾸는 함수
  const userSearchChangeHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(false);//검색을 입력 중에는 submit된 상태가 아니므로 false로 만든다
    setUserSearch(event.target.value);
  }

  //사용자의 input을 검색하는 함수
  const userSearchSubmitHandler = (event) => {
    event.preventDefault();
    let isOK = false;
    if(userSearch === '') return;
    
    //유저 검색해서 리스트 업데이트
    axios.get(`${getUserNicknameAndImageUrl}search?nickname=${userSearch}`)
    .then((res) => {
      setSearchedList(res.data.data);
      isOK = true;
    })
    .catch((res) => {
      if(res.status === 401){
        refreshAccessToken();
      }
      else{
        alert("검색하지 못했습니다.");
      }
    });

    //해시태그의 게시글 숫자 검색
    axios.get(`${pageloadHashtagNumUrl}${userSearch}`)
    .then((res) => {
      setHashtagPageNumber(res.data.count);//여기 좀 다를 수 있음
      if(isOK) setIsSubmitted(true);
    })
    .catch((res) => {
      if(res.status === 401){
        refreshAccessToken();
      }
      else{
        alert("해시태그의 수를 불러오지 못했습니다.");
      }
    });
  };

  const searchedUserClickHandler = (event) => {
    event.preventDefault();
    //제출이 끝난 것으로 인식한다. 다시 초기 상태로 변환 - 아래 3개
    setIsSubmitted(false);
    setUserSearch("");
    setSearchedList([]);
    //이제 좌측 페이지 변경
    setLeftBookState(`pList/${(event.target.id.split('_'))[1]}`);
  };

  const searchedHashtagClickHandler = (event) => {
    event.preventDefault();
    //제출이 끝난 것으로 인식한다. 다시 초기 상태로 변환 - 아래 3개
    setIsSubmitted(false);
    setUserSearch("");
    setSearchedList([]);
    //이제 좌측 페이지 변경
    setLeftBookState(`hashtagPage/${userSearch}`);
  };

  /*****************************new Post 관련*********************************/
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
      setNewPostImages([]);
      setNewPostHashtag([]);
      setNewPostContent("");
      setNewPostLikeNotice(true);
      setNewPostCommentNotice(true);
      setNewPostReadPostAuth("ALL");
      setNewPostReadCommentAuth(true);
      setNewPostWriteCommentAuth(true);
      setNewPostReadLikeAuth(true);
      window.location.href = "/main";
    })
    .catch((res) => {
      if(res.status === 401){//access token이 만료된 경우이다.
        refreshAccessToken();
      }
      else{
        console.log("잘못된 양식입니다.");
        console.log(res);
        alert("문제 발생");
        //window.location.href = "/main";
      }
    });
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

  //태그 색상 변경
  const tagColorChangeHandler = () => {
    document.querySelector("#newPost").style.backgroundColor = "rgb(190, 190, 190)";
    document.querySelector("#chat").style.backgroundColor = "rgb(190, 190, 190)";
    document.querySelector("#notice").style.backgroundColor = "rgb(190, 190, 190)";
    document.querySelector("#friend").style.backgroundColor = "rgb(190, 190, 190)";
    document.querySelector("#setting").style.backgroundColor = "rgb(190, 190, 190)";
    document.querySelector(`#${rightBookState}`).style.backgroundColor = "rgb(145, 145, 145)";//원래 눌려있던 버튼 밝게 변경
  };
  useEffect(tagColorChangeHandler, [rightBookState]);

  //우측 내용 클릭시 좌측 내용 변화 함수
  //채팅, 알림, 친구의 경우 이 함수를 사용해야 좌측이 달라진다.
  const leftBookChangeHandler = (val) => {
    setLeftBookState(val);
  };

  //setting 변경 함수
  const SettingChangeHandler = (val) => {
    setSettingState(val);
  }

  //읽지 않은 채팅 개수 읽어들이기 <---------------------------------구현해야함(아래랑 아주 유사하게 구현)
  const [chatNumber, setChatNumber] = useState(0);
  const getChatNumberFunc = () => {

  };
  useEffect(getChatNumberFunc, [rightBookState]);

  //읽지 않은 알림 개수 읽어들이기
  const [noticeNumber, setNoticeNumber] = useState(0);
  const getNoticeNumberFunc = () => {
    if(rightBookState === "notice"){//notice부분을 보는 중이라면 알림부분을 없앤다.
      setNoticeNumber(0);
      return;
    }
    else{//그 외의 부분을 보는 중이라면 알림의 개수를 읽어서 반영한다.
      axios.get(getNoticeNumber)
      .then((res) => {
        setNoticeNumber(res.data.count);
      })
      .catch((res) =>{
        if(res.status === 401){
          refreshAccessToken();
        }
        else{
          console.log("알림의 개수를 불러오지 못했습니다.");
        }
      });
      }
  };
  useEffect(getNoticeNumberFunc, [rightBookState]);

  //페이지에서 글을 클릭하면 글 중앙으로 오게 하기 - 가운데 글을 위한 UseState
  const [pageId, setPageId] = useState(-1);


  //뒤로가기 이벤트를 처리하기 위한 두 함수
  const [goBack, setGoBack] = useState(false);//뒤로가기 이벤트로 이동한 경우, true로 세팅된다.
  window.onpopstate = function(event) {//뒤로가기 이벤트를 캐치합니다.
    console.log(event.state);
    if(event.state === null) return;
    setRightBookState(event.state.rightBookState);
    setLeftBookState(event.state.leftBookState);
    setPageId(event.state.pageId);
    setGoBack(true);
  };

  const pushStateHandler = () => {//state에 변경이 있을 때마다 state에 집어넣기
    if(goBack){
      setGoBack(false);
      return;
    }
    window.history.pushState({
      rightBookState: rightBookState,
      leftBookState: leftBookState,
      pageId: pageId
    },null, '');
  };
  useEffect(pushStateHandler, [rightBookState, leftBookState, pageId]);

  //접속한 유저의 id를 불러와서 필요한 곳에서 사용
  const [userId, setUserId] = useState(-1);
  const getUserIdHandler = () => {
    axios.get(getMyUserIdUrl)
    .then((res) => {
      setUserId(res.data.data.userId);
    })
    .catch((res) => {
      if(res.status === 401){
        refreshAccessToken();
      }
      else{
        console.log("유저 아이디를 불러오지 못했습니다.");
      }
    });
  };
  useEffect(getUserIdHandler, []);

  return(
    <div className={Style.pageCover}>
      {/* 좌 상단 - 로고와 검색창 */}
      <div className={Style.Cover}>
        <div className={Style.leftHeader}>
          <Logo />
          <div />
          <SearchBar userSearch={userSearch} hashtagPageNumber={hashtagPageNumber} userSearchChangeHandler={userSearchChangeHandler} userSearchSubmitHandler={userSearchSubmitHandler} isSubmitted={isSubmitted} searchedList={searchedList} searchedUserClickHandler={searchedUserClickHandler} searchedHashtagClickHandler={searchedHashtagClickHandler}/>
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
            <div className={Style.noticeArea}>
              {noticeNumber === 0 ? null : <NumberNotice number={chatNumber} />}
            </div>
          </div>
          <div className={Style.Cover}>
            <div className={Style.tag} id="notice">
              <div className={Style.Cover}>
                <img src={notificationTagImg} className={Style.tagImg} onClick={tagClickHandler} id="notice" />
              </div>
            </div>
            <div className={Style.noticeArea}>
              {chatNumber === 0 ? null : <NumberNotice number={noticeNumber} />}
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
                {leftBookState.includes("page") ? <LeftPage refreshAccessToken={refreshAccessToken} leftBookState={leftBookState} setPageId={setPageId}/> : null}
                {leftBookState.includes("pList") ? <LeftPageList leftBookState={leftBookState} refreshAccessToken={refreshAccessToken} leftBookChangeHandler={leftBookChangeHandler} setPageId={setPageId} userId={userId}/> : null}
                {leftBookState === "chat" ? <LeftChat refreshAccessToken={refreshAccessToken}/> : null}
                {leftBookState === "newChat" ? <LeftNewChat /> : null}
                {leftBookState.includes("hashtagPage") ? <LeftHashtagPage leftBookState={leftBookState}/> : null}
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
              { rightBookState === "notice" ? <RightNotice leftBookChangeHandler={leftBookChangeHandler} refreshAccessToken={refreshAccessToken} setPageId={setPageId}/> : null}
              { rightBookState === "friend" ? <RightFriend leftBookChangeHandler={leftBookChangeHandler} refreshAccessToken={refreshAccessToken}/> : null}
              { rightBookState === "setting" ? <RightSetting settingState={settingState} SettingChangeHandler={SettingChangeHandler} logout={logout}/> : null}
            </div>
          </div>
        </div>
      </div>
      {pageId === -1 ? null : <DetailPage pageId={pageId} refreshAccessToken={refreshAccessToken} setPageId={setPageId} userId={userId}/>}
      {/*<DetailPage pageId={pageId} refreshAccessToken={refreshAccessToken} setPageId={setPageId}/>*/}{/* 테스트용. */}
    </div>
  );
}
  
export default Home;