import Style from './withdrawalSetting.module.css';
import {useState} from 'react';
import {
    withdrawalUrl
} from '../../../../apiUrl';
import axios from 'axios';

const WithdrawalSetting = ({refreshAccessToken, logout}) => {
    const [userPasswordInput, setUserPasswordInput] = useState("");

    const userPasswordInputChangeHandler = (event) => {
        setUserPasswordInput(event.target.value);
    };

    const withdrawalSubmitHandler = (event) => {
        event.preventDefault();
        if(userPasswordInput === "") {
            alert("비밀번호를 입력해 주세요");
            return;
        }

        axios.post(withdrawalUrl, {
            password: userPasswordInput
        })
        .then((res) => {
            alert("회원탈퇴에 성공하였습니다. 감사합니다.");
            logout();//로그 아웃까지
        })
        .catch((res) => {
            if(res.response.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else if(res.response.statue === 400){
                alert("잘못된 비밀번호입니다.");
                setUserPasswordInput("");//비밀번호 초기화
            }
            else{
                alert("예상치 못한 오류입니다.");
            }
        })
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