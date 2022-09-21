import axios from 'axios';
import Style from './notice.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    getNoticeUrl,
} from '../../../../apiUrl';

const Notice = ({targetUserId, content, type, resourceId, index, ref}) => {
    return(//마지막 요소는 설정을 더해준다.
        ref === null ?//null이면 별도의 설정이 필요 없다.
        <div className={Style.noticeBlock} key={index}>
            <div className={Style.noticeCover}>
                <div className={Style.Cover}>
                    <img src={"imgUrl"} className={Style.noticeImg} />
                </div>
                <div className={Style.Cover}>
                    <p className={Style.script}>{content}</p>
                </div>
            </div>
        </div>
        ://null이 아니면 ref를 추가해준다.
        <div className={Style.noticeBlock} key={index} ref={ref}>
            <div className={Style.noticeCover}>
                <div className={Style.Cover}>
                    <img src={"imgUrl"} className={Style.noticeImg} />
                </div>
                <div className={Style.Cover}>
                    <p className={Style.script}>{content}</p>
                </div>
            </div>
        </div>
    );
};

const RightNotice = ({refreshAccessToken}) => {
    const [noticeList, setNoticeList] = useState([]);
    const [ref, inView] = useInView();
    let startId = 987654321;

    //초기설정
    const NoticeRead = () => {
        axios.get(getNoticeUrl + startId.toString())
        .then((res) => {
            const current = [...noticeList];
            const tmp = [...res.data.data];
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
                    <Notice targetUserId={data.targetUserId} content={data.content} type={data.type} resourceId={data.resourceId} index={index} ref={ref}/>
                    :
                    <Notice targetUserId={data.targetUserId} content={data.content} type={data.type} resourceId={data.resourceId} index={index} ref={null}/>
                ))
            }
        </div>
    );
};

export default RightNotice;