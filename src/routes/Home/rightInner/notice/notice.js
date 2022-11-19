import Style from './notice.module.css';
import SingleNotice from './singleNotice';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getNoticeUrl,
} from '../../../../apiUrl';
import {
    getAxios
} from '../../../../apiCall';

const RightNotice = ({leftBookChangeHandler, refreshAccessToken, setPageId, noticeCount, setNoticeCount}) => {
    const [noticeList, setNoticeList] = useState([]);
    const [lastNotice, inView] = useInView();
    const [noticeStartId, setNoticeStartId] = useState(987654321);
    const [noMoreNotice, setNomoreNotice] = useState(false);

    const [loading, setLoading] = useState(true);

    //알림 불러오는 함수
    const NoticeRead = async () => {
        const res = await getAxios(`${getNoticeUrl}${noticeStartId}`, {}, refreshAccessToken);
        setLoading(false);
        if(res.data.data.length === 0) {
            setNomoreNotice(true);
            return;
        }
        setNomoreNotice(false);
        const current = [...noticeList];
        const tmp = [...res.data.data];
        const next = current.concat(tmp);
        setNoticeList(next);
        setNoticeStartId(res.data.startId);
    };
    useEffect(() => {NoticeRead();}, [noticeCount]);//알림의 수가 달라질 때마다 부른다.

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
        loading ? null :
        <div className={Style.noticeList}>
            {
                noticeList.length === 0 ?
                <p className={Style.noNoticeScript}>도착한 알림이 없습니다.</p>
                :
                noticeList.map((data, index) =>(//마지막 요소는 last가 true이다.
                    <SingleNotice
                        notificationId={data.notificationId}//알림의 id
                        userImgUrl={data.userImgUrl}//알림의 대상의 프로필 사진
                        targetUserId={data.userId}//알림의 대상의 id
                        type={data.type}//알림의 타입
                        resourceId={data.resourceId}//근원지 (FOLLOW의 경우 null이다.)
                        checked={data.checked}//해당 알림을 확인했었는지 안했는지
                        content={data.content}
                        key={index}
                        lastNotice={index === (noticeList.length - 1) ? lastNotice : null}
                        leftBookChangeHandler={leftBookChangeHandler}
                        ListDeleteHandler={ListDeleteHandler}
                        index={index}
                        setPageId={setPageId}
                        setNoticeCount={setNoticeCount}
                        refreshAccessToken={refreshAccessToken}
                    />
                ))
            }
        </div>
    );
};

export default RightNotice;