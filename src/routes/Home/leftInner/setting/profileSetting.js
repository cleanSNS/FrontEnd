import Style from './profileSetting.module.css';
import Profile from '../../root/profile';

const ProfileSetting = () => {
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
                    <div />
                    <div className={Style.Cover}>
                        <label htmlFor="profileSettingGender" className={Style.profileSettingLabel}>성별</label>
                    </div>
                    <div className={Style.Cover}>
                        <input id="profileSettingGender" type="text" className={Style.profileSettingInput} />
                    </div>
                    <div />
                    <div className={Style.Cover}>
                        <label htmlFor="profileSettingEmail" className={Style.profileSettingLabel}>이메일</label>
                    </div>
                    <div className={Style.Cover}>
                        <input id="profileSettingEmail" type="text" className={Style.profileSettingInput} />
                    </div>
                    <div className={Style.Cover}>
                        <button className={Style.profileEmailButton}>hi</button>
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