import Style from "./loginLogo.module.css";
import logo from "./logo.png";

//나중에 a안에 이미지로 변경하기. 그 이미지 스타일도 만들어야함 반응형으로 만들면 좋을듯
const Logo = () =>{
    const clickHandler = (event) => {
        event.preventDefault();
        window.location.href= '/';
    }
    return(
        <div className={Style.logoCover}>
            <img src={logo} className={Style.logo} onClick={clickHandler} />
        </div>
    )
}

export default Logo;