//비밀번호 찾기 창의 비밀번호 찾는 부분
import { useState } from 'react';

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
        <div className="container w-75">
            <div className="row text-center">
                <p>로그인에 문제가 있나요?<br />가입했을 때의 이메일을 입력해 주세요.</p>
            </div>
            <div className="row">
                <form onSubmit={submitHandler} name="0">
                    <div className="col-12 my-5">
                        <input className="form-control shadow" type="email" placeholder="Email" value={email} onChange={emailHandler} />
                    </div>
                    <div className="col-12 my-2">
                        <button className="btn btn-dark w-100 shadow" type="submit">비밀번호 초기화 링크 보내기</button>
                    </div>
                </form>
                <div className="col-12 my-2">
                    <button className=" btn btn-dark w-100 shadow" onClick={toSignUpPage} value="2">회원가입 하기</button>
                </div>
                <div className="col-12 mt-2">
                    <button className="col-12 btn btn-dark w-100 shadow" onClick={toLoginPage} value="0">로그인으로 돌아가기</button>
                </div>
            </div>
        </div>
    );
}

export default FindPW;