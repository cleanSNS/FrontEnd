import Style from './notice.module.css';
import { useEffect } from 'react';
import {
    readNoticeUrl,
    deleteNoticeUrl,
} from '../../../../apiUrl';
import {
    postAxios,
    deleteAxios
} from '../../../../apiCall';
import closeBtn from './close_btn.png';

const SingleNotice = ({notificationId, userImgUrl, targetUserId, type, resourceId, checked, lastNotice, leftBookChangeHandler, ListDeleteHandler, index, setPageId, setNoticeCount, refreshAccessToken}) => {
    //초기 설정으로, 이미 읽은 알림의 경우 연하게 스타일 변경
    const noticePreset = () => {
        if(checked){
            document.querySelector(`#noticeScript${notificationId}`).style.color ="gray";
        }
    };
    useEffect(noticePreset, []);

    //알림의 이미지 클릭 시 해당 유저의 페이지로 이동
    const onUserImageClickHandler = (event) => {
        event.preventDefault();
        leftBookChangeHandler("pList/" + targetUserId);
    };

    //알림을 클릭 시 알림이 발생한 근원지로 이동(FOLLOW는 유저로, 나머지는 글로)
    //알림 클릭 시 해당 알림은 읽은 것으로 처리
    const onNoticeScripsClickHandler = async (event) => {
        event.preventDefault();

        //읽음 처리
        await postAxios(`${readNoticeUrl}${notificationId}`, {
            notificationId: notificationId,
        }, refreshAccessToken);
        if(document.querySelector(`#noticeScript${notificationId}`).style.color !== "gray"){//이미 읽은것으로 처리되어있는 경우가 아닐 때 1을 뺀다.
            setNoticeCount((cur) => cur - 1);//알림 하나 읽은 것으로 처리
        }
        document.querySelector(`#noticeScript${notificationId}`).style.color = "gray";

        //페이지 이동
        if(type === "FOLLOW"){
            leftBookChangeHandler("pList/" + targetUserId);
        }
        else{
            setPageId(resourceId);
        }
    };

    const deleteBtnClickHandler = async (event) => {
        event.preventDefault();

        //api로 삭제 처리
        await deleteAxios(`${deleteNoticeUrl}${notificationId}`, refreshAccessToken);
        ListDeleteHandler(event);//보이는 내용 처리
        if(document.querySelector(`#noticeScript${notificationId}`).style.color !== "gray"){//이미 읽은것으로 처리되어있는 경우가 아닐 때 1을 뺀다.
            setNoticeCount((cur) => cur - 1);//알림 하나 읽은 것으로 처리
        }
    };

    return(//마지막 요소는 설정을 더해준다.
        <div className={Style.noticeCover} ref={lastNotice}>
                <div className={Style.Cover}>
                    <img src={userImgUrl} className={Style.noticeImg} onClick={onUserImageClickHandler}/>
                </div>
                <div className={Style.Cover}>
                    {type === "COMMENT" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>내 글에 댓글이 달렸습니다.</p> : null}
                    {type === "FOLLOW" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>팔로우를 했습니다.</p> : null}
                    {type === "NESTED" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>내 댓글에 답글이 달렸습니다.</p> : null}
                    {type === "LIKE" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>내 글에 좋아요가 눌렸습니다.</p> : null}
                </div>
                <div className={Style.Cover}>
                    <img src={closeBtn} className={Style.deleteBtn} onClick={deleteBtnClickHandler} id={index}/>
                </div>
        </div>
    );
};