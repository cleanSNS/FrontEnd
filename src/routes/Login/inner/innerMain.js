//로그인의 초기 화면. id, 비번을 쓰는 곳이 있다.
import { useState } from 'react';
import Style from './innerMain.module.css';
import KakaoImg from '../socialImg/Kakao.png';
import NaverImg from '../socialImg/Naver.png';
import axios from 'axios';
import {
    loginApiUrl,
    kakaoLoginUrl,
    naverLoginApiUrl
} from "../../../apiUrl";

const Main = ({toFindPasswordPage, toSignUpPage, login}) => {
    //변수 선언
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wrong, setWrong] = useState("0");//가능한 값, clear(문제 없음), not user(이메일이나 비번이 틀린 경우)

    //input 변경시 반영해주는 함수
    const emailHandler = (event) =>{
        event.preventDefault();
        setEmail(event.target.value);
    };
    const passwordHandler = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    };

    //로그인 클릭 처리 함수
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '' || password === '') return;

        axios.post(loginApiUrl, {
            email: email,
            password: password,
        })
            .then((res) => {
                setWrong("clear");
                login(res);
                window.location.href="/main";
            })
            .catch((res) => {
                console.log(res);
                setWrong("not user");
            });
    };

    //카카오 로그인 처리 함수
    const kakaoLoginHandler = (event) => {
        event.preventDefault();
        //App.js에서 로그인 되지 않은 상황에서 login페이지를 벗어나는 것을 막는 과정에서 카카오 로그인중에 강제로 redirction이 발생할 수 있다.
        //이를 막기 위해서 rft를 social로 변경. 해당 상태에서는 redirection이 발생하지 않게 한다
        localStorage.setItem("rft", "social");
        window.location.href = kakaoLoginUrl;
        /*
            해당 Url로 들어가면 서버에서 자동으로 redirect를 해서 카카오 로그인 페이지로 이동시켜준다.
            사용자가 카카오 로그인을 하면 카카오에서 사전에 동의된 대로 서버에게 데이터를 넘겨준다.
            서버는 받은 데이터를 기반으로 회원가입을 진행하고 이후 문제가 없다면 즉시 로그인을 진행한다.
            redirect된 페이지 .../social/login/kakao로 엑세스 토큰과 리프레시 토큰을 지급한다.
            이후 해야할 작업은 사이트를 열고, 서버와 프론트가 하나의 ip로 구동될 때, 해당 페이지를 만들어야한다.
            해당 페이지에서 토큰을 받고, "rft"를 변경하고, /main으로 redirct하는 useState함수만 작성하면 끝이다.
            화면에는 잠시만 기다려달라는 말을 쓰면 된다.
        */
    };

    //네이버 로그인 처리 함수 => 카카오와 내용은 동일하다.
    const naverLoginHandler = (event) => {
        event.preventDefault();
        localStorage.setItem("rft", "social");
        window.location.href = naverLoginApiUrl;
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
                </div>
            </div>
            {/* 소셜 로그인 */}
            <div className={Style.Cover}>
                <div className={Style.split4Cover}>
                    <div />
                    <div className={Style.Cover}>
                        <button className={Style.Socialbtn}>
                            <div id="KakaoContainer" className={Style.kakao}>
                                <img id="symbol" src={KakaoImg} className={Style.kakaoSymbol}/>
                                <span id="label" className={Style.kakaoLabel} onClick={kakaoLoginHandler}>로그인</span>
                            </div>
                        </button>
                    </div>
                    <div className={Style.Cover}>
                        <button className={Style.Socialbtn}>
                            <div id="NaverContainer" className={Style.naver}>
                                <img id="symbol" src={NaverImg} className={Style.naverSymbol}/>
                                <span id="label" className={Style.naverLabel} onClick={naverLoginHandler}>로그인</span>
                            </div>
                        </button>
                    </div>
                    <div />
                </div>
            </div>
        </form>
    );
}

export default Main;