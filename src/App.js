import axios from 'axios';
import { useEffect, useState } from 'react';
import Home from "./routes/Home/root/HomeMain";
import Login from "./routes/Login/root/LoginMain";
import { logoutApiUrl, KakaoTokenUrl, NaverTokenUrl, refreshNewAccessTokenUrl, getNoticeNumber, getMyUserIdUrl } from './apiUrl';
axios.defaults.withCredentials = true;

function App() {
  const [isLogin, setIsLogin] = useState("logout");//처음에는 로그인 되지 않은상태이다. => "login" // "logout"가능
  const [noticeEventSource, setNoticeEventSource] = useState(null);
  const [userId, setUserId] = useState(-1);

  //로그인시 refresh token을 local Storage에 저장하는 기능 앞에 Bearer 가 붙어있다.
  const loginFunc = (res) => {
    console.log(res);//로그인의 응답
    localStorage.setItem("rft", res.headers.authorization);//rft설정

    let tmpUserId = -1;

    axios.get(getMyUserIdUrl)
    .then((res) => {
      setUserId(res.data.data.userId);
      tmpUserId = res.data.data.userId;
      console.log(res.data.data.userId);
    })
    .catch((res) => {
      if(res.status === 401){
        refreshAccessToken();
      }
      else{
        console.log("유저 아이디를 불러오지 못했습니다.");
      }
    });

    const eventSourcetmp = new EventSource(`${getNoticeNumber}/${tmpUserId}`, { withCredentials: true });
    setNoticeEventSource(eventSourcetmp);

    window.history.pushState(null, null, '');//소셜 로그인등은 code가 생기므로 그거 없애기

    setIsLogin("login");//메인화면으로 이동
  };

  //Access token이 만료되었을 수 있는 상황에서 refresh Token을 통해 다시 발급받는다.
  const refreshAccessToken = () => {
    const rft = localStorage.getItem("rft");
    if(rft === null) return;//rft가 없다면 종료한다.

    if(rft === "kakao" || rft === "naver") return;//소셜 로그인된 상황이므로, 해당 함수 그냥 종료.

    if(isLogin === "logout"){//새로고침해서 불필요하게 여기로 돌아온 경우이다. 이 경우, SSE, userId가 유실된다.
      
    }

    axios.get(refreshNewAccessTokenUrl, {
      headers:{
        "REFRESH-TOKEN": rft
      }
    })
    .then((res) => {
      console.log(res);
      console.log("토큰 재발급 되었습니다.");
    })
    .catch((res) =>{
      console.log(res);
      alert("장시간 로그인되어, 자동 로그아웃되었습니다. 다시 로그인해주세요.");
      logoutFunc(); //정상작동 확인되면 앞 주석 지우기
    })
  };
  useEffect(refreshAccessToken, []);//처음 화면을 켰을 때, 한번 자동으로 실행해서 실수로 껐더라도 자동 로그인이 되게 한다.

  //로그아웃 함수
  const logoutFunc = () => {
    if(noticeEventSource !== null) {
      noticeEventSource.close();
      setNoticeEventSource(null);
    }
    axios.get(logoutApiUrl)
    .then((res) => {
      console.log(res);
      alert("로그아웃 했습니다.");
      localStorage.removeItem("rft");//refresh token 지우기
      setIsLogin("logout");//로그인 화면으로 이동
    })
    .catch((res)=>{
      console.log(res);
      alert("로그아웃에 문제가 발생했습니다");
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

  return (
    <div>
      {isLogin === "login" ? <Home logout={logoutFunc} refreshAccessToken={refreshAccessToken} noticeEventSource={noticeEventSource} userId={userId}/> : null}
      {isLogin === "logout" ? <Login login={loginFunc}/> : null}
    </div>
  );
}

export default App;