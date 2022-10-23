import axios from 'axios';
import { useEffect, useState } from 'react';
import Home from "./routes/Home/root/HomeMain";
import Login from "./routes/Login/root/LoginMain";
import Email from "./routes/Email/email";
import { logoutApiUrl, KakaoTokenUrl, NaverTokenUrl, refreshNewAccessTokenUrl, getNoticeNumber, getMyUserIdUrl } from './apiUrl';
axios.defaults.withCredentials = true;

function App() {
  const [isLogin, setIsLogin] = useState("logout");//처음에는 로그인 되지 않은상태이다. => "login" // "logout"가능
  const [noticeEventSource, setNoticeEventSource] = useState(null);
  const [userId, setUserId] = useState(-1);

  //userId를 받고 SSE를 여는 함수
  const getUserIdANdOpenSSEHandler = () => {
    axios.get(getMyUserIdUrl)
    .then((res) => {
      setUserId(res.data.data.userId);
    })
    .catch((res) => {
      if(res.response.status === 401){
        refreshAccessToken();
      }
      else{
        console.log("유저 아이디를 불러오지 못했습니다.");
      }
    });

    const eventSourcetmp = new EventSource(getNoticeNumber, { withCredentials: true });
    setNoticeEventSource(eventSourcetmp);
  };

  //로그인시 refresh token을 local Storage에 저장하는 기능 앞에 Bearer 가 붙어있다.
  const loginFunc = (res) => {
    localStorage.setItem("rft", res.headers.authorization);//rft설정

    getUserIdANdOpenSSEHandler();

    window.history.pushState(null, null, "https://cleanbook.site/");//소셜 로그인등은 code가 생기므로 그거 없애기
    setIsLogin("login");//메인화면으로 이동
  };

  //Access token이 만료되었을 수 있는 상황에서 refresh Token을 통해 다시 발급받는다.
  const refreshAccessToken = () => {
    const rft = localStorage.getItem("rft");
    if(rft === null) return;//rft가 없다면 종료한다.
    if(rft === "kakao" || rft === "naver") return;//소셜 로그인된 상황이므로, 해당 함수 그냥 종료.

    axios.get(refreshNewAccessTokenUrl, {
      headers:{
        Authorization: rft
      }
    })
    .then((res) => {
      //state가 login이든 아니든 재발급은 AT은 시간초과, RT은 시간 초과가 안된 시점이다.
      console.log(res);
      console.log("토큰 재발급 되었습니다.");
      if(isLogin === "logout"){
        //새로고침했는데 마침 AT만 시간초과된 경우.
        //JS에 선언된SSE, userId가 유실된 상태이므로 복구하고 login상태로 만든다.
        getUserIdANdOpenSSEHandler();
        setIsLogin("login");
        return;
      }
    })
    .catch((res) =>{
      if(res.response.data.message === "만료된 토큰입니다." || res.response.data.message === "access token이 존재하지 않습니다."){//너무 오래된 경우 isLogin의 상태와 무관하게 만료되면 logout한다.
        alert("장시간 로그인되어, 자동 로그아웃되었습니다. 다시 로그인해주세요.");
        logoutFunc(); //정상작동 확인되면 앞 주석 지우기
        return;//해당 부분만 실행한다.
      }
      if(isLogin === "logout"){//만료되지 않았으나 호출 => 새로고침 그래서 Accesstoken이 만료되지않았다는 오류가 발생
        getUserIdANdOpenSSEHandler();
        setIsLogin("login");
      }
    })
  };
  useEffect(refreshAccessToken, []);//처음 화면을 켰을 때, 한번 자동으로 실행해서 실수로 껐더라도 자동 로그인이 되게 한다.

  //로그아웃 함수
  const logoutFunc = () => {
    if(noticeEventSource !== null) {
      console.log("SSE close");
      noticeEventSource.close();
      setNoticeEventSource(null);
    }
    axios.get(logoutApiUrl)
    .then((res) => {
      console.log(res);
      localStorage.removeItem("rft");//refresh token 지우기
      setIsLogin("logout");//로그인 화면으로 이동
    })
    .catch((res)=>{
      //일반적으로 오류인 경우는 없다 그냥 rft가 만료되었을 뿐이다. 만료되어서 그냥 CORS에러가 뜨니까 다시 로그인 하게 만들기
      localStorage.removeItem("rft");//refresh token 지우기
      setIsLogin("logout");//로그인 화면으로 이동
    });
  };

  //카카오 로그인 시 토큰을 프론트로 받게 되는 경우 처리하는 함수
  const socialLogin = () => {
    if(localStorage.getItem("rft") === "kakao"){//소셜 처리중인 경우
      const params = new URL(window.location.href).searchParams;
      const code = params.get("code");
      console.log(code);
      axios.post(KakaoTokenUrl + code)
      .then((res) => {//문제가 없는 경우이므로, 로그인 해준다.
        console.log(res);
        loginFunc(res);
      })
      .catch((res) => {
        console.log(res);
        alert("카카오 소셜 로그인에 문제가 발생했습니다.");
        localStorage.removeItem("rft");//소셜 상태를 종료한다.
        window.location.href = "/";//다시 원래의 로그인 url로 이동한다. => 이건 이게 맞는듯 하다 ?code=을 없애기 위해
      });
    }
    else if(localStorage.getItem("rft") === "naver"){//소셜 처리중인 경우
      const params = new URL(window.location.href).searchParams;
      const code = params.get("code");
      console.log(code);
      axios.post(NaverTokenUrl + code)
      .then((res) => {//문제가 없는 경우이므로, 로그인 해준다.
        console.log(res);
        loginFunc(res);
      })
      .catch((res) => {
        console.log(res);
        alert("네이버 소셜 로그인에 문제가 발생했습니다.");
        localStorage.removeItem("rft");//소셜 상태를 종료한다.
        window.location.href = "/";//다시 원래의 로그인 url로 이동한다.
      });
    }
  };
  useEffect(socialLogin, []);

  //이메일 인증을 위해 페이지로 들어온 것인지 여부를 확인
  const [authInfo, setAuthInfo] = useState({});
  const emailCheck = () => {
    const params = new URL(window.location.href).searchParams;
    const email = params.get("email");
    const authToken = params.get("authToken");
    if(email !== null || authToken !== null){//이메일 인증 중이라면 넘겨줄 정보를 세팅하고, email로 바꿔준다.
      setAuthInfo({
        email: email,
        authToken: authToken,
      });
      setIsLogin("email");
    }
  };
  useEffect(emailCheck, []);

  return (
    <div>
      {isLogin === "login" ? <Home logout={logoutFunc} refreshAccessToken={refreshAccessToken} noticeEventSource={noticeEventSource} userId={userId}/> : null}
      {isLogin === "logout" ? <Login login={loginFunc}/> : null}
      {isLogin === "email" ? <Email authInfo={authInfo} /> : null}
      <button type="button" onClick={(event) => {setIsLogin("login")}}>관리자 버튼</button>{/* 나중에 삭제해야함 */}
    </div>
  );
}

export default App;