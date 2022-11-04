import Style from './withdrawalSetting.module.css';
import {useState} from 'react';
import {
    withdrawalUrl,
    passwordCheck
} from '../../../../apiUrl';
import { postAxios } from '../../../../apiCall';

const WithdrawalSetting = ({refreshAccessToken, logout}) => {
    const [userPasswordInput, setUserPasswordInput] = useState("");

    const userPasswordInputChangeHandler = (event) => {
        setUserPasswordInput(event.target.value);
    };

    const withdrawalSubmitHandler = async (event) => {
        event.preventDefault();
        if(userPasswordInput === "") {
            alert("비밀번호를 입력해 주세요");
            return;
        }

        const sendBody = {
            password: userPasswordInput,
        };
        const res = await postAxios(passwordCheck, sendBody, {}, refreshAccessToken);
        if(res.data){//일치하면
            await postAxios(withdrawalUrl, {}, {}, refreshAccessToken);
            alert("회원 탈퇴되셨습니다. 이용해 주셔서 감사합니다.");
            logout();
        }
        else{
            alert("기존 비밀번호가 일치하지 않습니다.");
            setUserPasswordInput("");
        }
    };

    return(
        <form className={Style.WholeCover} onSubmit={withdrawalSubmitHandler}>
            <div className={Style.Cover}>
                <div className={Style.passwordCover}>
                    <div className={Style.Cover}>
                        <label className={Style.settingLabel} htmlFor="userPassword">
                            비밀번호
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="userPassword"
                            type="password"
                            placeholder='소셜 가입 회원의 경우 연동된 이메일을 입력해 주세요'
                            value={userPasswordInput}
                            onChange={userPasswordInputChangeHandler}
                            className={Style.settingInput}
                        />
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <button type='submit' className={Style.submitButton}>제출</button>
            </div>
        </form>
    )
};

export default WithdrawalSetting;