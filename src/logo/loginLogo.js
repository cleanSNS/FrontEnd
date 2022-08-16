import Style from "./loginLogo.module.css";

//나중에 a안에 이미지로 변경하기. 그 이미지 스타일도 만들어야함 반응형으로 만들면 좋을듯
const Logo = () =>{
    return(
        <div className={Style.logoCover}>
            <a className={Style.logo} href="/">Logo</a>
        </div>
    )
}

export default Logo;