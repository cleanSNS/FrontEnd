//회원가입 부분
import {useState, useEffect} from 'react';
const signUpApiUrl = 'http://13.209.50.133:8080/user/auth/signup';

const SignUp = ({changeContent}) => {
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [nickname, setNickname] = useState("");
    const [age, setAge] = useState(0);
    const [ageAgree, setAgeAgree] = useState(false);
    const [gender, setGender] = useState("");
    const [genderAgree, setGenderAgree] = useState(false);
    const emailHandler = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    }
    const passwordHandler = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
        setPasswordCheck("");
    }
    const passwordCheckHandler = (event) => {
        event.preventDefault();
        setPasswordCheck(event.target.value);
    }
    const passwordCheckFunc = () => {
         if(password !== passwordCheck){
            if(!document.querySelector("#passwordCheckInput").className.includes(' is-invalid')){
                document.querySelector("#passwordCheckInput").className += ' is-invalid';
            }
        }
        else{
            if(document.querySelector("#passwordCheckInput").className.includes(' is-invalid')){
                document.querySelector("#passwordCheckInput").className = document.querySelector("#passwordCheckInput").className.replace(' is-invalid', '');
            }
        }
    }
    useEffect(passwordCheckFunc, [passwordCheck]);

    const nicknameHandler = (event) => {
        event.preventDefault();
        setNickname(event.target.value);
    }
    const ageHandler = (event) => {
        event.preventDefault();
        if(event.target.value >= 0){
            setAge(event.target.value);
        }
    }
    const ageAgreeHandler = () => {
        setAgeAgree((current)=> !current);
    }
    const genderHandler = (event) => {
        setGender(event.target.id);
    }
    const genderAgreeHandler = () => {
        setGenderAgree((current)=> !current);
    }
    const onfocusHandler = (event) => {
        event.target.select();
    }
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '' || password === '' || passwordCheck === '' || nickname === '' || age === 0 || gender === '') return;
        if(password !== passwordCheck) return;

        fetch(signUpApiUrl, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
                nickname: nickname,
                age: age,
                gender: gender,
                ageVisible: ageAgree,
                genderVisible: genderAgree,
            }),
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                if(res.message === undefined){
                    //지금은 로그인 화면으로 이동 나중에 달라질 수 있음
                    window.location.href = '/login';
                }
                else{
                    alert("제출 정보에 문제가 있습니다. 다시 한 번 확인해주십시오.");
                }
            });
    }
    return(
        <div className="container bg-light border rounded-3 shadow">
           <form onSubmit={submitHandler}>
            <fieldset className="row">
                <legend>
                    <p className="my-1 my-xxl-4 d-flex flex-column justify-content-center align-items-center fw-bold">회 원 가 입</p>
                </legend>
                <div className="col-12 my-xxl-3 my-1">
                    <input id="emailInput" className="form-control shadow-sm" type="email" placeholder="Email" value={email} onChange={emailHandler} onFocus={onfocusHandler} />
                </div>
                <div className="col-12 my-xxl-3 my-1">
                    <input id="passwordInput" className="form-control shadow-sm" type="password" placeholder="Password" value={password} onChange={passwordHandler} onFocus={onfocusHandler} />
                </div>
                <div className="col-12 my-xxl-3 my-1">
                    <input id="passwordCheckInput" className="form-control shadow-sm" type="password" placeholder="Password 확인" value={passwordCheck} onChange={passwordCheckHandler} onFocus={onfocusHandler} />
                </div>
                <div className="col-12 my-xxl-3 my-1">
                    <input id="nicknameInput" className="form-control shadow-sm" type="text" placeholder="닉네임" value={nickname} onChange={nicknameHandler} onFocus={onfocusHandler} />
                </div>

                <div className="col-6 col-xxl-4 my-xxl-3 my-1">
                    <input id="ageInput" className="form-control shadow-sm" type="number" placeholder="나이" value={age} onChange={ageHandler} onFocus={onfocusHandler} />
                </div>
                <div className="form-check col-6 col-xxl-3 my-xxl-3 my-1">
                    <input id="ageAgree" type="checkbox" className="form-check-input shadow-sm" onChange={ageAgreeHandler}/>
                    <label className="form-check-label " htmlFor="ageAgree">공개 여부</label>
                </div>
                <div className="d-xxl-none col-1" />
                <div className="form-check col-2 col-xxl-1 my-xxl-3 my-1">
                    <input id="MALE" className="form-check-input shadow-sm" type="radio" name="gender" onChange={genderHandler}/>
                    <label className="form-check-label" htmlFor="male">남</label>
                </div>
                <div className="form-check col-2 col-xxl-1 my-xxl-3 my-1">
                    <input id="FEMALE" className="form-check-input shadow-sm" type="radio" name="gender" onChange={genderHandler} />
                    <label className="form-check-label" htmlFor="female">여</label>
                </div>
                <div className="d-xxl-none col-1" />
                <div className="form-check col-6 col-xxl-3 my-xxl-3 my-1">
                    <input id="genderAgree" type="checkbox" className="form-check-input shadow-sm" onChange={genderAgreeHandler}/>
                    <label className="form-check-label" htmlFor="genderAgree">공개 여부</label>
                </div>
            </fieldset>
            <div className="row my-xxl-4 my-3 my-1">
                <div className="col-3" />
                <div className="col-3 d-flex flex-column justify-content-center align-items-center">
                    <button className="btn btn-light shadow-sm" onClick={changeContent} value="0">취소</button>
                </div>
                <div className="col-3 d-flex flex-column justify-content-center align-items-center">
                    <button type="submit" className="btn btn-dark shadow-sm">가입</button>
                </div>
                <div className="col-3" />
            </div>
           </form>
        </div>
    );
}

export default SignUp;