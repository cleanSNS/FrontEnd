//유저 프로필 화면
import Style from './pageList.module.css';
import followBefImg from './user_plus.png';
import followAftImg from './user_check.png';
import moreStuff from '../../root/moreStuff.png';
import { useState, useEffect } from 'react';
import {
    getUserPageListUrl,
    getMyUserIdUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const UserListArea = ({bottomStuff}) => {
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

const PageListArea = () => {
    let pageStartId = 987654321;
    const [userPageList, setUserPageList] = useState([]);
    return(
        <div className={Style.pageArea}>
            <div className={Style.singlePage}>

            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
            <div className={Style.singlePage}>
                
            </div>
        </div>
    );
};

const LeftPageList = ({leftBookState, refreshAccessToken}) => {//일단 leftBookState를 확인해야한다. pageList/{userId}로 되어있음 userId의 유저 게시글과 이미지, 이름을 불러와서 로딩한다.
    const [userImage, setUserImage] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [isMyPage, setIsMyPage] = useState(false);
    const [bottomStuff, setBottomStuff] = useState("PAGE");//PAGE, FOLLOWEE, FOLLOWER가 가능한 값이다. 이 값에 따라 하단 내용이 달라진다.

    const presetUserPageList = () => {
        //먼저 나의 id를 구하는 api를 호출, 그 id와 지금 들어온 id가 동일하면, isMyPage를 true로 바꿔주고 작업한다.
        //if isMyPage면 맨 윗줄 프로필 부분에 
        const userId = leftBookState.slice(9);
        axios.get(getMyUserIdUrl)
        .then((res) => {
            if(res.data.data.userId === Number(userId)){//자기 자신의 페이지를 불러온 경우
                setIsMyPage(true);
            }
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
        setBottomStuff("FOLLOWER");
    }

    const followeeClickHandler = (event) => {
        event.preventDefault();
        setBottomStuff("FOLLOWEE");
    }
    
    return(
        <div className={Style.wholeCover}>
            <div className={Style.flexColCover}>
                <div className={Style.profileCover}>
                    <img src={userImage} className={Style.profileImg} />
                    <p className={Style.profileName}>{userNickname + "유저 닉네임 영역입니다 나중에 이 글 지우세요"}</p>
                    {
                        isMyPage ? 
                        <img src={followBefImg} style={{marginRight: "30px"}}/>
                        :
                        <img src={followBefImg} />/*null해야함*/
                    }
                    {
                        isMyPage ? 
                        <img src={moreStuff} />
                        :
                        <img src={moreStuff} />/*null해야함*/
                    }
                </div>
                {
                    isMyPage ?
                    <div className={Style.pageFollowerFolloweeCover}>
                        <p onClick={pageClickHandler} style={{cursor:"pointer"}}>게시물</p>
                        <p onClick={followerClickHandler} style={{cursor:"pointer"}}>팔로워</p>
                        <p onClick={followeeClickHandler} style={{cursor:"pointer"}}>팔로잉</p>
                    </div>
                    :
                    <div className={Style.pageFollowerFolloweeCover}>
                        <p onClick={pageClickHandler} style={{cursor:"pointer"}}>게시물</p>
                        <p onClick={followerClickHandler} style={{cursor:"pointer"}}>팔로워</p>
                        <p onClick={followeeClickHandler} style={{cursor:"pointer"}}>팔로잉</p>
                    </div>//나중에 여기 null로 해야함
                }
            </div>
            <div className={Style.flexColCover} style={{height:"fit-content"}}>
                <p>자기소개는 이 공간에 쓰입니다.</p>
            </div>
            {bottomStuff === "PAGE" ? <PageListArea /> : null}
            {bottomStuff === "FOLLOWER" || bottomStuff === "FOLLOWEE" ? <UserListArea bottomStuff={bottomStuff} /> : null}
        </div>
    );
}

export default LeftPageList;