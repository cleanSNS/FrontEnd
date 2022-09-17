import { useState, useEffect } from 'react';
import Style from './noticeSetting.module.css';
import {
    getCurrentNoticeSettingUrl,
    submitCurrentNoticeSettingUrl,
} from "../../../../apiUrl";
import axios from 'axios';

const NoticeSetting = () => {
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
            console.log(res.data.data);
        })
        .catch((res) => {
            console.log(res);
            alert("에러발생");
            //window.location.href = "/main";
        });
    };
    useEffect(noticeSettingPreset, []);
    return(
        <div className={Style.WholeCover}>
            <div className={Style.Cover}>
                <div className={Style.settingLabelInputSplit} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <p className={Style.settingLabel}>팔로우알림</p>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSettingLabelArea}>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>거부</p>
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
                                <p className={Style.settingInput}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>거부</p>
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
                                <p className={Style.settingInput}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>거부</p>
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
                                <p className={Style.settingInput}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>거부</p>
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
                                <p className={Style.settingInput}>허용</p>
                            </div>
                            <div className={Style.Cover}>
                                <p className={Style.settingInput}>거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <button className={Style.submitBtn}>수정</button>
            </div>
        </div>
    );
}

export default NoticeSetting;