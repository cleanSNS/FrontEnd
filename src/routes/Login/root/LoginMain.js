//로그인 화면의 책 전체
import Style from "./LoginMain.module.css";
import Logo from "../../../logo/loginLogo";
import MainInnerStuff from "./mainInnerStuff";

const Login = ({login, setNoticeGetUrl}) => {
    return(
        <div className={Style.Mother}>
            <div className={Style.Cover}>
                <div className={Style.circle1} />
                <div className={Style.circle2} />
                <div className={Style.circle3} />
                <div className={Style.circle4} />
                <div className={Style.spring1} />
                <div className={Style.spring2} />
                <div className={Style.spring3} />
                <div className={Style.spring4} />
                <div className={Style.book}>
                    <Logo />
                    <MainInnerStuff login={login} setNoticeGetUrl={setNoticeGetUrl}/>
                </div>
            </div>
            {/* 스타일 부분 */}
        </div>
    );
}

export default Login;