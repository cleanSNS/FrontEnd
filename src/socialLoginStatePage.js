import Style from "./socialLoginStatePage.module.css";

const SocialLoginStatePage = () => {
    return(
        <div className={Style.Cover}>
            <p className={Style.ment}>
                소셜 로그인 중입니다. 잠시 기다려 주세요...
            </p>
        </div>
    )
};

export default SocialLoginStatePage;