import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { useEffect } from 'react';
import Home from "./routes/Home/root/HomeMain";
import Login from "./routes/Login/root/LoginMain";
import { logoutApiUrl, KakaoTokenUrl, NaverTokenUrl } from './apiUrl';

axios.defaults.withCredentials = true;

function App() {

  //로그인시 refresh token을 local Storage에 저장하는 기능 앞에 Bearer 가 붙어있다.
  const loginFunc = (res) => {
    console.log(res);
    //alert("Welcome");
    localStorage.setItem("rft", res.headers.authorization);
    window.location.href="/main";
  };

  //로그아웃 함수
  const logoutFunc = () => {
    axios.get(logoutApiUrl)
    .then((res) => {
      console.log(res);
      alert("logout success");
      localStorage.removeItem("rft");//refresh token 지우기
      window.location.href="/";
    })
    .catch((res)=>{
      console.log("error")
      console.log(res);
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
        alert("소셜 로그인에 문제가 발생했습니다.");
        localStorage.removeItem("rft");//소셜 상태를 종료한다.
        window.location.href = "/";//다시 원래의 로그인 url로 이동한다.
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
        alert("소셜 로그인에 문제가 발생했습니다.");
        localStorage.removeItem("rft");//소셜 상태를 종료한다.
        window.location.href = "/";//다시 원래의 로그인 url로 이동한다.
      });
    }
  };
  useEffect(socialLogin, []);

  return (
    <Router>
      {/*localStorage.getItem("rft") === null ? <Redirect to='/' /> : null*/}
      {/*localStorage.getItem("rft") !== "social" && localStorage.getItem("rft") !== null ?
        <Redirect to="/main" /> : null 
      */}
      <Switch>
        <Route path="/main">
          <Home logout={logoutFunc} />
        </Route>
        <Route path="/">
          <Login login={loginFunc} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;