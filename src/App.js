import axios from 'axios';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Home from "./routes/Home/root/HomeMain";
import Login from "./routes/Login/root/LoginMain";

const logoutApiUrl = 'http://52.78.49.137:8080/user/auth/logout';

const kakaotokenUrl = 'http://52.78.49.137:8080/social/login/kakao?code=';
//const navertokenUrl = 'http://52.78.49.137:8080/social/login/naver';

function App() {

  //로그인시 refresh token을 local Storage에 저장하는 기능
  const loginFunc = (res) => {
    localStorage.setItem("rft", res.headers.authorization);
    window.location.href="/main";
  };

  //로그아웃 함수
  const logoutFunc = () => {
    axios.get(logoutApiUrl)
    .then((res) => {
      alert("logout success");
      localStorage.removeItem("rft");//refresh token 지우기
      window.location.href="/";
    })
    .catch((res)=>{
      console.log("error")
      console.log(res);
    });
  };

  //카카오톡 로그인 함수


  return (
    <Router>
      {localStorage.getItem("rft") === null ? <Redirect to='/' /> : null}
      {localStorage.getItem("rft") !== "social" && localStorage.getItem("rft") !== null ?
        <Redirect to="/main" /> : null 
      }
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