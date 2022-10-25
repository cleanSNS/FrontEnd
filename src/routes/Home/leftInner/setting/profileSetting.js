import {useState, useEffect} from 'react';
import Style from './profileSetting.module.css';
import {
    getcurrentProfileUrl,
    submitProfileSettingUrl,
    uploadImageUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const ProfileSetting = ({refreshAccessToken}) => {
    //api에 보낼 내용 + input에 반영해야하므로 useState로 선언
    const [ps_userImage, setPs_UserImage] = useState(null);//백엔드에서 받아온 기존의 이미지 정보
    const [ps_userImageSend, setPs_userImageSend] = useState(null);//유저가 변경한 이미지의 파일 정보
    const [ps_userName, setPs_UserName] = useState("");//유저의 닉네임
    const [ps_userAge, setPs_UserAge] = useState("");//유저의 나이
    const [ps_userAgeVisible, setPs_UserAgeVisible] = useState("");//유저의 나이 공개 여부
    const [ps_userGender, setPs_userGender] = useState("");//유저의 성별
    const [ps_userGenderVisible, setPs_UserGenderVisible] = useState("");//유저의 성별 공개 여부
    const [ps_userIntroduce, setPs_UserIntroduce] = useState("");//유저의 자기 소개

    //공개 여부 인지 후 색상 변경 함수
    const ageVisibleBtnChangeHandler = (event) => {
        if(ps_userAgeVisible){//나이가 공개로 되어있는 경우
            document.querySelector("#ageVisibleBtn").style.backgroundColor = "rgb(160, 160, 160)";
        }
        else{//나이가 비공개로 되어있는 경우
            document.querySelector("#ageVisibleBtn").style.backgroundColor = "rgb(209, 209, 209)";
        }
    };
    useEffect(ageVisibleBtnChangeHandler, [ps_userAgeVisible]);

    const genderVisibleBtnChangeHandler = (event) => {
        if(ps_userGenderVisible){//성별이 공개로 되어있는 경우
            document.querySelector("#genderVisibleBtn").style.backgroundColor = "rgb(160, 160, 160)";
        }
        else{//나이가 비공개로 되어있는 경우
            document.querySelector("#genderVisibleBtn").style.backgroundColor = "rgb(209, 209, 209)";
        }
    };
    useEffect(genderVisibleBtnChangeHandler, [ps_userGenderVisible]);

    //초기 상태 명시용 함수
    const profileSettingPreset = () => {
        axios.get(getcurrentProfileUrl)
        .then((res) => {
            setPs_UserImage(res.data.data.imgUrl);//url이 string의 형태로 들어온다.
            setPs_UserName(res.data.data.nickname);//이름 설정 - api upload
            setPs_UserAge(res.data.data.age);//나이 설정
            setPs_UserAgeVisible(res.data.data.ageVisible);//나이 공개
            setPs_userGender(res.data.data.gender);//성별 설정
            setPs_UserGenderVisible(res.data.data.genderVisible);//성별 공개
            if(res.data.data.selfIntroduction === null){//자기소개 설정<--------------------------------채민이 말에 따라 변경 가능
                setPs_UserIntroduce("");
            }
            else{
                setPs_UserIntroduce(res.data.data.selfIntroduction);
            }
        })
        .catch((res) => {
            if(res.response.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("프로필 설정 상태를 불러오지 못했습니다.");
            }
        });
    };
    useEffect(profileSettingPreset, []);

    //submit함수 - 3개가 순차적으로 call된다. 1.제출 클릭했으므로 스타일 변경 / 이미지 처리 / 실제 제출 후 스타일 변경
    const [userProfileUploaded, setUserProfileuploaded] = useState(null);
    const [profileSubmitClicked, setProfileSubmitClicked] = useState(false);//제출 클릭을 기억한다.

    const submitAbleAgain = () => {
        setProfileSubmitClicked(false);
        const btn = document.querySelector('#profileSubmitBtn');
        btn.innerHTML = '수정';
        btn.style.color = 'white';
        btn.style.backgroundColor = '#F4DEDE';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
    };

    const profileSettingSubmitHandler = (event) => {//작성필요
        event.preventDefault();
        if(profileSubmitClicked) return;//이미 submit중이면 실행하지 않는다.

        setProfileSubmitClicked(true);
        const btn = document.querySelector('#profileSubmitBtn');
        btn.innerHTML = '제출중';
        btn.style.color = 'black';
        btn.style.backgroundColor = 'gray';
        btn.style.cursor = 'wait';
        btn.disabled = true;
    };

    useEffect(() => {
        if(!profileSubmitClicked) return;//초기상황에 자동종료+ true->false에서의 실행을 막는다.

        if(ps_userImageSend === null){//사용자 지정 없이 그냥 제출한 경우
            setUserProfileuploaded(ps_userImage);//지금꺼 그대로 적용
            return;
        }
        const fileData = new FormData();
        console.log(ps_userImageSend);
        fileData.append('file', ps_userImageSend);

        axios({
            url: `${uploadImageUrl}profile`,
            method: 'POST',
            data: fileData,
            headers:{
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((res) => {
            setUserProfileuploaded(res.data[0]);
        })
        .catch((res) => {
            if(res.response.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("이미지 처리에 실패했습니다.");
            }
        });
    }, [profileSubmitClicked]);

    useEffect(() => {
        if(userProfileUploaded !== null){//초기상황에 자동종료
            axios.post(submitProfileSettingUrl,{
                nickname: ps_userName,
                age: ps_userAge,
                gender: ps_userGender,
                ageVisible: ps_userAgeVisible,
                genderVisible:ps_userGenderVisible,
                imgUrl: userProfileUploaded,
                selfIntroduction: ps_userIntroduce,
            })
            .then((res) => {
                console.log(res);
                alert("설정을 변경했습니다.");
                profileSettingPreset();//설정 다시 불러오기
                //아래는 초기화
                setPs_userImageSend(null);
                setUserProfileuploaded(null);
                submitAbleAgain();//다시 제출 가능 상태로
            })
            .catch((res) => {
                submitAbleAgain();//다시 제출 가능 상태로
                if(res.response.status === 401){//access token이 만료된 경우이다.
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("문제가 발생했습니다.");
                }
            });
        }
    }, [userProfileUploaded]);

    //이미지 변경 함수 - ps_nextUserImage를 바꾸고 받아온 이미지를 처리 한다.
    const profileImageChangeHandler = (event) => {
        event.preventDefault();
        const inputImage = event.target.files[0];
        setPs_userImageSend(inputImage);//파일 자체를 집어넣는다.
        const reader = new FileReader();
        reader.readAsDataURL(inputImage);
        reader.onload = (imageData) => {
            setPs_UserImage(imageData.target.result);//파일의 미리보기를 생성해서 집어넣는다.
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
    
    //공개여부 변경 함수
    const ageVisibleChangeHandler = (event) => {
        event.preventDefault();
        setPs_UserAgeVisible((cur) => !cur);
    };

    const genderVisibleChangeHandler = (event) => {
        event.preventDefault();
        setPs_UserGenderVisible((cur) => !cur);
    };


    return(
        <form className={Style.profileSettingCover} onSubmit={profileSettingSubmitHandler}>
            <div className={Style.Cover}>
                <div className={Style.MyprofileExample}>
                    <div className={Style.Cover}>
                        <label htmlFor='UserProfileImage'>
                            <img src={ps_userImage} className={Style.myprofileImage}/>
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
                        <p className={Style.myprofileNickname}>{ps_userName}</p>
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
                            maxLength={20}
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
                            type="number"
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
                        {
                            ps_userGender === "MALE" ?
                            <input type="text" value="남" className={Style.profileSettingInput} readOnly />
                            :
                            <input type="text" value="여" className={Style.profileSettingInput} readOnly />
                        }
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
                        <textarea 
                            id="profileSettingIntroduce"
                            type="text"
                            maxLength={120}
                            value={ps_userIntroduce}
                            onChange={selfIntroductionChageHandler}
                            className={Style.profileSettingInput}
                            style={{resize: "none", height: "70%"}}/>
                    </div>
                    <div />
                </div>
            </div>
            <div className={Style.Cover}>
                <button 
                    className={Style.submitButton}
                    id="profileSubmitBtn"
                    type="submit">
                    수정
                </button>
            </div>
        </form>
    );
}

export default ProfileSetting;