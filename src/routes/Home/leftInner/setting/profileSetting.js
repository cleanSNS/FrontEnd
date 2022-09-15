import {useState, useEffect} from 'react';
import Style from './profileSetting.module.css';
import Profile from '../../root/profile';
import {
    getcurrentProfileUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const ProfileSetting = () => {
    //api에 보낼 내용 + input에 반영해야하므로 useState로 선언
    const [ps_userName, setPs_UserName] = useState();
    const [ps_userAge, setPs_UserAge] = useState();
    const [ps_userAgeVisible, setPs_UserAgeVisible] = useState();
    const [ps_userGender, setPs_UserGender] = useState();
    const [ps_userGenderVisible, setPs_UserGenderVisible] = useState();
    const [ps_userIntroduce, setPs_UserIntroduce] = useState();
    //api에 보낼 내용 + 화면에 즉각적인 반응이 필요 없으므로 보낼건 next, 지금껀 cur로 선언
    let ps_curUserName;//이건 렌더링용이므로, input수정은 useState로 진행 - useState변수가 next임
    let ps_curUserImage;
    let ps_nextUserImage;

    //초기 상태 명시용 함수
    const profileSettingPreset = (event) => {
        axios.get(getcurrentProfileUrl)
        .then((res) => {
            console.log(res);
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생");
            //window.location.href = "/main";
        });
    };
    useEffect(profileSettingPreset, []);

    return(
        <div className={Style.profileSettingCover}>
            <div className={Style.Cover}>
                <div className={Style.MyprofileExample}>
                    <Profile img={"pic"} name={"myname"} />
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.profileSettingDetail}>
                    <div className={Style.Cover}>
                        <label htmlFor="profileSettingUserName" className={Style.profileSettingLabel}>사용자 이름</label>
                    </div>
                    <div className={Style.Cover}>
                        <input id="profileSettingUserName" type="text" className={Style.profileSettingInput}/>
                    </div>
                    <div />
                    <div className={Style.Cover}>
                        <label htmlFor="profileSettingAge" className={Style.profileSettingLabel}>나이</label>
                    </div>
                    <div className={Style.Cover}>
                        <input id="profileSettingAge" type="text" className={Style.profileSettingInput} />
                    </div>
                    <div className={Style.Cover}>
                        <button className={Style.smallSettingButton}>공개</button>
                    </div>
                    <div className={Style.Cover}>
                        <label htmlFor="profileSettingGender" className={Style.profileSettingLabel}>성별</label>
                    </div>
                    <div className={Style.Cover}>
                        <input id="profileSettingGender" type="text" className={Style.profileSettingInput} />
                    </div>
                    <div className={Style.Cover}>
                        <button className={Style.smallSettingButton}>공개</button>
                    </div>
                    <div className={Style.Cover}>
                        <label htmlFor="profileSettingIntroduce" className={Style.profileSettingLabel}>자기소개</label>
                    </div>
                    <div className={Style.Cover}>
                        <input id="profileSettingIntroduce" type="text" className={Style.profileSettingInput} />
                    </div>
                    <div />
                </div>
            </div>
            <div className={Style.Cover}>
                <button className={Style.submitButton}>수정</button>
            </div>
        </div>
    );
}

export default ProfileSetting;