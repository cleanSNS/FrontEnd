//유저 프로필 화면
import Style from './pageList.module.css';
import followBefImg from './user_plus.png';
import followAftImg from './user_check.png';
import moreStuff from '../../root/moreStuff.png';
import { useState, useEffect } from 'react';
import {
    getUserNicknameAndImageUrl,
    ReportUrl,
    BlockUserURl,
    followUserUrl,
    unfollowUserUrl,
} from '../../../../apiUrl';
import { getAxios, postAxios } from '../../../../apiCall';

import PageListArea from './pageListArea';
import UserListArea from './userListArea';

const LeftPageList = ({leftBookState, refreshAccessToken, leftBookChangeHandler, setPageId, userId, SettingChangeHandler, setUserPageAndFriendReloadTriger}) => {//일단 leftBookState를 확인해야한다. pageList/{userId}로 되어있음 userId의 유저 게시글과 이미지, 이름을 불러와서 로딩한다.
    const [userImage, setUserImage] = useState("");//해당 프로필의 유저 이미지
    const [userNickname, setUserNickname] = useState("");//해당 프로필의 유저 닉네임
    const [userIntroduce, setUserIntroduce] = useState("");//해당 프로필의 유저 자기소개
    const [followerCount, setFollowerCount] = useState(0);//팔로워 숫자
    const [followeeCount, setFolloweeCount] = useState(0);//팔로잉 숫자
    const [isFollowed, setIsFollowed] = useState(false);//해당 유저를 내가 이미 팔로우 중인지 확인
    const [isMyPage, setIsMyPage] = useState(false);
    const [bottomStuff, setBottomStuff] = useState("PAGE");//PAGE, FOLLOWEE, FOLLOWER가 가능한 값이다. 이 값에 따라 하단 내용이 달라진다.
    const [setted, setSetted] = useState(false);
    const [userDropBoxToggle, setUserDropBoxToggle] = useState(false);//...누르면 뜨는거 활성화 toggle
    const [loadedUserId, setLoadedUserId] = useState("");

    const [loading, setLoading] = useState(true);

    /**************************초기 설정******************************/
    const loadLoadedUserId = () => {//지금 어떤 페이지로 들어왔는지 확인한다.
        //먼저 나의 id와 지금 들어온 id가 동일하면, isMyPage를 true로 바꿔주고 작업한다.
        setLoadedUserId(Number(leftBookState.split('/')[1]));
        setLoading(true);//로딩을 해야한다.
        setBottomStuff("PAGE");//또한 기존에 이 페이지가 로드되어있었을 수 있으므로 초기화한다.
        if(userId === Number(leftBookState.split('/')[1])){//자기 자신의 페이지를 불러온 경우
            setIsMyPage(true);
        }
        else{
            setIsMyPage(false);
        }
    };
    useEffect(loadLoadedUserId, [leftBookState]);//이미 들어와있는 페이지를 누르면 실행되지 않는다.

    const presetUserPageList = async () => {
        if(loadedUserId === "") return;//초기 상황인 경우 즉시 종료한다.

        const res = await getAxios(`${getUserNicknameAndImageUrl}${loadedUserId}/profile`);
        setUserImage(res.data.data.imgUrl);
        setUserNickname(res.data.data.nickname);
        setUserIntroduce(res.data.data.selfIntroduction);
        setFollowerCount(res.data.data.followerCount);
        setFolloweeCount(res.data.data.followeeCount);
        setSetted(true);
        setIsFollowed(res.data.data.follow);
    };
    useEffect(() => {presetUserPageList();}, [loadedUserId]);

    /**************************관리 부분*****************************/
    //게시물 클릭 시 handler
    const pageClickHandler = (event) => {
        event.preventDefault();
        setBottomStuff("PAGE");
    };

    //팔로워 클릭 시 handler
    const followerClickHandler = (event) => {
        event.preventDefault();
        if(isMyPage){
            setBottomStuff("FOLLOWER");
        }
    };

    const followeeClickHandler = (event) => {
        event.preventDefault();
        if(isMyPage){
            setBottomStuff("FOLLOWEE");
        }
    };

    //...누르는 함수
    const userDropBoxToggleClickHandler = (event) => {
        event.preventDefault();
        setUserDropBoxToggle((cur) => !cur);
    };

    //유저 팔로우/팔로우 취소 함수
    const followClickHandler = async () => {
        let url = "";
        isFollowed ? url = unfollowUserUrl : url = followUserUrl

        const sendBody = {
            userId: loadedUserId
        };
        await postAxios(url, sendBody, {}, refreshAccessToken);
        setIsFollowed((cur) => !cur);
        setUserPageAndFriendReloadTriger(true);
    };

    //유저 신고함수
    const userReportClickHandler = async (event) => {
        event.preventDefault();

        const sendBody = {
            targetId: loadedUserId,
            type: "USER",
        };
        await postAxios(ReportUrl, sendBody, {}, refreshAccessToken);
        alert("해당 유저를 신고했습니다.");
    };

    //유저 차단함수
    const userBlockClickHandler = async (event) => {
        event.preventDefault();

        const sendBody = {
            userId: loadedUserId,
        };
        await postAxios(BlockUserURl, sendBody, {}, refreshAccessToken);
        alert("해당 유저를 차단했습니다.");
    };

    //내 페이지에서 클릭 시 프로필 세팅 페이지로 이동
    const myProfileSettingClickHandler = () => {
        SettingChangeHandler("profile");
        leftBookChangeHandler("setting");
    }
    
    return(
        loading ? null :
        <div className={Style.wholeCover}>
            <div className={Style.profileCover}>
                <div className={Style.profileElementCover}>
                    <img src={userImage} className={Style.profileImg} />
                </div>
                <div className={Style.profileElementCover}>
                    <p className={Style.profileName}>{userNickname}</p>
                </div>
                <div className={Style.profileElementCover}>
                    { isMyPage ? /* 타인만 필요 */
                        null 
                        : 
                        <img 
                            src={isFollowed ? followAftImg : followBefImg}
                            onClick={followClickHandler}
                            style={{marginRight: "30px", cursor: "pointer"}}
                        />
                    }
                </div>
                <div className={Style.profileElementCover}>
                    <div className={Style.dropBoxCover}>
                        <img src={moreStuff} className={Style.dropBoxBtn} onClick={userDropBoxToggleClickHandler}/>
                        {
                            userDropBoxToggle ?
                            isMyPage ?
                                <div className={Style.userDropBox} style={{width: "202px"}}>
                                    <div 
                                        className={Style.settingBlock}
                                        style={{
                                            borderRight: "1px solid rgb(190, 190, 190)",
                                            borderRadius: "0.5rem 0 0 0.5rem",
                                            width: "50%"
                                        }}
                                        onMouseOver={(event) => event.target.style.backgroundColor="rgb(200,200,200)"}
                                        onMouseOut={(event) => event.target.style.backgroundColor="white"}
                                        onClick={myProfileSettingClickHandler}>
                                        프로필 설정
                                    </div>
                                    <div 
                                        className={Style.settingBlock}
                                        style={{
                                            borderRadius: "0 0.5rem 0.5rem 0",
                                            width: "50%"
                                        }}
                                        onMouseOver={(event) => event.target.style.backgroundColor="rgb(200,200,200)"}
                                        onMouseOut={(event) => event.target.style.backgroundColor="white"}
                                        onClick={() => setUserDropBoxToggle((cur) => !cur)}>
                                        닫기
                                    </div>
                                </div>
                            :
                                <div className={Style.userDropBox} style={{width: "302px"}}>
                                    <div 
                                        className={Style.settingBlock}
                                        style={{
                                            borderRight: "1px solid rgb(190, 190, 190)",
                                            borderRadius: "0.5rem 0 0 0.5rem",
                                            width: "33%"
                                        }}
                                        onMouseOver={(event) => event.target.style.backgroundColor="rgb(200,200,200)"}
                                        onMouseOut={(event) => event.target.style.backgroundColor="white"}
                                        onClick={userReportClickHandler}>
                                        신고
                                    </div>
                                    <div 
                                        className={Style.settingBlock}
                                        style={{
                                            borderRight: "1px solid rgb(190, 190, 190)",
                                            width: "33%"
                                        }}
                                        onMouseOver={(event) => event.target.style.backgroundColor="rgb(200,200,200)"}
                                        onMouseOut={(event) => event.target.style.backgroundColor="white"}
                                        onClick={userBlockClickHandler}>
                                        차단
                                    </div>
                                    <div 
                                        className={Style.settingBlock}
                                        style={{
                                            borderRadius: "0 0.5rem 0.5rem 0",
                                            width: "33%"
                                        }}
                                        onMouseOver={(event) => event.target.style.backgroundColor="rgb(200,200,200)"}
                                        onMouseOut={(event) => event.target.style.backgroundColor="white"}
                                        onClick={() => setUserDropBoxToggle((cur) => !cur)}>
                                        닫기
                                    </div>
                                </div>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
            {/* 게시물, 팔로워, 팔로우 하는 사람을 볼 수 있는 곳으로, 내 페이지인 경우만 팔로워, 팔로우 하는 사람을 볼 수 있다. */}
            <div className={Style.pageFollowerFolloweeCover}>
                <p onClick={pageClickHandler} style={{cursor:"pointer"}}>게시물</p>
                <p onClick={followerClickHandler} style={isMyPage ? {cursor:"pointer"} : null}>{`팔로워 ${followerCount}`}</p>
                <p onClick={followeeClickHandler} style={isMyPage ? {cursor:"pointer"} : null}>{`팔로우 ${followeeCount}`}</p>
            </div>
            <p style={{height:"fit-content"}}>{userIntroduce}</p>
            {
                bottomStuff === "PAGE" && setted ? 
                <PageListArea
                    bottomStuff={bottomStuff}
                    loadedUserId={loadedUserId}
                    refreshAccessToken={refreshAccessToken}
                    setPageId={setPageId}
                    setted={setted}
                    leftBookState={leftBookState}
                    setLoading={setLoading}
                /> : null
            }
            {
                (bottomStuff === "FOLLOWER" || bottomStuff === "FOLLOWEE") && setted ? 
                <UserListArea
                    bottomStuff={bottomStuff}
                    refreshAccessToken={refreshAccessToken}
                    leftBookChangeHandler={leftBookChangeHandler}
                    setted={setted}
                    leftBookState={leftBookState}
                /> : null
            }
        </div>
    );
}

export default LeftPageList;