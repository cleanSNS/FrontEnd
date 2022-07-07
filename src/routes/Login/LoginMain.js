import React from 'react'
import { Link } from "react-router-dom";

const Login = () => {
    console.log("login please");
    return (
      <div>
        <h1>Login!</h1>
        <Link to="/">
          <button>to home</button>
        </Link>
      </div>
    );
  }

  export default Login;