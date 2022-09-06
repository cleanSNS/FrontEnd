//회원가입 부분
import {useState, useEffect} from 'react';
import axios from 'axios';
import Style from './innerSignUp.module.css';
import {
    signUpApiUrl,
    emailApiUrl,
    loginApiUrl
} from "../../../apiUrl";

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
        if(passwordValidCheck(password)){
            setPasswordInvalid(true);
            document.querySelector("#validPasswordColorWord").style.color = "rgb(102, 181, 255)";
        }
        else{
            setPasswordInvalid(false);
            document.querySelector("#validPasswordColorWord").style.color = "rgb(255, 102, 102)";
        }
    }
    useEffect(passwordValid, [password]);

    //비밀번호 check확인 함수
    const passwordCheckFunc = () => {
        if(password !== passwordCheck){
            document.querySelector("#passwordCheckInput").style.border = "solid 2px rgb(255, 102, 102)";
        }
        else{
            document.querySelector("#passwordCheckInput").style.border = "solid 1px rgb(186, 186, 186)";
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
        if(email === '') {
            alert("이메일을 입력해 주세요");
            return;
        }
        if(!email.includes("@") || !email.includes(".")){
            alert("올바른 이메일을 입력해 주세요");
            return;
        }

        axios.post(emailApiUrl, {
            email: email,
        })
            .then((res) => {
                console.log(res);
                alert("인증 메일을 보냈습니다.");
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
        if(email === '' || password === '' || passwordCheck === '' || nickname === '' || age === 0 || gender === ''){
            alert("정보를 모두 입력해 주십시오.")
            return;
        }
        if(password !== passwordCheck) {
            alert("비밀번호를 다시 확인해 주십시오.");
            return;
        }
        if(!emailAccept) {
            alert("이메일 인증을 먼저 해주십시오.");
            return;
        }
        if(!passwordInvalid) { 
            alert("비밀번호의 조건을 맞춰주십시오.");
            return;
        }

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
        <div className={Style.SignUpCover} onSubmit={submitHandler}>
            {/* 이메일 Label */}
            <div className={Style.Cover}>
                <label 
                    className={Style.formLabel}
                    htmlFor="emailInput">
                    Email
                </label>
            </div>
            {/* 이메일 Input */}
            <div className={Style.Cover}>
                <div className={Style.splitInput}>
                    <div className={Style.Cover}>
                        <input 
                            id="emailInput"
                            type="email"
                            className={Style.formInput}
                            value={email}
                            onChange={emailHandler}
                            onFocus={onfocusHandler}
                        />
                    </div>
                    <div className={Style.Cover}>
                        <button
                            className={Style.emailButton}
                            onClick={emailSubmitHandler}>
                            인증
                        </button>
                    </div>
                </div>
            </div>
            {/* 비밀번호 Label */}
            <div className={Style.Cover}>
                <label 
                    className={Style.formLabel}
                    htmlFor="passwordInput">
                    Password  
                </label>
                <p id="validPasswordColorWord" className={Style.smallAlertWord}>  (8~16자리, 소문자, 특수문자를 하나이상 포함.)</p>
            </div>
            {/* 비밀번호 Input */}
            <div className={Style.Cover}>
                <input
                    id="passwordInput"
                    type="password"
                    className={Style.formInput}
                    value={password}
                    onChange={passwordHandler}
                    onFocus={onfocusHandler}
                />
            </div>
            {/* 비밀번호 확인 Label */}
            <div className={Style.Cover}>
                <label 
                    className={Style.formLabel}
                    htmlFor="passwordCheckInput">
                    Password 확인
                </label>
            </div>
            {/* 비밀번호 확인 Input */}
            <div className={Style.Cover}>
                <input
                    id="passwordCheckInput"
                    type="password"
                    className={Style.formInput}
                    value={passwordCheck}
                    onChange={passwordCheckHandler}
                    onFocus={onfocusHandler}
                />
            </div>
            {/* 닉네임 Label */}
            <div className={Style.Cover}>
                <label 
                    className={Style.formLabel}
                    htmlFor="nicknameInput">
                    Nickname
                </label>
            </div>
            {/* 닉네임 Input */}
            <div className={Style.Cover}>
                <input
                    id="nicknameInput"
                    type="text"
                    className={Style.formInput}
                    value={nickname}
                    onChange={nicknameHandler}
                    onFocus={onfocusHandler}
                />
            </div>
            {/* 나이 Label */}
            <div className={Style.Cover}>
                <label 
                    className={Style.formLabel}
                    htmlFor="ageInput">
                    나이
                </label>
                <p className={Style.smallCommentWord}> 해당 정보를 공개하려면 체크해주세요.</p>
            </div>
            {/* 나이 Input */}
            <div className={Style.Cover}>
                <div className={Style.splitInput}>
                    <div className={Style.Cover}>
                        <input
                            id="ageInput"
                            type="number"
                            className={Style.formInput}
                            value={age}
                            onChange={ageHandler}
                            onFocus={onfocusHandler}
                        />
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="ageAgree"
                            type="checkbox"
                            className={Style.agreeInput}
                            onChange={ageAgreeHandler}
                        />
                    </div>
                </div>
            </div>
            {/* 성별 Label */}
            <div className={Style.Cover}>
                <label 
                    className={Style.formLabel}>
                    성별
                </label>
                <p className={Style.smallCommentWord}> 해당 정보를 공개하려면 체크해주세요.</p>
            </div>
            {/* 성별 Input */}
            <div className={Style.Cover}>
                <div className={Style.splitInput}>
                    <div className={Style.Cover}>
                        <div className={Style.genderInputArea}>
                            <div className={Style.Cover}>
                                <input
                                    id="MALE"
                                    type="radio"
                                    name="gender"
                                    className={Style.genderInput}
                                    onChange={genderHandler}
                                />
                            </div>
                            <div className={Style.Cover}>
                                <label htmlFor="MALE" className={Style.genderLabel}>남</label>
                            </div>
                            <div className={Style.Cover}>
                                <input
                                    id="FEMALE"
                                    type="radio"
                                    name="gender"
                                    className={Style.genderInput}
                                    onChange={genderHandler}
                                />
                            </div>
                            <div className={Style.Cover}>
                                <label htmlFor="FEMALE" className={Style.genderLabel}>여</label>
                            </div>
                            <div />
                        </div>
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="genderAgree"
                            type="checkbox"
                            className={Style.agreeInput}
                            onChange={genderAgreeHandler}
                        />
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.btnArea}>
                    <div />
                    <div className={Style.Cover}>
                        <button 
                            onClick={toLoginPage}
                            type="button"
                            className={Style.cancelBtn}
                            value="0">
                            취 소
                        </button>
                    </div>
                    <div className={Style.Cover}>
                        <button
                            type="submit"
                            className={Style.submitBtn}>
                            가 입
                        </button>
                    </div>
                    <div />
                </div>
            </div>
        </div>
    );
}

export default SignUp;