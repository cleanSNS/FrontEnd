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
            console.log(res);
            alert("에러발생");
            //window.location.href = "/main";
        });
    };
    useEffect(noticeSettingPreset, []);

    //submit function
    const submitHandler = (event) => {
        event.preventDefault();
        axios.post(submitCurrentNoticeSettingUrl,{
            notificationFollow: notificationFollow,
            notificationComment: notificationComment,
            notificationLike: notificationLike,
            notificationFollowAccept: notificationFollowAccept,
            notificationChat: notificationChat,
        })
        .then((res) => {
            alert("설정을 변경했습니다.");
        })
        .catch((res) => {
            alert("에러가 발생했습니다.");
            //window.location.href = "/main";
        })
    };

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
                <button type="submit" className={Style.submitBtn}>수정</button>
            </div>
        </form>
    );
}

export default NoticeSetting;