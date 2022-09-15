import {useState, useEffect} from 'react';
import Style from './profileSetting.module.css';
import nullImage from '../../root/anonymous.png';
import {
    getcurrentProfileUrl,
    submitProfileSettingUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const ProfileSetting = () => {
    //api에 보낼 내용 + input에 반영해야하므로 useState로 선언
    const [ps_userImage, setPs_UserImage] = useState();
    const [ps_userName, setPs_UserName] = useState();
    const [ps_userAge, setPs_UserAge] = useState();
    const [ps_userAgeVisible, setPs_UserAgeVisible] = useState();
    const [ps_userGender, setPs_userGender] = useState();
    const [ps_userGenderVisible, setPs_UserGenderVisible] = useState();
    const [ps_userIntroduce, setPs_UserIntroduce] = useState();

    //초기 상태 명시용 함수
    const profileSettingPreset = () => {
        axios.get(getcurrentProfileUrl)
        .then((res) => {
            console.log(res.data.data);
            setPs_UserImage(res.data.data.imgUrl);//프로필 이미지 설정 없으면 null
            setPs_UserName(res.data.data.nickname);//이름 설정 - api upload
            setPs_UserAge(res.data.data.age);//나이 설정

            setPs_UserAgeVisible(res.data.data.ageVisible);//나이 공개
            if(ps_userAgeVisible){//나이가 공개로 되어있는 경우
                document.querySelector("#ageVisibleBtn").style.backgroundColor = "rgb(160, 160, 160)";
            }
            else{//나이가 비공개로 되어있는 경우
                document.querySelector("#ageVisibleBtn").style.backgroundColor = "rgb(209, 209, 209)";
            }

            if(res.data.data.gender === "MALE"){//성별 설정
                setPs_userGender(res.data.data.gender);
            }
            else{
                setPs_userGender(res.data.data.gender);
            }

            setPs_UserGenderVisible(res.data.data.genderVisible);//성별 공개
            if(ps_userGenderVisible){//성별이 공개로 되어있는 경우
                document.querySelector("#genderVisibleBtn").style.backgroundColor = "rgb(160, 160, 160)";
            }
            else{//나이가 비공개로 되어있는 경우
                document.querySelector("#genderVisibleBtn").style.backgroundColor = "rgb(209, 209, 209)";
            }

            if(res.data.data.selfIntroduction === null){//자기소개 설정
                setPs_UserIntroduce("");
            }
            else{
                setPs_UserIntroduce(res.data.data.selfIntroduction);
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
        axios.post(submitProfileSettingUrl,{
            nickname: ps_userName,
            age: ps_userAge,
            gender: ps_userGender,
            ageVisible: ps_userAgeVisible,
            genderVisible:ps_userGenderVisible,
            imgUrl: ps_userImage,
            selfIntroduction: ps_userIntroduce,
        })
        .then((res) => {
            console.log(res);
            alert("설정을 변경했습니다.");
            //window.location.href = "/main";
        })
        .catch((res) => {
            console.log(res);
            alert("문제가 발생했습니다.")
        })
    }

    //이미지 변경 함수 - ps_nextUserImage를 바꾼다.
    const profileImageChangeHandler = (event) => {
        event.preventDefault();
        console.log(event.target.files[0])
        const inputImage = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(inputImage);
        reader.onload = (imageData) => {
            setPs_UserImage(imageData.target.result);
        }
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
    const noChange = (event) => {
        event.preventDefault();
    }
    
    //공개여부 변경 함수
    const ageVisibleChangeHandler = (event) => {
        event.preventDefault();
        if(ps_userAgeVisible){//공개로 되어있는데 비공개를 하기 위해 누른 경우
            document.querySelector("#ageVisibleBtn").style.backgroundColor = "rgb(209, 209, 209)";
        }
        else{//비공개인데 공개를 하기 위해 누른 경우
            document.querySelector("#ageVisibleBtn").style.backgroundColor = "rgb(160, 160, 160)";
        }
        setPs_UserAgeVisible((cur) => !cur);
    };

    const genderVisibleChangeHandler = (event) => {
        event.preventDefault();
        if(ps_userGenderVisible){//공개로 되어있는데 비공개를 하기 위해 누른 경우
            document.querySelector("#genderVisibleBtn").style.backgroundColor = "rgb(209, 209, 209)";
        }
        else{//비공개인데 공개를 하기 위해 누른 경우
            document.querySelector("#genderVisibleBtn").style.backgroundColor = "rgb(160, 160, 160)";
        }
        setPs_UserGenderVisible((cur) => !cur);
    };


    return(
        <form className={Style.profileSettingCover} onSubmit={profileSettingSubmitHandler}>
            <div className={Style.Cover}>
                <div className={Style.MyprofileExample}>
                    <div className={Style.Cover}>
                        <label
                            htmlFor='UserProfileImage'>
                            {
                                (ps_userImage === undefined || ps_userImage === null)
                                ? 
                                <img src={nullImage} className={Style.myprofileImage}/>
                                :
                                <img src={ps_userImage} className={Style.myprofileImage}/>
                            }
                        </label>
                        <input 
                            type="file"
                            onChange={profileImageChangeHandler}
                            className={Style.myprofileImageInput}
                            id="UserProfileImage"
                            accept="image/*"
                        />
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.myprofileNickname}>{ps_userName}</div>
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
                            id="ageVisibleBtn"
                            onClick={ageVisibleChangeHandler}>
                            공개
                        </button>
                    </div>
                    {/* 성별 */}
                    <div className={Style.Cover}>
                        <label 
                            className={Style.profileSettingLabel}>
                            성별
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input
                            id="profileSettingGender"
                            type="text"
                            onChange={noChange}
                            value={ps_userGender}
                            className={Style.profileSettingInput}
                        />
                    </div>
                    <div className={Style.Cover}>
                        <button 
                            className={Style.smallSettingButton}
                            type="button"
                            id="genderVisibleBtn"
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