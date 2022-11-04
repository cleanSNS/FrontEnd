//유저 프로필 화면
import Style from './pageList.module.css';
import followBefImg from './user_plus.png';
import followAftImg from './user_check.png';
import moreStuff from '../../root/moreStuff.png';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getUserNicknameAndImageUrl,
    ReportUrl,
    BlockUserURl,
    followUserUrl,
    unfollowUserUrl,
    getfollowerListUrl,
    getFolloweeListUrl,
    getUserPageListUrl
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
    const [userDropBoxToggle, setUserDropBoxToggle] = useState(false);//...누르면 뜨는거 활성화 toggle
    const [loadedUserId, setLoadedUserId] = useState("");

    const [followerList, setFollowerList] = useState([]);//팔로워 리스트
    const [followeeList, setFolloweeList] = useState([]);//팔로잉 리스트

    const [userPageList, setUserPageList] = useState([]);//유저의 pageList
    const [pageStartId, setPageStartId] = useState(987654321);//불러온 페이지의 startId
    const [lastPageInUserPage, inView] = useInView();//pageList의 마지막요소에 넣는다.
    const [lastPage, setLastPage] = useState(false);//마지막 페이지가 로드되었는지 확인한다.

    const [loading, setLoading] = useState(true);

    /**************************초기 설정******************************/
    const loadLoadedUserId = () => {//지금 어떤 페이지로 들어왔는지 확인한다.
        //먼저 나의 id와 지금 들어온 id가 동일하면, isMyPage를 true로 바꿔주고 작업한다.
        setLoadedUserId(Number(leftBookState.split('/')[1]));
        if(userId === Number(leftBookState.split('/')[1])){//자기 자신의 페이지를 불러온 경우
            setIsMyPage(true);
        }
        else{
            setIsMyPage(false);
        }

        //초기화 부분
        setBottomStuff("PAGE");
        setFollowerList([]);
        setFolloweeList([]);
        setUserPageList([]);
        setPageStartId(987654321);
    };
    useEffect(loadLoadedUserId, [leftBookState]);

    const presetUserPageList = async () => {
        if(loadedUserId === "") return;//초기 상황인 경우 즉시 종료한다.

        const res = await getAxios(`${getUserNicknameAndImageUrl}${loadedUserId}/profile`);//상단 프로필 불러오기
        setUserImage(res.data.data.imgUrl);
        setUserNickname(res.data.data.nickname);
        setUserIntroduce(res.data.data.selfIntroduction);
        setFollowerCount(res.data.data.followerCount);
        setFolloweeCount(res.data.data.followeeCount);
        setIsFollowed(res.data.data.follow);

        const res2 = await getAxios(getfollowerListUrl, {}, refreshAccessToken);//팔로워 불러오기
        setFollowerList(res2.data.data);

        const res3 = await getAxios(getFolloweeListUrl, {}, refreshAccessToken);//팔로워 불러오기
        setFolloweeList(res3.data.data);

        await getUserPageList();//pageList초기 설정

        setLoading(false);
    };
    useEffect(() => {presetUserPageList();}, [loadedUserId]);


    /******************pageList에서 불러온거 */  
  
    //사용자가 올린 페이지를 불러오는 함수
    const getUserPageList = async () => {
        const res = await getAxios(`${getUserPageListUrl}${loadedUserId}?startId=${pageStartId}`, {}, refreshAccessToken);
        const tmp = [...res.data.data];
        if(tmp.length === 0){
            setLastPage(true);
        }
        const currentList = [...userPageList];
        const next = currentList.concat(tmp);
        setUserPageList(next);
        setPageStartId(res.data.startId);
    };
  
    //무한 로드 함수
    useEffect(() => {
        if(inView && !lastPage){
            getUserPageList();
        }
    }, [inView]);

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
            <div className={Style.pageArea}>
                {
                    bottomStuff === "PAGE" ? 
                    userPageList.map((data, index) => (
                        index === userPageList.length - 1 ?
                        <PageListArea data={data} setPageId={setPageId} key={index} lastPageInUserPage={lastPageInUserPage}/>
                        :
                        <PageListArea data={data} setPageId={setPageId} key={index} lastPageInUserPage={null}/>
                    ))
                    : null
                }
                {
                    (bottomStuff === "FOLLOWER") ?
                    followerList.map((data, index) => (
                        <UserListArea data={data} leftBookChangeHandler={leftBookChangeHandler} key={index}/>
                    ))
                    : null
                }
                {
                    (bottomStuff === "FOLLOWEE") ? 
                    followeeList.map((data, index) => (
                        <UserListArea data={data} leftBookChangeHandler={leftBookChangeHandler} key={index}/>
                    ))
                    : null
                }
            </div>
        </div>
    );
}

export default LeftPageList;