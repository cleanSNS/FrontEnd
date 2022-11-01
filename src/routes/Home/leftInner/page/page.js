//피드 여러개 띄우는 화면
import { useState, useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import ContentArea from '../../root/contentArea';
import moreStuff from './moreStuff.png';
import leftArrow from './caret_left.png';
import rightArrow from './caret_right.png'
import heartBtn from './heart_outline.png';
import heartFillBtn from './heart_fill.png';
import axios from 'axios';
import Style from './page.module.css';
import {
    pageloadUrl,
    likeThisPageUrl,
    unlikeThisPageUrl,
} from "../../../../apiUrl";
import {
    makeIntoArray
} from "../../../../makeStringIntoArray";

const ImageArea = ({imgList, pageIndex, pageClickFunc}) => {
    const [imageIndex, setImageIndex] = useState(0);//보고있는 이미지의 index

    /* 이미지 영역 */
    const leftArrowClickHandler = (event) => {
        event.preventDefault();
        if(imageIndex === 0) return;//넘어서지 않게 한다
        else setImageIndex((cur) => cur - 1);
    };

    const rightArrowClickHandler = (event) => {
        event.preventDefault();
        if(imageIndex === imgList.length - 1) return;//넘어서지 않게 한다
        else setImageIndex((cur) => cur + 1);
    };

    const moveImageHandler = () => {
        document.querySelector(`#onlyImageArea_${pageIndex}`).style.transform = `translate(-${(imageIndex * 100) / imgList.length}%)`;
    };
    useEffect(moveImageHandler, [imageIndex]);

    return(
        <div className={Style.imageArea}>
            <div className={Style.onlyImageArea} onClick={pageClickFunc}>
                <div style={{overflow:"hidden"}}>
                    <div id={`onlyImageArea_${pageIndex}`} style={{width:`${100 * imgList.length}%`, height: "100%", transition: "transform 0.5s"}}>
                        {
                            imgList.map((imageUrl, index) =>
                                <div style={{height: "100%", width: `${100 / imgList.length}%`, float: "left"}} key={index}>
                                    <img src={imageUrl} style={{width: "100%", height: "100%", objectFit: "contain", cursor: "pointer"}}/>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={Style.ImageBtnArea}>
                {
                    imgList.length === 1 ?
                    null
                    :
                    <div className={Style.flexBoxCenter}>
                        <img id={`leftArrow_${pageIndex}`} src={leftArrow} className={Style.ImageChangeBtn} onClick={leftArrowClickHandler}/>
                        <img id={`rightArrow_${pageIndex}`} src={rightArrow} className={Style.ImageChangeBtn} onClick={rightArrowClickHandler}/>
                    </div>
                }
            </div>
        </div>
    );
};

const Pages = ({data, lastPage, index, setPageId, setLeftBookState, refreshAccessToken, detailPageLikeClick, setDetailPageLikeClick}) => {
    const [isLiked, setIsLiked] = useState(false);//좋아요 여부
    const [likeCount, setLikeCount] = useState(0);//좋아요 개수
    const [contentArray, setContentArray] = useState([]);

    const pageClickFunc = () => {
        setPageId(data.pageDto.pageId);
    };

    const userProfileClickHandler = () => {
        setLeftBookState(`pList/${data.pageDto.userDto.userId}`);
    };

    //좋아요 초기 설정
    useEffect(() => {
        setLikeCount(data.pageDto.likeCount);//좋아요 개수 불러오기
        setIsLiked(data.like);//좋아요 여부 불러오기
        setContentArray(makeIntoArray(data.pageDto.content));//받은 글을 객체로 변경
    }, [])

    //좋아요 클릭 handler
    const likeClickHandler = () => {
        let url = ""
        isLiked ? url = unlikeThisPageUrl : url = likeThisPageUrl

        axios.post(url, {
            targetId: data.pageDto.pageId,
            type: "PAGE"
        })
        .then((res) => {
            isLiked ? setLikeCount(cur => cur - 1) : setLikeCount(cur => cur + 1) //임시로라도 반영
            setIsLiked((cur) => !cur);
            console.log("페이지에 좋아요혹은 좋아요 취소했습니다.");
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){
                refreshAccessToken();
                setTimeout(likeClickHandler, 1000);
            }
            else{
                console.log(res);
                alert("좋아요정보를 보내지 못했습니다.");
            }
        });
    };

    //detailpage에서 클릭 시 어떤 페이지를 클릭했는지 확인하고, 그 페이지의 좋아요 여부를 반영 - api호출은 이미 했으므로 할 필요 없다.
    useEffect(() => {
        if(detailPageLikeClick !== data.pageDto.pageId) return;//초기 상황도 -1이므로 동시에 잡을 수 있다.

        isLiked ? setLikeCount(cur => cur - 1) : setLikeCount(cur => cur + 1) //임시로라도 반영
        setIsLiked((cur) => !cur);
        console.log("detailpage에서 클릭한 여부를 반영했습니다.");
        setDetailPageLikeClick(-1);//다시 초기화한다.

    }, [detailPageLikeClick]);

    return(
        <div className={Style.singlePageCover} ref={lastPage}>
            {/* 프로필 영역 */}
            <div className={Style.profileArea}>
                <div className={Style.flexBoxCenter}>
                    <img src={data.pageDto.userDto.imgUrl} className={Style.profileImage} onClick={userProfileClickHandler}/>
                </div>
                <div className={Style.flexBoxStart}>
                    <p className={Style.profileNickname} onClick={userProfileClickHandler}>{data.pageDto.userDto.nickname}</p>
                </div>
            </div>
            {/* 이미지 영역 */}
            <ImageArea imgList={data.imgUrlList} pageIndex={index} pageClickFunc={pageClickFunc}/>
            {/* 아래 좋아요랑 글 영역 */}
            <div className={Style.pageLikeAndContentArea}>
                <div className={Style.pagelikearea}>
                    <img src={isLiked ? heartFillBtn : heartBtn} className={Style.pageLikeBtn} onClick={likeClickHandler}/>
                    <p style={{margin: "0"}}>{data.pageDto.likeReadAuth ? `좋아요 ${likeCount} 개` : `좋아요 여러 개`}</p>
                </div>
                <div className={Style.pageContentArea} onClick={pageClickFunc}>
                    {
                        contentArray.map((d, index) => (
                            <ContentArea data={d} key={index}/>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

const LeftPage = ({refreshAccessToken, leftBookState, setPageId, detailPageLikeClick, setDetailPageLikeClick, setLeftBookState}) => {
    const [pageStartId, setPageStartId] = useState(987654321);//글 리스트의 startId
    const [pageList, setPageList] = useState([//테스트 후 비우기
        {
            "pageDto": {
                "userDto": {
                    "userId": 2,
                    "nickname": "min",
                    "imgUrl": "https://cleanbook-bucket.s3.ap-northeast-2.amazonaws.com/page/0d835296-1538-48f9-a56d-a1a6cbb0bfd5.jpeg"
                },
                "pageId": 1,
                "content": "!모자이크!!모자이크! 자 이제 다른 곳으로 들어가도 이상한지 안 이상한지 확인해보자!\n!모자이크! 겁나 시간 없다 !모자이크!!모자이크! !모자이크!",
                "likeCount": 1,
                "likeReadAuth": true,
                "createdDate": "2022-10-01T19:05:57.278163"
            },
            "imgUrlList": [
                "https://cleanbook-bucket.s3.ap-northeast-2.amazonaws.com/page/0d835296-1538-48f9-a56d-a1a6cbb0bfd5.jpeg",
                "https://cleanbook-bucket.s3.ap-northeast-2.amazonaws.com/page/3fdced7f-c7af-4f70-9830-acbc6dd89dde.jpg"
            ],
            "like": true
        }
    ]); //글 리스트
    const [lastPage, inView] = useInView(); //이게 ref된 요소가 화면에 보이면 inView가 true로 변경
    const [isLoadFinish, setIsLoadFinish] = useState(false);//false면 더 이상 로드할 내용이 남은 경우, true면 로드할 내용이 더 없는 경우이다.

    //게시글 로드 함수
    const loadPageListFunc = () => {
        axios.get(`${pageloadUrl}?startId=${pageStartId}`)
        .then((res) => {
            const cur = [...pageList];
            const tmp = [...res.data.data];
            if(tmp.length === 0){
                setIsLoadFinish(true);//더 이상 글이 없는 경우이다.
                return;
            }
            const next = cur.concat(tmp);
            setPageList(next);
            setPageStartId(res.data.startId);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){
                refreshAccessToken();
                setTimeout(loadPageListFunc, 1000);
            }
            else{
                console.log(res);
                alert("글을 로드해 오지 못했습니다.");
            }
        });
    };
    useEffect(loadPageListFunc, [leftBookState]);//state가 바뀌면 다시 load

    //화면의 마지막이 읽히면 조건을 확인해서 글을 로드하는 함수
    const loadMorePageFunc = () => {
        if(!isLoadFinish && inView){
            loadPageListFunc();
        }
    };
    useEffect(loadMorePageFunc, [inView]);

    return(
        <div className={Style.wholeCover}>
            <div className={Style.pageListArea}>
                {
                    pageList.length === 0 ?
                    <p className={Style.noPageText}>글이 존재하지 않습니다.. 너무도 조용합니다..</p>
                    :
                    pageList.map((data, index) => (
                        index === (pageList.length - 1) ?
                        <Pages 
                            data={data}
                            key={index}
                            index={index} 
                            lastPage={lastPage}
                            setPageId={setPageId}
                            setLeftBookState={setLeftBookState}
                            refreshAccessToken={refreshAccessToken}
                            detailPageLikeClick={detailPageLikeClick}
                            setDetailPageLikeClick={setDetailPageLikeClick}
                        />
                        :
                        <Pages 
                            data={data}
                            key={index}
                            index={index} 
                            lastPage={null}
                            setPageId={setPageId}
                            setLeftBookState={setLeftBookState}
                            refreshAccessToken={refreshAccessToken}
                            detailPageLikeClick={detailPageLikeClick}
                            setDetailPageLikeClick={setDetailPageLikeClick}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default LeftPage;