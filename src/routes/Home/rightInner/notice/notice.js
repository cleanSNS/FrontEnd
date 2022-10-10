import axios from 'axios';
import Style from './notice.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getNoticeUrl,
    readNoticeUrl,
    deleteNoticeUrl,
} from '../../../../apiUrl';
import closeBtn from './close_btn.png';

const Notice = ({notificationId, userImgUrl, targetUserId, type, resourceId, checked, lastNotice, leftBookChangeHandler, ListDeleteHandler, index, setPageId, setNoticeCount}) => {
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
    const onNoticeScripsClickHandler = (event) => {
        event.preventDefault();

        //읽음 처리
        axios.post(readNoticeUrl + notificationId.toString(), {
            notificationId: notificationId,
        })
        .then((res) => {
            console.log("해당 알림 읽기 처리 완료");
            setNoticeCount((cur) => cur - 1);//알림 하나 읽은 것으로 처리
            document.querySelector(`#noticeScript${notificationId}`).style.color ="gray";
        })
        .catch((res) => {
            console.log(res);
            console.log("에러 발생");
        });

        //페이지 이동
        if(type === "FOLLOW"){
            leftBookChangeHandler("pList/" + targetUserId);
        }
        else{
            setPageId(resourceId);
        }
    };

    const deleteBtnClickHandler = (event) => {
        event.preventDefault();
        //api로 삭제 처리
        axios.delete(deleteNoticeUrl + notificationId.toString(),{
            notificationId: notificationId
        })
        .then((res) => {
            console.log("삭제 완료");
            ListDeleteHandler(event);//보이는 내용 처리
            setNoticeCount((cur) => cur - 1);//알림 하나 읽은 것으로 처리
        })
        .catch((res) => {
            console.log(res);
            console.log("에러 발생");
        })
    }

    return(//마지막 요소는 설정을 더해준다.
        <div className={Style.noticeCover} ref={lastNotice}>
                <div className={Style.Cover}>
                    <img src={userImgUrl} className={Style.noticeImg} onClick={onUserImageClickHandler}/>
                </div>
                <div className={Style.Cover}>
                    {type === "COMMENT" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>내 글에 댓글이 달렸습니다.</p> : null}
                    {type === "FOLLOW" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>팔로우 요청이 왔습니다.</p> : null}
                    {type === "NESTED" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>내 댓글에 답글이 달렸습니다.</p> : null}
                    {type === "LIKE" ? <p id={`noticeScript${notificationId}`} className={Style.script} onClick={onNoticeScripsClickHandler}>내 글에 좋아요가 눌렸습니다.</p> : null}
                </div>
                <div className={Style.Cover}>
                    <img src={closeBtn} className={Style.deleteBtn} onClick={deleteBtnClickHandler} id={index}/>
                </div>
        </div>
    );
};

const RightNotice = ({leftBookChangeHandler, refreshAccessToken, setPageId, noticeCount, setNoticeCount}) => {
    const [noticeList, setNoticeList] = useState([]);
    const [lastNotice, inView] = useInView();
    const [noticeStartId, setNoticeStartId] = useState(987654321);
    const [noMoreNotice, setNomoreNotice] = useState(false);

    //알림 불러오는 함수
    const NoticeRead = () => {
        axios.get(getNoticeUrl + noticeStartId.toString())
        .then((res) => {
            if(res.data.data.length === 0) {
                setNomoreNotice(true);
                return;
            }
            console.log("알림을 불러왔습니다.");
            console.log(res.data.data);
            const current = [...noticeList];
            const tmp = [...res.data.data];
            const next = current.concat(tmp);
            setNoticeList(next);
            setNoticeStartId(res.data.startId);
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
    useEffect(NoticeRead, [noticeCount]);//알림의 수가 달라질 때마다 부른다.

    //마지막 요소를 보는 중이며, 아직 알림이 남은 경우 notice를 더 불러오게 하는 함수
    const infiniteLoad = () => {
        if(inView & !noMoreNotice){
            NoticeRead();
        }
    }
    useEffect(infiniteLoad, [inView]);

    //닫기 버튼 누른 경우 - Notice 요소 안에 선언하려면 list를 요소마다 복사해서 변수로 가져야 하므로 여기에 선언
    const ListDeleteHandler = (event) => {
        event.preventDefault();
        const tmp = [...noticeList];
        tmp.splice(Number(event.target.id), 1);
        setNoticeList(tmp);
    };

    return(
        <div className={Style.noticeList}>
            {
                noticeList.length === 0 ?
                <p className={Style.noNoticeScript}>도착한 알림이 없습니다.</p>
                :
                noticeList.map((data, index) =>(//마지막 요소는 last가 true이다.
                    <Notice
                        notificationId={data.notificationId}//알림의 id
                        userImgUrl={data.userImgUrl}//알림의 대상의 프로필 사진
                        targetUserId={data.userId}//알림의 대상의 id
                        type={data.type}//알림의 타입
                        resourceId={data.resourceId}//근원지 (FOLLOW의 경우 null이다.)
                        checked={data.checked}//해당 알림을 확인했었는지 안했는지
                        key={index}
                        lastNotice={index === (noticeList.length - 1) ? lastNotice : null}
                        leftBookChangeHandler={leftBookChangeHandler}
                        ListDeleteHandler={ListDeleteHandler}
                        index={index}
                        setPageId={setPageId}
                        setNoticeCount={setNoticeCount}
                    />
                ))
            }
        </div>
    );
};

export default RightNotice;