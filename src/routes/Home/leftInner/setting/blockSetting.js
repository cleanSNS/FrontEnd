import Style from './blockSetting.module.css';
import { useState, useEffect } from 'react';
import {
    getCurrentBlockedPersonUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const BlockSetting = () => {
    const [userInput, setUserInput] = useState("");
    const [searchedUserList, setSearchedUserList] = useState([]);//검색된 사람들
    const [AddedUserList, setAddedUserList] = useState([]);//차단된 사람들

    //처음에 차단된 유저들의 리스트를 먼저 가져와야한다.
    const blockSettingInitialSetting = () => {
        axios.get(getCurrentBlockedPersonUrl)
        .then((res) => {
            console.log(res.data.data);
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생")
        })
    };
    useEffect(blockSettingInitialSetting, []);

    const userInputChangeHandler = (event) => {
        event.preventDefault();
        setUserInput(event.target.value);
    };

    const searchHandler = (event) => {
        event.preventDefault();
    };

    return(
        <form className={Style.searchAndAddArea} onSubmit={searchHandler}>
                <div className={Style.Cover}>
                    <label
                        className={Style.searchLabel}
                        htmlFor="userIdInput">
                        차단할 사용자 추가
                    </label>
                </div>
                <div className={Style.Cover}>
                    <input 
                        id="userIdInput"
                        placeholder='닉네임을 입력하세요'
                        className={Style.searchInput}
                        value={userInput}
                        onChange={userInputChangeHandler}
                    />
                </div>
            <div className={Style.Cover}>
                <div className={Style.searchedUserListArea}>

                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.searchedUserListArea}>

                </div>
            </div>
        </form>
    );
}

export default BlockSetting;