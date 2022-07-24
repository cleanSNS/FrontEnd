//회원가입 부분
import {useState, useEffect} from 'react';

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
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '' || password === '' || passwordCheck === '' || nickname === '' || age === 0 || gender === '') return
        if(password !== passwordCheck) return

        let signUpInfo = {
            email: email,
            password: password,
            nickname: nickname,
            age: age,
            ageagree: ageAgree,
            gender: gender,
            genderagree: genderAgree,
        };

        window.location.href = '/home';//구현만 이렇게 해놓음 나중에는 아래껄로 해야함

//        fetch('...', signUpInfo)
//            .then((response) => response.json())
//            .then((res) => {
//                console.log(res);
//                res.message === '...' ? alert("이미 가입된 아이디입니다.") : window.locatin.href='/home';
//            });
    }

    const onfocusHandler = (event) => {
        event.target.select();
    }
    return(
        <div className="container bg-light border rounded-3 shadow">
           <form onSubmit={submitHandler}>
            <fieldset className="row">
                <legend>
                    <p className="my-1 my-xxl-4 d-flex flex-column justify-content-center align-items-center fw-bold">회 원 가 입</p>
                </legend>
                <div className="col-12 my-xxl-3">
                    <input id="emailInput" className="form-control shadow-sm" type="email" placeholder="Email" value={email} onChange={emailHandler} onFocus={onfocusHandler} />
                </div>
                <div className="col-12 my-xxl-3">
                    <input id="passwordInput" className="form-control shadow-sm" type="password" placeholder="Password" value={password} onChange={passwordHandler} onFocus={onfocusHandler} />
                </div>
                <div className="col-12 my-xxl-3">
                    <input id="passwordCheckInput" className="form-control shadow-sm" type="password" placeholder="Password 확인" value={passwordCheck} onChange={passwordCheckHandler} onFocus={onfocusHandler} />
                </div>
                <div className="col-12 my-xxl-3">
                    <input id="nicknameInput" className="form-control shadow-sm" type="text" placeholder="닉네임" value={nickname} onChange={nicknameHandler} onFocus={onfocusHandler} />
                </div>

                <div className="col-6 col-xxl-4 my-xxl-3">
                    <input id="ageInput" className="form-control shadow-sm" type="number" placeholder="나이" value={age} onChange={ageHandler} onFocus={onfocusHandler} />
                </div>
                <div className="form-check col-6 col-xxl-3 my-xxl-3">
                    <input id="ageAgree" type="checkbox" className="form-check-input shadow-sm" onChange={ageAgreeHandler}/>
                    <label className="form-check-label" htmlFor="ageAgree">공개 여부</label>
                </div>
                <div className="d-xxl-none col-1" />
                <div className="form-check col-2 col-xxl-1 my-xxl-3">
                    <input id="male" className="form-check-input shadow-sm" type="radio" name="gender" onChange={genderHandler}/>
                    <label className="form-check-label" htmlFor="male">남</label>
                </div>
                <div className="form-check col-2 col-xxl-1 my-xxl-3">
                    <input id="female" className="form-check-input shadow-sm" type="radio" name="gender" onChange={genderHandler} />
                    <label className="form-check-label" htmlFor="female">여</label>
                </div>
                <div className="d-xxl-none col-1" />
                <div className="form-check col-6 col-xxl-3 my-xxl-3">
                    <input id="genderAgree" type="checkbox" className="form-check-input shadow-sm" onChange={genderAgreeHandler}/>
                    <label className="form-check-label" htmlFor="genderAgree">공개 여부</label>
                </div>
            </fieldset>
            <div className="row my-xxl-4 my-3">
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