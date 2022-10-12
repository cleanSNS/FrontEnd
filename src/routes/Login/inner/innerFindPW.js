//비밀번호 찾기 창의 비밀번호 찾는 부분
import { useState } from 'react';
import Style from './innerFindPW.module.css';
import axios from 'axios';
import { findPWUrl } from '../../../apiUrl';

const FindPW = ({toLoginPage, toSignUpPage}) => {
    const [email, setEmail] = useState();
    const emailHandler = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    }
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '') {
            alert("이메일을 입력해 주세요");
            return;
        }
        if(!email.includes("@") || !email.includes(".")){
            alert("올바른 이메일을 입력해 주세요");
            return;
        }

        axios.post(findPWUrl, {
            email: email,
        })
        .then((res) => {
            alert("이매일을 보냈습니다. 비밀번호를 확인하고 입력해 주세요.");
            toLoginPage();
        })
        .catch((res) => {
            alert("가입되지 않은 이메일입니다.");
            toLoginPage();
        });
    }
    return(
        <form className={Style.WholeCover} onSubmit={submitHandler}>
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