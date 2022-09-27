//유저 프로필 화면
import Style from './pageList.module.css';
import followBefImg from './user_plus.png';
import followAftImg from './user_check.png';
import moreStuff from '../../root/moreStuff.png';
import { useState, useEffect } from 'react';
import {
    getUserPageListUrl,
    getMyUserIdUrl,
    getUserNicknameAndImageUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const UserListArea = ({bottomStuff, userId, refreshAccessToken}) => {
    let userStartId = 987654321;
    const [userList, setUserList] = useState([]);

    const presetUserListArea = () => {
        if(bottomStuff === "FOLLOWER"){
            axios.get()
            .then((res) =>{

            })
            .catch((res) => {

            });

        }
        else if(bottomStuff === "FOLLOWEE"){
            axios.get()
        }
        else{
            return;
        }
    };
    useEffect(presetUserListArea, [bottomStuff]);



    return(
        <div className={Style.pageArea}>
            <div className={Style.userArea}>
                <img className={Style.userImg} />
                <p className={Style.userNickname}>유저 닉네임이 오는 곳입니다.</p>
            </div>
            <div className={Style.userArea}>
                <img className={Style.userImg} />
                <p className={Style.userNickname}>유저 닉네임이 오는 곳입니다.</p>
            </div>
            <div className={Style.userArea}>
                <img className={Style.userImg} />
                <p className={Style.userNickname}>유저 닉네임이 오는 곳입니다.</p>
            </div>
            <div className={Style.userArea}>
                <img className={Style.userImg} />
                <p className={Style.userNickname}>유저 닉네임이 오는 곳입니다.</p>
            </div>
            <div className={Style.userArea}>
                <img className={Style.userImg} />
                <p className={Style.userNickname}>유저 닉네임이 오는 곳입니다.</p>
            </div>
            <div className={Style.userArea}>
                <img className={Style.userImg} />
                <p className={Style.userNickname}>유저 닉네임이 오는 곳입니다.</p>
            </div>

        </div>
    );
};

const PageListArea = ({userId, refreshAccessToken}) => {
    let pageStartId = 987654321;
    const [userPageList, setUserPageList] = useState([]);
    const presetUserPageList = () => {
        axios.get(getUserPageListUrl + userId.toString() + "?startId=" + pageStartId.toString())
        .then((res) => {
            const tmp = [...res.data.data];
            const currentList = [...userPageList];
            const next = currentList.concat(tmp);
            setUserPageList(next);
            pageStartId = res.data.startId;
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("내 id를 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetUserPageList, []);
    return(
        <div className={Style.pageArea}>
            {
                userPageList.map((data, index) => (
                    <img src={data} className={Style.singlePage} key={index} />
                ))
            }
        </div>
    );
};

const LeftPageList = ({leftBookState, refreshAccessToken}) => {//일단 leftBookState를 확인해야한다. pageList/{userId}로 되어있음 userId의 유저 게시글과 이미지, 이름을 불러와서 로딩한다.
    const [userImage, setUserImage] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userIntroduce, setUserIntroduce] = useState("");
    const [followerCount, setFollowerCount] = useState(0);//팔로워 숫자
    const [followeeCount, setFolloweeCount] = useState(0);//팔로잉 숫자
    const [isMyPage, setIsMyPage] = useState(false);
    const [bottomStuff, setBottomStuff] = useState("PAGE");//PAGE, FOLLOWEE, FOLLOWER가 가능한 값이다. 이 값에 따라 하단 내용이 달라진다.
    let userId;
    let setted = false;

    const presetUserPageList = () => {
        //먼저 나의 id를 구하는 api를 호출, 그 id와 지금 들어온 id가 동일하면, isMyPage를 true로 바꿔주고 작업한다.
        //if isMyPage면 맨 윗줄 프로필 부분에 
        userId = leftBookState.slice(9);
        console.log(userId);
        axios.get(getMyUserIdUrl)
        .then((res) => {
            if(res.data.data.userId === Number(userId)){//자기 자신의 페이지를 불러온 경우
                setIsMyPage(true);
            }
            //이후는 자신의 페이지든 타인의 페이지든 동일하다
            axios.get(getUserNicknameAndImageUrl + userId + "/profile")
            .then((res) => {
                setUserImage(res.data.data.imgUrl);
                setUserNickname(res.data.data.nickname);
                //setUserIntroduce();
                //setFollowerCount();
                //setFolloweeCount();
                setted = true;
            })
            .catch((res) => {
                if(res.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("이미지와 닉네임을 불러오지 못했습니다.");
                }
            })
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("내 id를 불러오지 못했습니다.");
            }
        })
        
    };
    useEffect(presetUserPageList, []);

    //게시물 클릭 시 handler
    const pageClickHandler = (event) => {
        event.preventDefault();
        setBottomStuff("PAGE");
    }

    //팔로워 클릭 시 handler
    const followerClickHandler = (event) => {
        event.preventDefault();
        if(isMyPage){
            setBottomStuff("FOLLOWER");
        }
    }

    const followeeClickHandler = (event) => {
        event.preventDefault();
        if(isMyPage){
            setBottomStuff("FOLLOWEE");
        }
    }
    
    return(
        <div className={Style.wholeCover}>
            <div className={Style.profileCover}>
                <img src={userImage} className={Style.profileImg} />
                <p className={Style.profileName}>{userNickname}</p>
                { isMyPage ? null : <img src={followBefImg} style={{marginRight: "30px"}}/> /* 타인만 필요 */}
                { isMyPage ? null : <img src={moreStuff} /> /* 타인만 필요 */}
            </div>
            {/* 게시물, 팔로워, 팔로우 하는 사람을 볼 수 있는 곳으로, 내 페이지인 경우만 팔로워, 팔로우 하는 사람을 볼 수 있다. */}
            <div className={Style.pageFollowerFolloweeCover}>
                <p onClick={pageClickHandler} style={{cursor:"pointer"}}>게시물</p>
                <p onClick={followerClickHandler} style={isMyPage ? {cursor:"pointer"} : null}>{"팔로워 " + followerCount.toString()}</p>
                <p onClick={followeeClickHandler} style={isMyPage ? {cursor:"pointer"} : null}>{"팔로잉 " + followeeCount.toString()}</p>
            </div>
            <p style={{height:"fit-content"}}>{userIntroduce}</p>
            {bottomStuff === "PAGE" && setted? <PageListArea userId={userId} refreshAccessToken={refreshAccessToken} /> : null}
            {(bottomStuff === "FOLLOWER" || bottomStuff === "FOLLOWEE") && setted ? <UserListArea bottomStuff={bottomStuff} userId={userId} refreshAccessToken={refreshAccessToken}/> : null}
        </div>
    );
}

export default LeftPageList;