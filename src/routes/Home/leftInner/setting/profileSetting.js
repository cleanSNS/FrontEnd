import {useState, useEffect} from 'react';
import Style from './profileSetting.module.css';
import nullImage from '../../root/anonymous.png';
import {
    getcurrentProfileUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const ProfileSetting = () => {
    //api에 보낼 내용 + input에 반영해야하므로 useState로 선언
    const [ps_userImage, setPs_UserImage] = useState();
    const [ps_userName, setPs_UserName] = useState();
    const [ps_userAge, setPs_UserAge] = useState();
    const [ps_userAgeVisible, setPs_UserAgeVisible] = useState();
    const [ps_userGender, setPs_UserGender] = useState();
    const [ps_userGenderVisible, setPs_UserGenderVisible] = useState();
    const [ps_userIntroduce, setPs_UserIntroduce] = useState();
    //api에 보낼 내용 + 화면에 즉각적인 반응이 필요 없으므로 보낼건 next, 지금껀 cur로 선언
    let ps_curUserName;//이건 초기 렌더링용이므로, input수정은 useState로 진행 - useState변수가 next임

    //초기 상태 명시용 함수
    const profileSettingPreset = () => {
        axios.get(getcurrentProfileUrl)
        .then((res) => {
            console.log(res.data);//확인용 : 나중에 지워도 됨
            setPs_UserImage(res.data.imgUrl);//프로필 이미지 설정 없으면 null
            ps_curUserName = res.data.nickname;//이름 설정 - render
            setPs_UserName(res.data.nickname);//이름 설정 - api upload
            setPs_UserAge(res.data.age);//나이 설정
            setPs_UserAgeVisible(res.data.ageVisible);//나이 공개
            if(res.data.gender === "MALE"){//성별 설정
                setPs_UserGender("남");
            }
            else{
                setPs_UserGender("여");
            }
            setPs_UserGenderVisible(res.data.genderVisible);//성별 공개
            if(res.data.selfIntroduction === null){//자기소개 설정
                setPs_UserIntroduce("");
            }
            else{
                setPs_UserIntroduce(res.data.selfIntroduction);
            }
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생");
            //window.location.href = "/main";
        });
    };
    useEffect(profileSettingPreset, []);

    //submit함수
    const profileSettingSubmitHandler = (event) => {//작성필요
        event.preventDefault();

    }

    //이미지 변경 함수 - ps_nextUserImage를 바꾼다.
    const profileImageChangeHandler = (event) => {//작성필요
        event.preventDefault();
    };

    //값 변경 함수
    const nicknameChageHandler = (event) => {
        event.preventDefault();
        setPs_UserName(event.target.value);
    };
    const ageChageHandler = (event) => {
        event.preventDefault();
        setPs_UserAge(event.target.value);
    };
    const selfIntroductionChageHandler = (event) => {
        event.preventDefault();
        setPs_UserIntroduce(event.target.value);
    };
    
    //공개여부 변경 함수
    const ageVisibleChangeHandler = (event) => {//작성필요
        event.preventDefault();
    };
    const genderVisibleChangeHandler = (event) => {//작성필요
        event.preventDefault();
    };


    return(
        <form className={Style.profileSettingCover} onSubmit={profileSettingSubmitHandler}>
            <div className={Style.Cover}>
                <div className={Style.MyprofileExample}>
                    <div className={Style.Cover}>
                        <label
                            htmlFor='UserProfileImage'
                            onClick={profileImageChangeHandler} 
                            className={Style.myprofileImage}>
                            {ps_userImage === null ? <img scr={nullImage} /> : <img src={ps_userImage} /> }
                        </label>
                        <input 
                            type="file"
                            id="UserProfileImage"
                            accept="image/*"
                        />
                    </div>
                    <div className={Style.Cover}>
                        <p className={Style.myprofileNickname}>{ps_curUserName}</p>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.profileSettingDetail}>
                    {/* 닉네임 */}
                    <div className={Style.Cover}>
                        <label 
                            htmlFor="profileSettingUserName"
                            className={Style.profileSettingLabel}>
                            사용자 이름
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input 
                            id="profileSettingUserName"
                            type="text"
                            value={ps_userName}
                            onChange={nicknameChageHandler}
                            className={Style.profileSettingInput}
                        />
                    </div>
                    <div />
                    {/* 나이 */}
                    <div className={Style.Cover}>
                        <label 
                            htmlFor="profileSettingAge"
                            className={Style.profileSettingLabel}>
                            나이
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="profileSettingAge"
                            type="text"
                            value={ps_userAge}
                            onChange={ageChageHandler}
                            className={Style.profileSettingInput}
                        />
                    </div>
                    <div className={Style.Cover}>
                        <button
                            className={Style.smallSettingButton}
                            type="button"
                            onClick={ageVisibleChangeHandler}>
                            공개
                        </button>
                    </div>
                    {/* 성별 */}
                    <div className={Style.Cover}>
                        <label 
                            htmlFor="profileSettingGender"
                            className={Style.profileSettingLabel}>
                            성별
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="profileSettingGender"
                            type="text"
                            disabled
                            value={ps_userGender}
                            className={Style.profileSettingInput} />
                    </div>
                    <div className={Style.Cover}>
                        <button 
                            className={Style.smallSettingButton}
                            type="button"
                            onClick={genderVisibleChangeHandler}>
                            공개
                        </button>
                    </div>
                    {/* 자기소개 */}
                    <div className={Style.Cover}>
                        <label
                            htmlFor="profileSettingIntroduce"
                            className={Style.profileSettingLabel}>
                            자기소개
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input 
                            id="profileSettingIntroduce"
                            type="text"
                            value={ps_userIntroduce}
                            onChange={selfIntroductionChageHandler}
                            className={Style.profileSettingInput} />
                    </div>
                    <div />
                </div>
            </div>
            <div className={Style.Cover}>
                <button 
                    className={Style.submitButton}
                    type="submit">
                    수정
                </button>
            </div>
        </form>
    );
}

export default ProfileSetting;