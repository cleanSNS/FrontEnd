import React from 'react'
import { Link } from "react-router-dom";

const Home = () => {
    console.log("hi");
    return(
      <div>
        <h1>Hello!</h1>
        <Link to="/login">
          <button>to login</button>
        </Link>
      </div>
    );
  }
  
export default Home;