//로그인의 초기 화면. id, 비번을 쓰는 곳이 있다.
import { useState } from 'react';
import Style from './innerMain.module.css';
import KakaoImg from '../socialImg/kakao_login.png';
import NaverImg from '../socialImg/naver_login.png';
import axios from 'axios';
import {
    loginApiUrl,
    kakaoLoginUrl,
    NaverLoginUrl,
} from "../../../apiUrl";

const Main = ({toFindPasswordPage, toSignUpPage, login}) => {
    //변수 선언
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wrong, setWrong] = useState("clear");//가능한 값, clear(문제 없음), not user(이메일이나 비번이 틀린 경우)

    //input 변경시 반영해주는 함수
    const emailHandler = (event) =>{
        event.preventDefault();
        setEmail(event.target.value);
        setWrong("clear");
    };
    const passwordHandler = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
        setWrong("clear");
    };

    //로그인 클릭 처리 함수
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '') {
            alert("이메일을 입력해 주세요");
            return;
        }
        if(password === '') {
            alert("비밀번호를 입력해 주세요");
            return;
        }
        if(!email.includes("@") || !email.includes(".")){
            alert("올바른 이메일을 입력해 주세요");
            return;
        }

        axios.post(loginApiUrl, {
            email: email,
            password: password,
        })
            .then((res) => {
                setWrong("clear");
                login(res);
            })
            .catch((res) => {
                console.log(res);
                setWrong("not user");
            });
    };

    //카카오 로그인 처리 함수
    const kakaoLoginHandler = (event) => {
        event.preventDefault();
        localStorage.setItem("rft", "kakao");
        window.location.href = kakaoLoginUrl;
    };

    //네이버 로그인 처리 함수 => 카카오와 내용은 동일하다.
    const naverLoginHandler = (event) => {
        event.preventDefault();
        localStorage.setItem("rft", "naver");
        window.location.href = NaverLoginUrl;
    };

    return(
        <form className={Style.loginInnerCover} onSubmit={submitHandler}>
            {/* 아이디 */}
            <div className={Style.Cover}>
            <input 
                type="email"
                placeholder="Email"
                className={Style.formInput}
                value={email}
                onChange={emailHandler}/>
            </div>
            {/* 비밀번호 */}
            <div className={Style.Cover}>
            <input 
                type="password"
                placeholder="Password"
                className={Style.formInput}
                value={password}
                onChange={passwordHandler}/>
            </div>
            {/* 경고문 */}
            <div className={Style.Cover}>
                {wrong === "not user" ? <p className={Style.errorMes}>잘못된 이메일 혹은 비밀번호입니다.</p> : null}
            </div>
            {/* 로그인버튼 */}
            <div className={Style.Cover}>
                <button 
                    className={Style.loginbtn}
                    type="submit">
                    로 그 인
                </button>
            </div>
            {/* 찾기와 회원가입 */}
            <div className={Style.Cover}>
                <div className={Style.splitCover}>
                    <div />
                    <div className={Style.Cover}>
                        <p
                            className={Style.word}
                            onClick={toFindPasswordPage}>
                            비밀번호 찾기
                        </p>
                    </div>
                    <div className={Style.Cover}>
                        <p
                            className={Style.word}
                            onClick={toSignUpPage}>
                            회원 가입
                        </p>
                    </div>
                    <div />
                </div>
            </div>
            {/* 소셜 로그인 */}
            <div className={Style.Cover}>
                <div className={Style.splitCover}>
                    <div />
                    <div className={Style.Cover}>
                        <div className={Style.kakaoContainer} onClick={kakaoLoginHandler}>
                            <img className={Style.kakaoSymbol} src={KakaoImg}/>
                            <p className={Style.kakaoLabel}>로그인</p>
                        </div>
                    </div>
                    <div className={Style.Cover}>
                        <img className={Style.naverBtn} src={NaverImg} onClick={naverLoginHandler}/>
                    </div>
                    <div />
                </div>
            </div>
        </form>
    );
}

export default Main;