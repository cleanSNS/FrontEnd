//로그인의 초기 화면. id, 비번을 쓰는 곳이 있다.
import { useState } from 'react';
import Style from './innerMain.module.css';
import KakaoImg from '../socialImg/Kakao.png';
import NaverImg from '../socialImg/Naver.png';
import axios from 'axios';

const loginApiUrl = 'http://13.209.50.133:8080/user/auth/login';
const kakaoLoginApiUrl = 'http://13.209.50.133:8080/social/login/kakao/code';
const naverLoginApiUrl = 'http://13.209.50.133:8080/social/login/naver/code';

const Main = ({changeContent}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wrong, setWrong] = useState("0");
    const emailHandler = (event) =>{
        event.preventDefault();
        setEmail(event.target.value);
    };
    const passwordHandler = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    };
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '' || password === '') return;

        axios.post(loginApiUrl, {
            email: email,
            password: password,
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                if(res.message === undefined){
                    setWrong("0");
                    window.location.href = '/home';
                }
                else{
                    setWrong("1");
                    setWrong("2");
                }
            });
    };
    const kakaoLoginHandler = (event) => {
        event.preventDefault();
        console.log("kakao");

        axios.get(kakaoLoginApiUrl)
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
            })

    }
    const naverLoginHandler = (event) => {
        event.preventDefault();
        console.log("naver");
        axios.get(naverLoginApiUrl)
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
            })
    }
    return(
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <div className="row w-75">
                <form onSubmit={submitHandler}>
                    <div className="col-12">
                        <input type="email" placeholder="Email" className="form-control my-1" value={email} onChange={emailHandler}/>
                    </div>
                    <div className="col-12">
                        <input type="password" placeholder="Password" className="form-control my-1" value={password} onChange={passwordHandler}/>
                    </div>
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center my-4">
                        {wrong === "1" ? <p className="text-danger">잘못된 이메일 혹은 비밀번호입니다.</p> : null}
                        {wrong === "2" ? <p className="text-danger">인증 아직 완료되지 않은 계정입니다.</p> : null}
                    </div>
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center my-4">
                        <button className="btn btn-dark w-50 shadow" type="submit">로그인</button>
                    </div>
                </form>
            </div>
            <div className="row w-75">
                <div className="col-6 d-flex flex-column justify-content-center align-items-center">
                    <a href="" className="text-dark text-center text-decoration-none" onClick={changeContent} name="1">비밀번호 찾기</a>
                </div>
                <div className="col-6 d-flex flex-column justify-content-center align-items-center">
                    <a href="" className="text-dark text-center text-decoration-none" onClick={changeContent} name="2">회원 가입</a>
                </div>
            </div>
            <div className="row w-75 my-5">
                <div className="col-6">
                    <button className="btn btn-transparent p-0 border border-0 ">
                        <div id="KakaoContainer" className={Style.kakao}>
                            <img id="symbol" src={KakaoImg} className={Style.kakaoSymbol}/>
                            <span id="label" className={Style.kakaoLabel} onClick={kakaoLoginHandler}>로그인</span>
                        </div>
                    </button>
                </div>
                <div className="col-6">
                    <button className="btn btn-transparent p-0 border border-0 ">
                        <div id="NaverContainer" className={Style.naver}>
                            <img id="symbol" src={NaverImg} className={Style.naverSymbol}/>
                            <span id="label" className={Style.naverLabel} onClick={naverLoginHandler}>로그인</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Main;