import { useState, useEffect } from 'react';
import Style from './noticeSetting.module.css';
import {
    getCurrentNoticeSettingUrl,
    submitCurrentNoticeSettingUrl,
} from "../../../../apiUrl";
import axios from 'axios';

const NoticeSetting = ({refreshAccessToken}) => {
    //설정들
    const [notificationFollow, setNotificationFollow] = useState("");
    const [notificationComment, setNotificationComment] = useState("");
    const [notificationLike, setNotificationLike] = useState("");
    const [notificationFollowAccept, setNotificationFollowAccept] = useState("");
    const [notificationChat, setNotificationChat] = useState("");

    //처음에 설정현황을 불러오는 함수
    const noticeSettingPreset = () => {
        axios.get(getCurrentNoticeSettingUrl)
        .then((res) => {
            setNotificationFollow(res.data.data.notificationFollow);
            setNotificationComment(res.data.data.notificationComment)
            setNotificationLike(res.data.data.notificationLike);
            setNotificationFollowAccept(res.data.data.notificationFollowAccept);
            setNotificationChat(res.data.data.notificationChat);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){//access token이 만료된 경우이다.
                refreshAccessToken();
                setTimeout(noticeSettingPreset, 1000);
            }
            else{
                console.log(res);
                alert("설정을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(noticeSettingPreset, []);

    //submit function
    const [noticeSubmitClicked, setNoticeSubmitClicked] = useState(false);//제출 상태 확인
    
    const submitAbleAgain = () => {
        setNoticeSubmitClicked(false);
        const btn = document.querySelector('#noticeSubmitBtn');
        btn.innerHTML = '제출';
        btn.style.color = 'white';
        btn.style.backgroundColor = '#F4DEDE';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if(noticeSubmitClicked) return;

        setNoticeSubmitClicked(true);
        const btn = document.querySelector('#noticeSubmitBtn');
        btn.innerHTML = "제출중";
        btn.style.color = 'black';
        btn.style.backgroundColor = 'gray';
        btn.style.cursor = 'wait';
        btn.disabled = true;
    };

    const submitHandlerSecondAct = () => {
        if(!noticeSubmitClicked) return;

        axios.post(submitCurrentNoticeSettingUrl,{
            notificationFollow: notificationFollow,
            notificationComment: notificationComment,
            notificationLike: notificationLike,
            notificationFollowAccept: notificationFollowAccept,
            notificationChat: notificationChat,
        })
        .then((res) => {
            alert("설정을 변경했습니다.");
            noticeSettingPreset();//초기값 다시 불러오기
            submitAbleAgain();//다시 제출 가능하게 하기
        })
        .catch((res) => {
            submitAbleAgain();//다시 제출 가능하게하기
            if(res.response.status === 401 || res.response.status === 0){//access token이 만료된 경우이다.
                refreshAccessToken();
                setTimeout(submitHandlerSecondAct, 1000);
            }
            else{
                console.log(res);
                alert("설정을 변경하지 못했습니다.");
            }
        });
    };

    useEffect(submitHandlerSecondAct, [noticeSubmitClicked]);

    //각 설정 클릭시 handler
    const notificationFollowClickHandler = (event) => {
        event.preventDefault();
        setNotificationFollow((cur) => !cur);
    };
    const notificationCommentClickHandler = (event) => {
        event.preventDefault();
        if(event.target.id === "notificationCommentAll"){
            setNotificationComment("ALL");
        }
        else if(event.target.id === "notificationCommentFollowOnly"){
            setNotificationComment("FOLLOW_ONLY");
        }
        else{
            setNotificationComment("NONE");
        }
    };
    const notificationLikeClickHandler = (event) => {
        event.preventDefault();
        if(event.target.id === "notificationLikeAll"){
            setNotificationLike("ALL");
        }
        else if(event.target.id === "notificationLikeFollowOnly"){
            setNotificationLike("FOLLOW_ONLY");
        }
        else{
            setNotificationLike("NONE");
        }
    };
    const notificationFollowAcceptClickHandler = (event) => {
        event.preventDefault();
        setNotificationFollowAccept((cur) => !cur);
    };
    const notificationChatClickHandler = (event) => {
        event.preventDefault();
        setNotificationChat((cur) => !cur);
    };

    //각 요소 스타일 변경 handler
    const notificationFollowStyleChanger = () => {
        if(notificationFollow){
            document.querySelector("#notificationFollowTrue").style.fontWeight = "600";
            document.querySelector("#notificationFollowFalse").style.fontWeight = "400";
        }
        else{
            document.querySelector("#notificationFollowTrue").style.fontWeight = "400";
            document.querySelector("#notificationFollowFalse").style.fontWeight = "600";
        }
    };
    useEffect(notificationFollowStyleChanger, [notificationFollow]);

    const notificationCommentStyleChanger = () => {
        if(notificationComment === "ALL"){
            document.querySelector("#notificationCommentAll").style.fontWeight = "600";
            document.querySelector("#notificationCommentFollowOnly").style.fontWeight = "400";
            document.querySelector("#notificationCommentNone").style.fontWeight = "400";
        }
        else if(notificationComment === "FOLLOW_ONLY"){
            document.querySelector("#notificationCommentAll").style.fontWeight = "400";
            document.querySelector("#notificationCommentFollowOnly").style.fontWeight = "600";
            document.querySelector("#notificationCommentNone").style.fontWeight = "400";
        }
        else{
            document.querySelector("#notificationCommentAll").style.fontWeight = "400";
            document.querySelector("#notificationCommentFollowOnly").style.fontWeight = "400";
            document.querySelector("#notificationCommentNone").style.fontWeight = "600";
        }
    };
    useEffect(notificationCommentStyleChanger, [notificationComment]);

    const notificationLikeStyleChanger = () => {
        if(notificationLike === "ALL"){
            document.querySelector("#notificationLikeAll").style.fontWeight = "600";
            document.querySelector("#notificationLikeFollowOnly").style.fontWeight = "400";
            document.querySelector("#notificationLikeNone").style.fontWeight = "400";
        }
        else if(notificationLike === "FOLLOW_ONLY"){
            document.querySelector("#notificationLikeAll").style.fontWeight = "400";
            document.querySelector("#notificationLikeFollowOnly").style.fontWeight = "600";
            document.querySelector("#notificationLikeNone").style.fontWeight = "400";
        }
        else {
            document.querySelector("#notificationLikeAll").style.fontWeight = "400";
            document.querySelector("#notificationLikeFollowOnly").style.fontWeight = "400";
            document.querySelector("#notificationLikeNone").style.fontWeight = "600";
        }

    };
    useEffect(notificationLikeStyleChanger, [notificationLike]);

    const notificationFollowAcceptStyleChanger = () => {
        if(notificationFollowAccept){
            document.querySelector("#notificationFollowAcceptTrue").style.fontWeight = "600";
            document.querySelector("#notificationFollowAcceptFalse").style.fontWeight = "400";
        }
        else{
            document.querySelector("#notificationFollowAcceptTrue").style.fontWeight = "400";
            document.querySelector("#notificationFollowAcceptFalse").style.fontWeight = "600";
        }
    };
    useEffect(notificationFollowAcceptStyleChanger, [notificationFollowAccept]);

    const notificationChatStyleChanger = () => {
        if(notificationChat){
            document.querySelector("#notificationChatTrue").style.fontWeight = "600";
            document.querySelector("#notificationChatFalse").style.fontWeight = "400";
        }
        else{
            document.querySelector("#notificationChatTrue").style.fontWeight = "400";
            document.querySelector("#notificationChatFalse").style.fontWeight = "600";
        }

    };
    useEffect(notificationChatStyleChanger, [notificationChat]);


    return(
        <form className={Style.WholeCover} onSubmit={submitHandler}>
            <div className={Style.Cover}>
                <div className={Style.settingLabelInputSplit} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <p className={Style.settingLabel}>팔로우알림</p>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSettingLabelArea}>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationFollowTrue" onClick={notificationFollowClickHandler}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationFollowFalse" onClick={notificationFollowClickHandler}>거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingLabelInputSplit} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <p className={Style.settingLabel}>내가 쓴 댓글 알림</p>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.threeSettingLabelArea}>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationCommentAll" onClick={notificationCommentClickHandler}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationCommentFollowOnly" onClick={notificationCommentClickHandler}>팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationCommentNone" onClick={notificationCommentClickHandler}>거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingLabelInputSplit} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <p className={Style.settingLabel}>내가 쓴 글 좋아요 알림</p>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.threeSettingLabelArea}>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationLikeAll" onClick={notificationLikeClickHandler}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationLikeFollowOnly" onClick={notificationLikeClickHandler}>팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationLikeNone" onClick={notificationLikeClickHandler}>거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingLabelInputSplit} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <p className={Style.settingLabel}>상대의 팔로우 수락</p>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSettingLabelArea}>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationFollowAcceptTrue" onClick={notificationFollowAcceptClickHandler}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationFollowAcceptFalse" onClick={notificationFollowAcceptClickHandler}>거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingLabelInputSplit}>
                    <div className={Style.Cover}>
                        <p className={Style.settingLabel}>채팅 알림</p>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSettingLabelArea}>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationChatTrue" onClick={notificationChatClickHandler}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput} id="notificationChatFalse" onClick={notificationChatClickHandler}>거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <button id="noticeSubmitBtn" type="submit" className={Style.submitBtn}>제출</button>
            </div>
        </form>
    );
}

export default NoticeSetting;