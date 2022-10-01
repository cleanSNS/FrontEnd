//피드 여러개 띄우는 화면
import { useState, useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import moreStuff from './moreStuff.png';
import leftArrow from './caret_left.png';
import rightArrow from './caret_right.png'
import heartBtn from './heart_outline.png';
import heartFillBtn from './heart_fill.png';
import axios from 'axios';
import Style from './page.module.css';
import {
    pageloadUrl,
} from "../../../../apiUrl";

const Pages = ({pageList, lastPage}) => {
    return(
        <div className={Style.pageListArea}>
            {
                pageList.map((data, index) => (
                    <div className={Style.singlePageCover} key={index} ref={index === (pageList.length - 1) ? lastPage : null}>
                        {/* 프로필 영역 */}
                        <div className={Style.profileArea}>
                            <div className={Style.flexBoxCenter}>
                                <img src={data.pageDto.userDto.imgUrl} className={Style.profileImage} />
                            </div>
                            <div className={Style.flexBoxStart}>
                                <p className={Style.profileNickname}>{data.pageDto.userDto.nickname}</p>
                            </div>
                            <div className={Style.flexBoxCenter}>
                                <img src={moreStuff} className={Style.profileSetting} />
                            </div>
                        </div>
                        {/* 이미지 영역 */}
                        <div className={Style.imageArea}>
                            <div className={Style.onlyImageArea}>

                            </div>
                            <div className={Style.ImageBtnArea}>
                                <img src={leftArrow} className={Style.ImageChangeBtn} />
                                <img src={rightArrow} className={Style.ImageChangeBtn} />
                            </div>
                        </div>
                        {/* 아래 좋아요랑 글 영역 */}
                        <div className={Style.pageLikeAndContentArea}>
                            <div className={Style.pagelikearea}>
                                <img src={heartBtn} className={Style.pageLikeBtn} />
                            </div>
                            <div className={Style.pageContentArea}>
                                <p className={Style.pageContent}>{data.pageDto.content}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}


const LeftPage = ({refreshAccessToken}) => {
    const [pageStartId, setPageStartId] = useState(987654321);//글 리스트의 startId
    const [pageList, setPageList] = useState([
        {
            "pageDto": {
                "userDto": {
                    "userId": 1,
                    "nickname": "홍길동",
                    "imgUrl": null
                },
                "pageId": 2,
                "content": "내용2ㄻㄴㅇ리타퍼ㅣㅏ멎ㄷ;ㅐ랴;ㅂ잭푸ㅐㄴㅇ랴;퍼ㅣㅁㄷ구ㅡ피ㅏㅡㄴ이라ㅓㅏㅣㅁㄴㅇㄻㄴㅇㄻㄴㅇㄹ",
                "likeCount": 0,
				"likeReadAuth": false,
                "createdDate": null
            },
            "imgUrlList": []
        },
        {
            "pageDto": {
                "userDto": {
                    "userId": 1,
                    "nickname": "홍길동",
                    "imgUrl": null
                },
                "pageId": 1,
                "content": "내용1ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄼㅈㄷㄱㅂㅈㄷㄱㅂㅈㄷㄱㅂㅈㄷㄱㅂㅈㄷㄱ",
                "likeCount": 0,
				"likeReadAuth": true,
                "createdDate": null
            },
            "imgUrlList": []
        },
        {
            "pageDto": {
                "userDto": {
                    "userId": 1,
                    "nickname": "홍길동",
                    "imgUrl": null
                },
                "pageId": 1,
                "content": "내용3ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻsdㄴㅇㄼㅈㄷㄱㅂㅈㄷㄱㅂㅈㄷㄱㅂㅈㄷㄱㅂㅈㄷㄱ",
                "likeCount": 0,
				"likeReadAuth": true,
                "createdDate": null
            },
            "imgUrlList": []
        }
    ]); //글 리스트
    const [lastPage, inView] = useInView(); //이게 ref된 요소가 화면에 보이면 inView가 true로 변경
    const [isLoadFinish, setIsLoadFinish] = useState(false);//false면 더 이상 로드할 내용이 남은 경우, true면 로드할 내용이 더 없는 경우이다.

    //게시글 로드 함수
    const loadPageListFunc = () => {
        axios.get(`${pageloadUrl}?startId=${pageStartId}`)
        .then((res) => {
            const cur = [...pageList];
            const tmp = [res.data.data];
            if(tmp.length === 0){
                setIsLoadFinish(true);//더 이상 글이 없는 경우이다.
                return;
            }
            const next = cur.concat(tmp);
            setPageList(next);
            setPageStartId(res.data.startId);
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("글을 로드해 오지 못했습니다.");
            }
        });
    };
    useEffect(loadPageListFunc, []);//초기 상황에서 로드

    //화면의 마지막이 읽히면 조건을 확인해서 글을 로드하는 함수
    const loadMorePageFunc = () => {
        if(!isLoadFinish && inView){
            loadPageListFunc();
        }
    };
    useEffect(loadMorePageFunc, [inView]);

    return(
        <div className={Style.wholeCover}>
            <Pages pageList={pageList} lastPage={lastPage}/>
        </div>
    );
}

export default LeftPage;