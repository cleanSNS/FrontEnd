//로그인 화면의 책 전체
import Style from "./LoginMain.module.css";
import Logo from "../../../logo/loginLogo";
import MainInnerStuff from "./mainInnerStuff";

const Login = ({login}) => {
    return(
        <div className={Style.Cover}>
            <div className={Style.book}>
                <div className={Style.bookinnerCover}>
                    <Logo />
                    <MainInnerStuff login={login} />
                </div>
            </div>
        </div>
    );
}

export default Login;