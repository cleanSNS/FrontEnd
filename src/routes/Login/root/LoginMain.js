//로그인 화면의 책 전체
import Style from "./LoginMain.module.css";
import Logo from "../../../logo/Logo";
import { useState } from  "react";
import Main from "../inner/innerMain";
import SignUp from "../inner/innerSignUp";
import FindPW from "../inner/innerFindPW";

const Login = ({login}) => {
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
        <div className={Style.WholeCover}>
            <div className={Style.Cover}>
                {/*스타일을 위한 부분 */}
                <div>
                    <div className={Style.circle1} />
                    <div className={Style.circle2} />
                    <div className={Style.circle3} />
                    <div className={Style.circle4} />
                    <div className={Style.spring1} />
                    <div className={Style.spring2} />
                    <div className={Style.spring3} />
                    <div className={Style.spring4} />
                </div>
                {/* 실제 의미있는 부분 */}
                <div className={Style.book}>
                    <Logo preset={toLoginPage}/>
                    <div className={Style.simpleCover}>
                        {content === "loginMain" ? <Main login={login} toFindPasswordPage={toFindPasswordPage} toSignUpPage={toSignUpPage} /> : null}
                        {content === "findPassword" ? <FindPW toLoginPage={toLoginPage} toSignUpPage={toSignUpPage}/> : null}
                        {content === "signUp" ? <SignUp login={login} toLoginPage={toLoginPage}/> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;