import Style from './withdrawalSetting.module.css';
import {useState} from 'react';
import {
    withdrawalUrl
} from '../../../../apiUrl';
import axios from 'axios';

const WithdrawalSetting = ({refreshAccessToken}) => {
    const [userPasswordInput, setUserPasswordInput] = useState("");

    const userPasswordInputChangeHandler = (event) => {
        setUserPasswordInput(event.target.value);
    };

    const withdrawalSubmitHandler = (event) => {
        event.preventDefault();

        axios.post(withdrawalUrl)
        .then((res) => {

        })
        .catch((res) => {
            if(res.response.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                alert("잘못된 비밀번호입니다.");
            }
        })
    };

    return(
        <form className={Style.WholeCover} onSubmit={withdrawalSubmitHandler}>
            <div className={Style.Cover}>
                <input 
                    type="password"
                    placeholder='회원 탈퇴를 위해 비밀번호를 입력해 주세요'
                    value={userPasswordInput}
                    onChange={userPasswordInputChangeHandler}
                    className={Style.settingInput}
                />
            </div>
            <div className={Style.Cover}>
                <button type='submit' className={Style.submitButton}>제출</button>
            </div>
        </form>
    )
};

export default WithdrawalSetting;