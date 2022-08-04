import React from 'react';
import { Link } from "react-router-dom";
import Style from "./HomeMain.module.css";
import Members from "../../footer/footer";

const Home = ({changeState}) => {
    return(
      <div className={Style.pageCover}>
        <div />
        <div className={Style.mainPage}>
          <h1 className={Style.Check}>Hi</h1>
        </div>
        <div />
        <Members />
      </div>
    );
  }
  
export default Home;