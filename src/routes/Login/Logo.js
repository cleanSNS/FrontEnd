//로그인 전 페이지들의 로고부분
import Style from "./Logo.module.css";

const Logo = () =>{
    return(
        <div>
            <a className={Style.logo}><img src="./tmp.jpg"/></a>
        </div>
    )
}

export default Logo;