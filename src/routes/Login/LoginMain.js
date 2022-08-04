//로그인 메인 화면
import React from 'react';
import Book from "./Book";


const Login = ( {changeState} ) => {
    return (
      <div>
        <Book changeState={changeState}/>
      </div>
    );
  }

  export default Login;