import { useState } from 'react';

import Home from "./routes/Home/HomeMain";
import Login from "./routes/Login/LoginMain";

function App() {
  const [state, setState] = useState("0")// 0: 로그인 화면 // 1: 메인화면이다.
  const changeState = (val) => {
    setState(val);
  }
  return (
    <div>
      {state === "0" ? <Login changeState={changeState} /> : null}
      {state === "1" ? <Home changeState={changeState} /> : null}
    </div>
  );
}
//로그인 화면에서는 로그인만 해주면 되고, Home에서는 현재의 login상태를 확인하고, login안되어있으면 login화면으로 보내줘야한다.
export default App;