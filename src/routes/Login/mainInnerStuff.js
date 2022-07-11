//책에서 로고가 아닌 아래 부분
import { useState } from  "react"
import Main from "./inner/innerMain"
import SignUp from "./inner/innerSignUp"
import FindPW from "./inner/innerFindPW"

const MainInnerStuff = () =>{
    const [content, setContent] = useState("0");//0:초기화면 1:회원 가입 2:비번 찾기
    const changeContent = (event) => {
        setContent(event.target.value);
    }
    return(
        <div>
            {content === "0" ? <Main changeContent={changeContent} /> : null}
            {content === "1" ? <FindPW changeContent={changeContent} /> : null}
            {content === "2" ? <SignUp changeContent={changeContent} /> : null}
        </div>
    )
}

export default MainInnerStuff;