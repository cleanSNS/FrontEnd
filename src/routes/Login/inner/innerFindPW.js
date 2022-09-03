//비밀번호 찾기 창의 비밀번호 찾는 부분
import { useState } from 'react';
import Style from './innerFindPW.module.css';

const FindPW = ({toLoginPage, toSignUpPage}) => {
    const [email, setEmail] = useState();
    const emailHandler = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    }
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '') return

        let findPassWordInfo ={
            email: email,
        }
        console.log(findPassWordInfo)//구현시 지워도 됨
        
//        fetch('...', findPassWordInfo)
//            .then((response) => response.json())
//            .then((res) => {
//                console.log(res);
//                res.message === '...' ? alert("해당 이메일 정보가 없습니다.") : changeContent(event);
//            });
    }
    return(
        <form className={Style.WholeCover}>
            <div className={Style.Cover}>
                <p className={Style.text}>로그인에 문제가 있나요?<br />가입했을 때의 이메일을 입력해 주세요.</p>
            </div>
            <div className={Style.Cover}>
            <input 
                className={Style.formInput}
                type="email"
                placeholder="Email"
                value={email}
                onChange={emailHandler} />
            </div>
            <div className={Style.Cover}>
                <button 
                    className={Style.btn}
                    type="submit">
                    비밀번호 초기화 링크 보내기
                </button>
            </div>
            <div className={Style.Cover}>
                <button 
                    className={Style.btn}
                    onClick={toSignUpPage}
                    value="2">
                    회원가입 하기
                </button>
            </div>
            <div className={Style.Cover}>
                <button
                    className={Style.btn}
                    onClick={toLoginPage}
                    value="0">
                    로그인으로 돌아가기
                </button>
            </div>
        </form>
    );
}

export default FindPW;