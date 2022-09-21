//import Style from './pageList.module.css';
import { useState, useEffect } from 'react';
import {
    getUserPageListUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const LeftPageList = ({leftBookState, refreshAccessToken}) => {//일단 leftBookState를 확인해야한다. pageList/{userId}로 되어있음 userId의 유저 게시글과 이미지, 이름을 불러와서 로딩한다.
    let startId = 987654321;
    let userId;
    const [userPageList, setUserPageList] = useState([]);
    const [userImage, setUserImage] = useState("");
    const [userNickname, setUserNickname] = useState("");

    const presetUserPageList = () => {
        userId = leftBookState.slice(9);
        axios.get(getUserPageListUrl + userId + "?startId=" + startId.toString())
        .then((res) => {
            const prev = [...userPageList];
            const tmp = [...res.data.data];
            const next = prev.concat(tmp);
            setUserPageList(next);
            startId = res.data.startId;
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("에러 발생");
                //window.location.href = "/main";
            }
        });
    };
    useEffect(presetUserPageList, []);
    
    return(
        <p>PageList</p>
    );
}

export default LeftPageList;