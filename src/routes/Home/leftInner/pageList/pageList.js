//유저 프로필 화면
import Style from './pageList.module.css';
import followBefImg from './user_plus.png';
import followAftImg from './user_check.png';
import moreStuff from '../../root/moreStuff.png';
import { useState, useEffect } from 'react';
import {
    getUserPageListUrl,
    getUserNicknameAndImageUrl,
    getFolloweeListUrl,
    getfollowerListUrl,
    ReportUrl,
    BlockUserURl,
    followUserUrl,
    unfollowUserUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const UserListArea = ({bottomStuff, refreshAccessToken, leftBookChangeHandler, setted, leftBookState}) => {
    const [userList, setUserList] = useState([]);

    //페이지 이동 시 초기화함수
    const reset = () => {
        setUserList([]);
    };
    useEffect(reset, [leftBookState]);

    //팔로워/팔로잉을 불러오는 함수
    const presetUserListArea = () => {
        if(!setted) return;
        let followerOfFolloweeUrl = "";
        bottomStuff === "FOLLOWER" ? followerOfFolloweeUrl = getfollowerListUrl : followerOfFolloweeUrl = ""
        bottomStuff === "FOLLOWEE" ? followerOfFolloweeUrl = getFolloweeListUrl : followerOfFolloweeUrl = ""
        if(followerOfFolloweeUrl === "") return; //에러상황

        axios.get(followerOfFolloweeUrl)
        .then((res) =>{
            setUserList(res.data.data);
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("팔로워/팔로잉를 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetUserListArea, [bottomStuff]);

    const userClickHander = (event) => {
        event.preventDefault();
        leftBookChangeHandler("pList/" + document.querySelector('[id^=pageListUserId]').id.split('_')[1]);
    };

    return(
        <div className={Style.pageArea}>
            {
                userList.map((data, index) => (
                    <div className={Style.userArea} key={index} onClick={userClickHander} id={`pageListUserId_${data.userId}`}>
                        <img src={data.imgUrl}className={Style.userImg} />
                        <p className={Style.userNickname}>{data.nickname}</p>
                    </div>
                ))
            }
        </div>
    );
};

const PageListArea = ({bottomStuff, loadedUserId, refreshAccessToken, setPageId, setted, leftBookState}) => {
    const [userPageList, setUserPageList] = useState([]);
    const [pageStartId, setPageStartId] = useState(987654321);

    const reset = () => {
        setUserPageList([]);
        setPageStartId(987654321);
    };
    useEffect(reset, [leftBookState]);

    const presetUserPageList = () => {
        if(!setted) return;
        axios.get(getUserPageListUrl + loadedUserId.toString() + "?startId=" + pageStartId.toString())
        .then((res) => {
            const tmp = [...res.data.data];
            const currentList = [...userPageList];
            const next = currentList.concat(tmp);
            setUserPageList(next);
            setPageStartId(res.data.startId);
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("글을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetUserPageList, [bottomStuff]);

    const singlePageClickHandler = (event) => {
        event.preventDefault();
        setPageId(event.target.id);
    };

    return(
        <div className={Style.pageArea}>
            {
                userPageList.map((data, index) => (
                    <img src={data.imgUrl} className={Style.singlePage} key={index} id={data.pageId} onClick={singlePageClickHandler}/>
                ))
            }
        </div>
    );
};

const LeftPageList = ({leftBookState, refreshAccessToken, leftBookChangeHandler, setPageId, userId}) => {//일단 leftBookState를 확인해야한다. pageList/{userId}로 되어있음 userId의 유저 게시글과 이미지, 이름을 불러와서 로딩한다.
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

    /**************************초기 설정******************************/
    const loadLoadedUserId = () => {//지금 어떤 페이지로 들어왔는지 확인한다.
        //먼저 나의 id와 지금 들어온 id가 동일하면, isMyPage를 true로 바꿔주고 작업한다.
        setLoadedUserId(Number(leftBookState.split('/')[1]));
        setBottomStuff("PAGE");//또한 기존에 이 페이지가 로드되어있었을 수 있으므로 초기화한다.
        if(userId === Number(leftBookState.split('/')[1])){//자기 자신의 페이지를 불러온 경우
            setIsMyPage(true);
        }
        else{
            setIsMyPage(false);
        }
    };
    useEffect(loadLoadedUserId, [leftBookState]);

    const presetUserPageList = () => {
        if(loadedUserId === "") return;//초기 상황인 경우 즉시 종료한다.
        axios.get(getUserNicknameAndImageUrl + loadedUserId + "/profile")
        .then((res) => {
            setUserImage(res.data.data.imgUrl);
            setUserNickname(res.data.data.nickname);
            setUserIntroduce(res.data.data.selfIntroduction);
            setFollowerCount(res.data.data.followerCount);
            setFolloweeCount(res.data.data.followeeCount);
            setSetted(true);
            setIsFollowed(res.data.data.follow);
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("이미지와 닉네임을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetUserPageList, [loadedUserId]);

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
    const followClickHandler = (event) => {
        let followOrUnfollowUrl = "";
        isFollowed ? followOrUnfollowUrl = unfollowUserUrl : followOrUnfollowUrl = followUserUrl
        axios.post(followOrUnfollowUrl,{
            userId: loadedUserId
        })
        .then((res) => {
            alert("팔로우/팔로우를 취소했습니다.");
            setIsFollowed((cur) => !cur);
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("해당 유저를 팔로우/ 팔로우 취소하지 못했습니다.");
            }
        });
    };

    //유저 신고함수
    const userReportClickHandler = (event) => {
        event.preventDefault();
        axios.post(ReportUrl, {
            targetId: loadedUserId,
            type: "USER",
        })
        .then((res) => {
            alert("해당 유저를 신고했습니다.");
        })
        .catch((res) =>{
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("해당 유저를 신고하지 못했습니다.");
            }
        })
    };

    //유저 차단함수
    const userBlockClickHandler = (event) => {
        event.preventDefault();
        axios.post(BlockUserURl, {
            userId: loadedUserId,
        })
        .then((res) => {
            alert("해당 유저를 차단했습니다.");
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("해당 유저를 차단하지 못했습니다.");
            }
        });
    };
    
    return(
        <div className={Style.wholeCover}>
            <div className={Style.profileCover}>
                <img src={userImage} className={Style.profileImg} />
                <p className={Style.profileName}>{userNickname}</p>
                { isMyPage ? /* 타인만 필요 */
                    null 
                    : 
                    <img 
                        src={isFollowed ? followAftImg : followBefImg}
                        onClick={followClickHandler}
                        style={{marginRight: "30px", cursor: "pointer"}}
                    />
                }
                { isMyPage ? /* 타인만 필요 */
                    null 
                    :
                    <div className={Style.dropBoxCover}>
                        <img src={moreStuff} className={Style.dropBoxBtn} onClick={userDropBoxToggleClickHandler}/>
                        {
                            userDropBoxToggle ?
                            <div className={Style.userDropBox}>
                                <div 
                                    className={Style.settingBlock}
                                    style={{
                                        borderRight: "1px solid rgb(190, 190, 190)",
                                        borderRadius: "0.5rem 0 0 0.5rem"
                                    }}
                                    onMouseOver={(event) => event.target.style.backgroundColor="rgb(200,200,200)"}
                                    onMouseOut={(event) => event.target.style.backgroundColor="white"}
                                    onClick={userReportClickHandler}>
                                    신고
                                </div>
                                <div 
                                    className={Style.settingBlock}
                                    style={{borderRight: "1px solid rgb(190, 190, 190)"}}
                                    onMouseOver={(event) => event.target.style.backgroundColor="rgb(200,200,200)"}
                                    onMouseOut={(event) => event.target.style.backgroundColor="white"}
                                    onClick={userBlockClickHandler}>
                                    차단
                                </div>
                                <div 
                                    className={Style.settingBlock}
                                    style={{borderRadius: "0 0.5rem 0.5rem 0"}}
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
                }
            </div>
            {/* 게시물, 팔로워, 팔로우 하는 사람을 볼 수 있는 곳으로, 내 페이지인 경우만 팔로워, 팔로우 하는 사람을 볼 수 있다. */}
            <div className={Style.pageFollowerFolloweeCover}>
                <p onClick={pageClickHandler} style={{cursor:"pointer"}}>게시물</p>
                <p onClick={followerClickHandler} style={isMyPage ? {cursor:"pointer"} : null}>{`팔로워 ${followerCount}`}</p>
                <p onClick={followeeClickHandler} style={isMyPage ? {cursor:"pointer"} : null}>{`팔로잉 ${followeeCount}`}</p>
            </div>
            <p style={{height:"fit-content"}}>{userIntroduce}</p>
            {bottomStuff === "PAGE" && setted? <PageListArea bottomStuff={bottomStuff} loadedUserId={loadedUserId} refreshAccessToken={refreshAccessToken} setPageId={setPageId} setted={setted} leftBookState={leftBookState}/> : null}
            {(bottomStuff === "FOLLOWER" || bottomStuff === "FOLLOWEE") && setted ? <UserListArea bottomStuff={bottomStuff} refreshAccessToken={refreshAccessToken} leftBookChangeHandler={leftBookChangeHandler} setted={setted} leftBookState={leftBookState}/> : null}
        </div>
    );
}

export default LeftPageList;