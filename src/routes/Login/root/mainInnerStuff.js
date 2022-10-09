//책에서 로고가 아닌 아래 부분
import { useState } from  "react";
import Main from "../inner/innerMain";
import SignUp from "../inner/innerSignUp";
import FindPW from "../inner/innerFindPW";
import Style from "./mainInnerStuff.module.css";

const MainInnerStuff = ({login, setNoticeGetUrl}) =>{
    //가능한 경우 : LoginMain, FindPassword, SignUp
    const [content, setContent] = useState("loginMain");
    const toLoginPage = () => {
        setContent("loginMain");
    };
    const toFindPasswordPage = () => {
        setContent("findPassword");
    };
    const toSignUpPage = () => {
        setContent("signUp");
    };
    return(
        <div className={Style.Cover}>
            {content === "loginMain" ? <Main login={login} toFindPasswordPage={toFindPasswordPage} toSignUpPage={toSignUpPage} setNoticeGetUrl={setNoticeGetUrl} /> : null}
            {content === "findPassword" ? <FindPW toLoginPage={toLoginPage} toSignUpPage={toSignUpPage} /> : null}
            {content === "signUp" ? <SignUp login={login} toLoginPage={toLoginPage} setNoticeGetUrl={setNoticeGetUrl} /> : null}
        </div>
    )
}

export default MainInnerStuff;