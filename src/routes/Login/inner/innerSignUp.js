//회원가입 부분
import {useState, useEffect} from 'react';
import axios from 'axios';

const signUpApiUrl = 'http://52.78.49.137:8080/user/auth/signup';
const emailApiUrl = 'http://52.78.49.137:8080/user/auth/signup/request';
const loginApiUrl = 'http://52.78.49.137:8080/user/auth/login';

const SignUp = ({login, toLoginPage}) => {
    //변수 선언
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [nickname, setNickname] = useState("");
    const [age, setAge] = useState(0);
    const [ageAgree, setAgeAgree] = useState(false);
    const [gender, setGender] = useState("");
    const [genderAgree, setGenderAgree] = useState(false);
    const [emailAccept, setEmailAccept] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);

    //input변경 처리
    const emailHandler = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    };
    const passwordHandler = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
        setPasswordCheck("");
    };
    const passwordCheckHandler = (event) => {
        event.preventDefault();
        setPasswordCheck(event.target.value);
    };
    const nicknameHandler = (event) => {
        event.preventDefault();
        setNickname(event.target.value);
    };
    const ageHandler = (event) => {
        event.preventDefault();
        if(event.target.value >= 0){
            setAge(event.target.value);
        }
    };
    const ageAgreeHandler = () => {
        setAgeAgree((current)=> !current);
    };
    const genderHandler = (event) => {
        setGender(event.target.id);
    };
    const genderAgreeHandler = () => {
        setGenderAgree((current)=> !current);
    };

    //비밀번호 유효성 확인 함수
    function passwordValidCheck(str){
        const PWD_RULE =  /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/;
        return str.match(PWD_RULE);
    }
    //비밀번호 유효성 확인함수 실행부분
    const passwordValid = () => {
        if(passwordValidCheck(password))
            setPasswordInvalid(true);
        else{
            setPasswordInvalid(false);
        }
    }
    useEffect(passwordValid, [password]);
    //비밀번호 check확인 함수
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
    };
    useEffect(passwordCheckFunc, [passwordCheck]);

    //input재클릭 시 자동으로 전체선택 해주는 함수
    const onfocusHandler = (event) => {
        event.target.select();
    };

    //이메일 인증처리 함수
    const emailSubmitHandler = (event) => {
        event.preventDefault();
        if(email === '') return;

        axios.post(emailApiUrl, {
            email: email,
        })
            .then((res) => {
                //console.log(res);
                document.querySelector("#emailInput").disabled = true;
                setEmailAccept(true);
            })
            .catch((res)=> {
                console.log(res);
                alert("에러 발생 다시 시도해주십시오");
                document.querySelector("#emailInput").select();
            });
    };

    //회원가입 처리 함수
    const submitHandler = (event) => {
        event.preventDefault();
        if(email === '' || password === '' || passwordCheck === '' || nickname === '' || age === 0 || gender === '') return;
        if(password !== passwordCheck) return;
        if(!emailAccept) return;

        axios.post(signUpApiUrl, {
                email: email,
                password: password,
                nickname: nickname,
                age: age,
                gender: gender,
                ageVisible: ageAgree,
                genderVisible: genderAgree,
        })
        .then((res) => {
            alert("회원가입 되셨습니다.");
            //즉시 로그인 Api호출
            axios.post(loginApiUrl, {
                email: email,
                password: password,
            })
            .then((res) => {
                login(res);
                window.location.href="/main";
            })
            .catch((res) => {
                alert("문제 발생. 다시 로그인 시도해주십시오.");
                toLoginPage();//로그인화면으로 이동
            });
        })
        .catch((res) =>{
            if(res.response.status === 400){
                alert("이미 가입된 이메일입니다.");
                document.querySelector("#emailInput").disabled = false;
                setEmailAccept(false);
                document.querySelector("#emailInput").select();
            }
            else{
                console.log("error");
                console.log(res);
            }
        });
    };

    return(
        <div className="container bg-light border rounded-3 shadow">
           <form onSubmit={submitHandler}>
            <fieldset className="row">
                <legend>
                    <p className="my-1 my-xxl-4 d-flex flex-column justify-content-center align-items-center fw-bold">회 원 가 입</p>
                </legend>
                <div className="col-9 my-xxl-3 my-1">
                    <input id="emailInput" className="form-control shadow-sm" type="email" placeholder="Email" value={email} onChange={emailHandler} onFocus={onfocusHandler} />
                </div>
                <div className="col-3 my-xxl-3 my-1">
                    <button className="btn btn-light shadow-sm" onClick={emailSubmitHandler}>인증 요청</button>
                </div>
                <div className="col-12 my-xxl-3 my-1">
                    <input id="passwordInput" className="form-control shadow-sm" type="password" placeholder="Password" value={password} onChange={passwordHandler} onFocus={onfocusHandler} />
                </div>
                {
                    passwordInvalid ?
                    null :
                    <div className="col-12 my-xxl-3 my-1 d-flex flex-column justify-content-center align-items-center">
                        <p>8~16자리, 소문자와 특수문자를 하나이상 포함해야합니다.</p>
                    </div>
                }
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
                    <label className="form-check-label" htmlFor="MALE">남</label>
                </div>
                <div className="form-check col-2 col-xxl-1 my-xxl-3 my-1">
                    <input id="FEMALE" className="form-check-input shadow-sm" type="radio" name="gender" onChange={genderHandler} />
                    <label className="form-check-label" htmlFor="FEMALE">여</label>
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
                    <button className="btn btn-light shadow-sm" onClick={toLoginPage} value="0">취소</button>
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