//로그인 전 페이지들의 로고부분
import logo from "./tmp-logo.jpg"

const Logo = () =>{
    return(
        <div>
            <a href="/login"><img src={logo} /></a>
        </div>
    )
}

export default Logo;