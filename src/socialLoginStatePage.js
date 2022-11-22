import Style from "./socialLoginStatePage.module.css";
import {KakaoTokenUrl} from './apiUrl';

const SocialLoginStatePage = ({socialState}) => {
    return(
        <div className={Style.Cover}>
            <p className={Style.ment} style={socialState === KakaoTokenUrl ? {border: "5px solid #FEE500"} : {border: "5px solid #03C75A"}}>
                소셜 로그인 중입니다.<br /> 잠시 기다려 주세요...
            </p>
        </div>
    )
};

export default SocialLoginStatePage;