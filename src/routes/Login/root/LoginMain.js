//로그인 메인 화면
import React from 'react';
import Book from "./Book";


const Login = ( {login} ) => {
    return (
      <div>
        <Book login={login} />
      </div>
    );
  }

  export default Login;