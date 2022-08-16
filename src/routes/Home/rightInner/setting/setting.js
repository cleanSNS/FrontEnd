import Style from './setting.module.css';

//settingState로 가능한 것들 profile // Snotice // password // filtering // block 반드시 핸들러로 값 변경
const Setting = ({settingState, SettingChangeHandler}) => {
    const settingClickHandler = (event) => {
        if(event.target.id === settingState) return;
        document.querySelector("#" + event.target.id).style.backgroundColor = "rgb(230, 230, 230)";
        if(settingState !== "initial"){
            document.querySelector("#" + settingState).style.backgroundColor = "white";
        }
        SettingChangeHandler(event.target.id);
    };
    return(
        <div className={Style.settingList}>
            <div className={Style.firstSettingCover} id="profile" onClick={settingClickHandler}>
                <div className={Style.setting} id="profile" onClick={settingClickHandler}>프로필 편집</div>
            </div>
            <div className={Style.settingCover} id="Snotice" onClick={settingClickHandler}>
                <p className={Style.setting} id="Snotice" onClick={settingClickHandler}>푸쉬 알림</p>
            </div>
            <div className={Style.settingCover} id="password" onClick={settingClickHandler}>
                <p className={Style.setting} id="password" onClick={settingClickHandler}>비밀번호 변경</p>
            </div>
            <div className={Style.settingCover} id="filtering" onClick={settingClickHandler}>
                <p className={Style.setting} id="filtering" onClick={settingClickHandler}>필터링 설정</p>
            </div>
            <div className={Style.lastSettingCover} id="block" onClick={settingClickHandler}>
                <p className={Style.setting} id="block" onClick={settingClickHandler}>차단 목록</p>
            </div>
        </div>
    );
}

const RightSetting = ({settingState, SettingChangeHandler, logout}) => {
    return(
        <div className={Style.wholeCover}>
            <div className={Style.settingListCover}>
                <Setting settingState={settingState} SettingChangeHandler={SettingChangeHandler} />
            </div>
            <div className={Style.btnCover}>
                <button className={Style.logoutbtn} onClick={logout}>로그아웃</button>
            </div>
        </div>
    );
}

export default RightSetting