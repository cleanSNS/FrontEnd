import Style from "./Logo.module.css";
import logo from "./logo.png";

//나중에 a안에 이미지로 변경하기. 그 이미지 스타일도 만들어야함 반응형으로 만들면 좋을듯
const Logo = ({preset}) =>{
    return(
        <div className={Style.logoCover}>
            <img src={logo} className={Style.logo} onClick={preset} />
        </div>
    )
};

export default Logo;