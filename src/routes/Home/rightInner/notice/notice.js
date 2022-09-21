import axios from 'axios';
import Style from './notice.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getNoticeUrl,
} from '../../../../apiUrl';

const Notice = ({targetUserId, content, type, resourceId, lastNotice, key, leftBookChangeHandler}) => {
    const onUserImageClickHandler = (event) => {//해당 유저 페이지로 이동
        event.preventDefault();
        leftBookChangeHandler("pageList/" + targetUserId);
    };

    const onNoticeScripsClickHandler = (event) => {//알림이 발생한 원인지로 이동
        event.preventDefault();
        if(type === "FOLLOW"){//type이 FOLLOW인 경우 프로필 클릭과 동일하게 해당 유저 페이지로 이동.
            leftBookChangeHandler("pageList/" + targetUserId);
        }
        else{//type이 그 외인 경우 어차피 다 글에서 발생한 것이므로, 해당 글을 '글 자세히 보기 페이지' 띄우기
            console.log("Working on it");
        }
    }

    return(//마지막 요소는 설정을 더해준다.
        lastNotice === null ?//null이면 별도의 설정이 필요 없다.
        <div className={Style.noticeBlock}>
            <div className={Style.noticeCover}>
                <div className={Style.Cover}>
                    <img src={"imgUrl"} className={Style.noticeImg} onClick={onUserImageClickHandler}/>
                </div>
                <div className={Style.Cover}>
                    <p className={Style.script} onClick={onNoticeScripsClickHandler}>{content}</p>
                </div>
            </div>
        </div>
        ://null이 아니면 ref를 추가해준다.
        <div className={Style.noticeBlock} ref={lastNotice}>
            <div className={Style.noticeCover}>
                <div className={Style.Cover}>
                    <img src={"imgUrl"} className={Style.noticeImg} onClick={onUserImageClickHandler}/>
                </div>
                <div className={Style.Cover}>
                    <p className={Style.script} onClick={onNoticeScripsClickHandler}>{content}</p>
                </div>
            </div>
        </div>
    );
};

const RightNotice = ({leftBookChangeHandler, refreshAccessToken}) => {
    const [noticeList, setNoticeList] = useState([]);
    const [lastNotice, inView] = useInView();
    let startId = 987654321;

    //초기설정
    const NoticeRead = () => {
        axios.get(getNoticeUrl + startId.toString())
        .then((res) => {
            console.log("알림을 불러왔습니다.")
            const current = [...noticeList];
            //const tmp = [...res.data.data];
            const tmp = [
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "name님이 팔로우했습니다.",
                    "type": "FOLLOW",
                    "resourceId": 2
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "새로운 댓글이 달렸습니다.",
                    "type": "COMMENT",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "새로운 댓글이 달렸습니다.",
                    "type": "COMMENT",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "name님이 좋아합니다.",
                    "type": "LIKE",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "새로운 댓글이 달렸습니다.",
                    "type": "COMMENT",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "새로운 댓글이 달렸습니다.",
                    "type": "COMMENT",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "name님이 좋아합니다.",
                    "type": "LIKE",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "새로운 댓글이 달렸습니다.",
                    "type": "COMMENT",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "새로운 댓글이 달렸습니다.",
                    "type": "COMMENT",
                    "resourceId": 1
                },
                {
                    "userId": 1,
                    "targetUserId": 2,
                    "content": "name님이 좋아합니다.",
                    "type": "LIKE",
                    "resourceId": 1
                }
            ];
            const next = current.concat(tmp);
            setNoticeList(next);
            startId = res.data.startId;
        })
        .catch((res) => {
            if(res.status === 401){//access token이 만료된 경우이다.
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("에러 발생");
                //window.location.href = '/main';
            }
        })
    };
    useEffect(NoticeRead, []);

    const infiniteLoad = () => {
        if(inView){//마지막 요소를 보는 중인 경우
            NoticeRead();
        }
    }
    useEffect(infiniteLoad, [inView]);

    return(
        <div className={Style.noticeList}>
            {
                noticeList.map((data, index) =>(//마지막 요소는 last가 true이다.
                    index === (noticeList.length - 1) ?
                    <Notice targetUserId={data.targetUserId} content={data.content} type={data.type} resourceId={data.resourceId} key={index} lastNotice={lastNotice} leftBookChangeHandler={leftBookChangeHandler}/>
                    :
                    <Notice targetUserId={data.targetUserId} content={data.content} type={data.type} resourceId={data.resourceId} key={index} lastNotice={null} leftBookChangeHandler={leftBookChangeHandler}/>
                ))
            }
        </div>
    );
};

export default RightNotice;