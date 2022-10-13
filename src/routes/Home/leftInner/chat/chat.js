import Style from './chat.module.css';
import { useState, useEffect } from 'react';
import {
    getChattingListUrl,
} from '../../../../apiUrl';
import axios from 'axios';


const LeftChat = ({refreshAccessToken, leftBookState}) => {
    const [chattingRoomId, setChattingRoomId] = useState(-1);//채팅방의 id
    const [chattingList, setChattingList] = useState([]);//채팅방의 채팅들
    const [chattingListStartId, setChattingListStartId] = useState(987654321);//채팅방의 채팅을 불러오는 startId

    //가장 먼저 채팅방의 아이디를 가져온다.
    const presetChattingRoomId = () => {
        setChattingRoomId(leftBookState.split('/')[1]);
    }
    useEffect(presetChattingRoomId, []);//초기 실행

    //id가 주어졌을 때 이제 해당 채팅방의 채팅들을 불러온다.
    const presetChattingList = () => {
        axios.get(`${getChattingListUrl}/${chattingRoomId}?startId=${chattingListStartId}`)
        .then((res) => {

        })
        .catch((res) => {

        });
    };
    useEffect(presetChattingList, [chattingRoomId]);//채팅방 아이디를 가져오면 진행

    return(
        <p>Chat</p>
    );
}

export default LeftChat;