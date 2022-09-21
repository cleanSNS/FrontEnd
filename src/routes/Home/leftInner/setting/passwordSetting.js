import Style from './passwordSetting.module.css';
import {useState, useEffect} from 'react';
import {
    passwordCheckForPasswordChangeUrl,
    passwordChangeUrl
} from '../../../../apiUrl';
import axios from 'axios';

const PasswordSetting = ({refreshAccessToken}) => {
    //useState 선언
    const [previousPassword, setPreviousPassword] = useState("");
    const [passwordChange, setPasswordChange] = useState("");
    const [passwordChangeCheck, setPasswordChangeCheck] = useState("");
    const [passwordCondition, setPasswordCondition] = useState(false);//조건 확인

    //비밀번호 변경 함수
    const previousPasswordChangeHandler = (event) => {
        event.preventDefault();
        setPreviousPassword(event.target.value);
    };
    const passwordChangeChangeHandler = (event) => {
        event.preventDefault();
        setPasswordChange(event.target.value);
        setPasswordChangeCheck("");
    };
    const passwordChangeCheckChangeHandler = (event) => {
        event.preventDefault();
        setPasswordChangeCheck(event.target.value);
    };

    //submit handler
    const submitHandler = (event) => {
        event.preventDefault();
        if(previousPassword === passwordChange){
            alert("바꾸려는 비밀번호가 동일합니다.");
            return;
        }
        if(!passwordCondition){
            alert("새 비밀번호가 비밀번호 조건에 맞지 않습니다.");
            return;
        }
        if(passwordChange !== passwordChangeCheck){
            alert("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        axios.post(passwordCheckForPasswordChangeUrl,{
            password: previousPassword,
        })
        .then((res) => {
            axios.post(passwordChangeUrl,{
                password: passwordChange,
            })
            .then((res) => {
                alert("비밀번호가 변경되었습니다.");
                //window.location.href = '/main';
            })
            .catch((res) => {
                if(res.status === 401){//access token이 만료된 경우이다.
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("에러 발생");
                    //window.location.href = '/main';
                }
            })
        })
        .catch((res) => {
            if(res.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                alert("기존 비밀번호가 틀립니다.");
            }
        })
    };

    //비밀번호 동일한지 확인해서 style바꿔주는 함수
    const passwordCheckSameCheck = () => {
        if(passwordChangeCheck === ""){//비어있으면 빨간 선을 없앤다.
            document.querySelector("#passwordChangeCheck").style.outline = "solid 1px rgb(186, 186, 186)";
            return;
        }
        if(passwordChangeCheck !== passwordChange){
            document.querySelector("#passwordChangeCheck").style.outline = "solid 2px rgb(218, 86, 86)";
        }
        else{
            document.querySelector("#passwordChangeCheck").style.outline = "solid 1px rgb(186, 186, 186)";
        }
    };
    useEffect(passwordCheckSameCheck, [passwordChangeCheck]);


    //비밀번호 조건확인
    function passwordValidCheck(str){
        const PWD_RULE =  /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/;
        return str.match(PWD_RULE);
    };

    //비밀번호 조건확인하는 함수 함수
    const passwordValid = () => {
        setPasswordCondition(passwordValidCheck(passwordChange));
    };
    useEffect(passwordValid, [passwordChange]);

    return(
        <form className={Style.WholeCover} onSubmit={submitHandler}>
            <div className={Style.Cover}>
                <div className={Style.formArea}>
                    {/* 현재 비밀번호 */}
                    <div className={Style.Cover}>
                        <label
                            htmlFor="prevPW"
                            className={Style.settingLabel}>
                            이전 비밀번호
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input 
                            id="prevPW"
                            type="password"
                            value={previousPassword}
                            onChange={previousPasswordChangeHandler}
                            className={Style.settingInput}
                        />
                    </div>
                    {/* 새 비밀번호 */}
                    <div className={Style.Cover}>
                        <label
                            htmlFor='passwordChange'
                            className={Style.settingLabel}>
                            새 비밀번호
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="passwordChange"
                            type="password"
                            value={passwordChange}
                            onChange={passwordChangeChangeHandler}
                            className={Style.settingInput}
                        />
                    </div>
                    {/* 새 비밀번호 확인 */}
                    <div className={Style.Cover}>
                        <label
                            htmlFor='passwordChangeCheck'
                            className={Style.settingLabel}>
                            새 비밀번호 확인
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="passwordChangeCheck"
                            type="password"
                            value={passwordChangeCheck}
                            onChange={passwordChangeCheckChangeHandler}
                            className={Style.settingInput}
                        />
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                {passwordCondition ? null : <p className={Style.alertWord}>비밀번호는 8~16자리, 소문자, 특수문자를 하나이상 포함.</p>}
            </div>
            <div className={Style.Cover}>
                <button type="submit" className={Style.submitButton}>수정</button>
            </div>
        </form>
    );
}

export default PasswordSetting;