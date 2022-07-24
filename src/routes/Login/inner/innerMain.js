//로그인의 초기 화면. id, 비번을 쓰는 곳이 있다.
import { useState } from 'react';

const Main = ({changeContent}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        if(email === '' || password === '') return

        let loginInfo ={ //보내는 객체 내용 달라질 수 있음 백이랑 통일해야함
            email: email,
            password: password,
        };

        window.location.href = '/home';//구현만 이렇게 해놓음 나중에는 아래껄로 해야함

//        fetch('...', loginInfo)
//            .then((response) => response.json())
//            .then((res) => {
//                console.log(res);
//                res.message === '...' ? alert("아이디나 비밀번호가 틀렸습니다") : window.locatin.href='/home';
//            });
    };
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
        </div>
    );
}

export default Main;