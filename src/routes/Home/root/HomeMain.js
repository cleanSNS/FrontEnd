import { useState, useEffect } from 'react';
import Style from "./HomeMain.module.css";
import Logo from "../../../logo/Logo";
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
  presetNoticeNumeber,
  getUserNicknameAndImageUrl,
  pageloadHashtagNumUrl,
  uploadImageUrl,
  getChatTriger,
} from "../../../apiUrl";
import axios from 'axios';

const Home = ({ logout, refreshAccessToken, noticeEventSource, userId }) => {
  //오른쪽 책의 내용을 바꿔주는 state => newPost // chat // notice // friend // setting
  const [rightBookState, setRightBookState] = useState("friend");
  //왼쪽 책의 내용을 바꿔주는 state => page(글) // pList // chat // newPost // setting // makeNewC // hastTagPage
  const [leftBookState, setLeftBookState] = useState("page");
  //setting의 내용을 바꿔주는 state => initial(클릭 없음) // profile // Snotice // password // filtering // block
  const [settingState, setSettingState] = useState("initial");

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
    if(userSearch === '') return;
    
    //유저 검색해서 리스트 업데이트
    axios.get(`${getUserNicknameAndImageUrl}search?nickname=${userSearch}`)
    .then((res) => {
      setSearchedList(res.data.data);
      //해시태그의 게시글 숫자 검색
      axios.get(`${pageloadHashtagNumUrl}${userSearch}`)
      .then((res) => {
        setHashtagPageNumber(res.data.data.count);//여기 좀 다를 수 있음
        setIsSubmitted(true);
      })
      .catch((res) => {
        if(res.response.status === 401){
          refreshAccessToken();
        }
        else{
          alert("해시태그의 수를 불러오지 못했습니다.");
          setIsSubmitted(false);
        }
      });
    })
    .catch((res) => {
      if(res.response.status === 401){
        refreshAccessToken();
      }
      else{
        alert("검색하지 못했습니다.");
        setIsSubmitted(false);
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
  /* 좌, 우로 나뉘어져있는 정보를 추합해서 서버에 보내야 하기 때문에 상위 요소에서 작성 */
  //아래는 좌측 페이지로 이동할 정보
  //이미지 리스트 - 파일을 api에 보낼 수 있게 처리한 리스트이다.
  const [newPostImages, setNewPostImages] = useState([]);
  //이미지 리스트 - 파일을 임시로 띄우기 위해 렌더링한 리스트이다.
  const [renderedNewPostImages, setRenderedNewPostImages] = useState([]);
  //해시태그 리스트
  const [newPostHashtag, setNewPostHashtag] = useState([]);
  //글
  const [newPostContent, setNewPostContent] = useState("");

  //글 올리는 함수 => 좌측 페이지로 넘어가야한다. - 두가지가 순차적으로 실행
  const [uploadImages, setUploadImages] = useState([]);
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

    //formData에 파일들 append하기 - 파일명은 image_파일명 으로 생성
    const fileData = new FormData();
    console.log(newPostImages);
    for(let i = 0; i < newPostImages.length; i++){
      fileData.append(`file`, newPostImages[i]);
    }

    axios({
      url: `${uploadImageUrl}page`,
      method: 'POST',
      data: fileData,
      headers:{
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      const tmp = [...res.data]
      setUploadImages(tmp);
    })
    .catch((res) => {
      if(res.response.status === 401){//access token이 만료된 경우이다.
        refreshAccessToken();
      }
      else{
        console.log(res);
        alert("이미지 처리에 실패했습니다.");
      }
    });
  };

  useEffect(() => {
    if(uploadImages.length !== 0){//이미지 처리에 성공해서 렌더링할 파일이 있는 경우
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
        imgUrlList: uploadImages,
        pageHashtagList: newPostHashtag,
      })
      .then((res) => {
        alert("업로드 되었습니다.");
        setNewPostImages([]);
        setNewPostHashtag([]);
        setRenderedNewPostImages([]);
        setNewPostContent("");
        setNewPostLikeNotice(true);
        setNewPostCommentNotice(true);
        setNewPostReadPostAuth("ALL");
        setNewPostReadCommentAuth(true);
        setNewPostWriteCommentAuth(true);
        setNewPostReadLikeAuth(true);
        resetPage();
      })
      .catch((res) => {
        if(res.response.status === 401){//access token이 만료된 경우이다.
          refreshAccessToken();
        }
        else{
          console.log(res);
          alert("글을 올리지 못했습니다.");
        }
      });
    }
  }, [uploadImages]);

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
  };

  //페이지에서 글을 클릭하면 글 중앙으로 오게 하기 - 가운데 글을 위한 UseState
  const [pageId, setPageId] = useState(-1);


  //뒤로가기 이벤트를 처리하기 위한 두 함수
  const [goBack, setGoBack] = useState(false);//뒤로가기 이벤트로 이동한 경우, true로 세팅된다.
  window.onpopstate = function(event) {//뒤로가기 이벤트를 캐치합니다.
    console.log(event.state);
    if(event.state === null) return;
    setRightBookState(event.state.rightBookState);
    setLeftBookState(event.state.leftBookState);
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
    },null, '');
  };
  useEffect(pushStateHandler, [rightBookState, leftBookState]);

  /*************************알림 관련******************************/
  const [noticeCount, setNoticeCount] = useState(-1);

  //처음 로그인 시 알림의 수를 받아오는 함수
  const presetNoticeCount = () => {
    if(noticeCount === -1){//초기상태에서만 이 함수를 이용한다.
      axios.get(presetNoticeNumeber)
      .then((res) => {
        setNoticeCount(res.data.data.count);
      })
      .catch((res) => {
        if(res.response.status === 401){
          refreshAccessToken();
        }
        else{
          alert("알림을 불러오지 못했습니다.");
        }
      })
    }
  };
  useEffect(presetNoticeCount, []);//초기상태에서만 진행

  //SSE이벤트 오픈 - notice개수
  useEffect(() => {
    if(noticeEventSource === null) return;
    noticeEventSource.addEventListener("sse", function (event) {
      const data = JSON.parse(event.data);
      setNoticeCount(data.count);
    });
  }, [noticeCount]);

  /**************로고에 넣을 함수 - 초기 상태로 만드는 함수****************/
  const resetPage = () => {
    setRightBookState("friend");
    setLeftBookState("page");
    setSettingState("initial");
    setPageId(-1);
  };

  /*****************채팅 관련********************/
  const [stompClient, setStompClient] = useState(null);//소켓 연결이 된 친구

  useEffect(() => {
    if(!leftBookState.includes('chat')){//leftBookState가 변경되었는데 그 값에 chat이 없는 경우, stompClient를 disconnect하는 작업이 필요하다.
      if(stompClient !== null){//이전에 할당받은 친구가 있었던 경우 disconnect하고 지금 생성한 Stomp를 넣어준다.
        stompClient.disconnect(function(){
            stompClient.unsubscribe();
        })
      }
    }
  }, [leftBookState]);

  const [chattingTrigerEventSource, setChattingTrigerEventSource] = useState(null);//채팅 관련된 SSE가 들어있는 곳
  const [chattingTriger, setChattingTriger] = useState(null);//이 변수가 이제 오른쪽 채팅에 들어가서 이게 true면 
  useEffect(() => {//상황을 인지해서 eventSource 이벤트 생성
    if(chattingTrigerEventSource === null && rightBookState === "chat"){//초기 상황이거나, 내가 지금 chatting으로 들어온 경우
      const eventSourcetmp = new EventSource(getChatTriger, { withCredentials: true });
      setChattingTrigerEventSource(eventSourcetmp);
      return;
    }

    if(chattingTrigerEventSource !== null && rightBookState !== "chat"){//채팅방 부분을 벗어난 경우, 하지만 여전히 연결되어있는 경우
      chattingTrigerEventSource.close();
      return;
    }
  }, [rightBookState]);
  useEffect(() => {//sse이벤트 설정
    if(chattingTrigerEventSource !== null){
      chattingTrigerEventSource.addEventListener("sse", function (event) {
        const data = JSON.parse(event.data);
        setChattingTriger(true);
      });
    }
  }, [chattingTrigerEventSource]);

  //detailpage에서 좋아요 클릭 시 일반 pagelist에 반영하기 위해 trigger가 되는 값 - detailpage에서 좋아요를 누른 글의 id가 변수의 값이 된다.
  //detailpage에서 변경 시 leftBookState가 page인지 확인하고 누르기
  //단, page에 띄워져있는 리스트에 해당 글이 없는 경우도 존재할 수 있으니 고려해야한다.
  const [detailPageLikeClick, setDetailPageLikeClick] = useState(-1);


  return(
    <div className={Style.pageCover}>
      {/* 좌 상단 - 로고와 검색창 */}
      <div className={Style.Cover}>
        <div className={Style.leftHeader}>
          <Logo preset={resetPage}/>
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
              <div className={Style.noticeArea}>
                {/*chatCount === 0 ? null : <NumberNotice number={chatCount} />*/}
              </div>
            </div>
          </div>
          <div className={Style.Cover}>
            <div className={Style.tag} id="notice">
              <div className={Style.Cover}>
                <img src={notificationTagImg} className={Style.tagImg} onClick={tagClickHandler} id="notice" />
              </div>
              <div className={Style.noticeArea}>
                {(noticeCount === -1 || noticeCount === 0)? null : <NumberNotice number={noticeCount} />}
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
                {leftBookState === "page" ? <LeftPage refreshAccessToken={refreshAccessToken} leftBookState={leftBookState} setPageId={setPageId} detailPageLikeClick={detailPageLikeClick} setDetailPageLikeClick={setDetailPageLikeClick} setLeftBookState={setLeftBookState}/> : null}
                {leftBookState.includes("pList") ? <LeftPageList leftBookState={leftBookState} refreshAccessToken={refreshAccessToken} leftBookChangeHandler={leftBookChangeHandler} setPageId={setPageId} userId={userId}/> : null}
                {leftBookState.includes("chat") ? <LeftChat refreshAccessToken={refreshAccessToken} leftBookState={leftBookState} setLeftBookState={setLeftBookState} userId={userId} stompClient={stompClient} setStompClient={setStompClient}/> : null}
                {leftBookState === "makeNewC" ? <LeftNewChat refreshAccessToken={refreshAccessToken} setLeftBookState={setLeftBookState} userId={userId}/> : null}
                {leftBookState.includes("hashtagPage") ? <LeftHashtagPage leftBookState={leftBookState} setPageId={setPageId}/> : null}
                {leftBookState === "newPost" ? <LeftNewPost renderedNewPostImages={renderedNewPostImages} setRenderedNewPostImages={setRenderedNewPostImages} newPostImages={newPostImages} setNewPostImages={setNewPostImages} newPostHashtag={newPostHashtag} setNewPostHashtag={setNewPostHashtag} newPostContent={newPostContent} setNewPostContent={setNewPostContent} uploadNewPostHandler={uploadNewPostHandler} /> : null}
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
              { rightBookState === "chat" ? <RightChat refreshAccessToken={refreshAccessToken} setLeftBookState={setLeftBookState} leftBookState={leftBookState} rightBookState={rightBookState} chattingTriger={chattingTriger} setChattingTriger={setChattingTriger}/> : null}
              { rightBookState === "notice" ? <RightNotice leftBookChangeHandler={leftBookChangeHandler} refreshAccessToken={refreshAccessToken} setPageId={setPageId} noticeCount={noticeCount} setNoticeCount={setNoticeCount}/> : null}
              { rightBookState === "friend" ? <RightFriend leftBookChangeHandler={leftBookChangeHandler} refreshAccessToken={refreshAccessToken}/> : null}
              { rightBookState === "setting" ? <RightSetting settingState={settingState} SettingChangeHandler={SettingChangeHandler} logout={logout}/> : null}
            </div>
          </div>
        </div>
      </div>
      {pageId === -1 ? null : <DetailPage pageId={pageId} refreshAccessToken={refreshAccessToken} setPageId={setPageId} leftBookChangeHandler={leftBookChangeHandler} userId={userId} resetPage={resetPage} setDetailPageLikeClick={setDetailPageLikeClick} leftBookState={leftBookState}/>}
    </div>
  );
}
  
export default Home;