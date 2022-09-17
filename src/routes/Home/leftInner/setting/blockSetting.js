import Style from './blockSetting.module.css';
import { useState } from 'react';

const UserArea = ({}) => {//색상 및 버튼의 형태 지정해야하는 형태로 제작
    return(
        <div className={Style.searchedUserListArea}>

        </div>
    );
}

const BlockSetting = () => {
    const [userInput, setUserInput] = useState("");

    const userInputChangeHandler = (event) => {
        event.preventDefault();
        setUserInput(event.target.value);
    }

    return(
        <div className={Style.searchAndAddArea}>
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
                
            </div>
            <div className={Style.Cover}>
                
            </div>
        </div>
    );
}

export default BlockSetting;