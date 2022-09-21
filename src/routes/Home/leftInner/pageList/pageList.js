import Style from './pageList.module.css';
import { useState, useEffect } from 'react';
import {
    getUserPageListUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const UserListArea = () => {

};

const PageListArea = () => {

};

const LeftPageList = ({leftBookState, refreshAccessToken}) => {//일단 leftBookState를 확인해야한다. pageList/{userId}로 되어있음 userId의 유저 게시글과 이미지, 이름을 불러와서 로딩한다.
    let startId = 987654321;
    let userId;
    const [userPageList, setUserPageList] = useState([]);
    const [userImage, setUserImage] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [isMyPage, setIsMyPage] = useState(false);
    const [bottomStuff, setBottomStuff] = useState("BLANK");//PAGE, FOLLOWEE, FOLLOWER가 가능한 값이다. 이 값에 따라 하단 내용이 달라진다.

    const presetUserPageList = () => {
        //먼저 나의 id를 구하는 api를 호출, 그 id와 지금 들어온 id가 동일하면, isMyPage를 true로 바꿔주고 작업한다.
        //if isMyPage면 맨 윗줄 프로필 부분에 
        userId = leftBookState.slice(9);
        
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
                    <img src={"image"} className={Style.profileImg} />
                    <p className={Style.profileName}>이ddddddddddfsdfsdfdddd름</p>
                    {isMyPage ? null : <p>팔로우버튼</p>}
                    {isMyPage ? null : <p>...</p>}
                </div>
                <div className={Style.pageFollowerFolloweeCover}>
                    <p>게시물</p>
                    <p>팔로워</p>
                    <p>팔로잉</p>
                </div>
            </div>
            <div className={Style.flexColCover}>
                <p>자기소개는 이 공간에 쓰입니다.</p>
            </div>
            {bottomStuff === "PAGE" ? <PageListArea /> : null}
            {bottomStuff === "FOLLOWER" ? <UserListArea /> : null}
            {bottomStuff === "FOLLOWEE" ? <UserListArea /> : null}
        </div>
    );
}

export default LeftPageList;