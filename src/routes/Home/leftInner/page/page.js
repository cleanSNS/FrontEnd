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

const ImageArea = ({imgList, pageIndex}) => {
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
            <div className={Style.onlyImageArea}>
                <div style={{overflow:"hidden"}}>
                    <div id={`onlyImageArea_${pageIndex}`} style={{width:`${100 * imgList.length}%`, height: "100%", transition: "transform 0.5s"}}>
                        {
                            imgList.map((imageUrl, index) =>
                                <div style={{height: "100%", width: `${100 / imgList.length}%`, float: "left"}} key={index}>
                                    <img src={imageUrl} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
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

const Pages = ({pageList, lastPage}) => {
    return(
        <div className={Style.pageListArea}>
            {
                pageList.length === 0 ?
                <p className={Style.noPageText}>글이 존재하지 않습니다.. 너무도 조용합니다..</p>
                :
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
                        <ImageArea imgList={data.imgUrlList} pageIndex={index}/>
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
};

const LeftPage = ({refreshAccessToken, leftBookState}) => {
    const [pageStartId, setPageStartId] = useState(987654321);//글 리스트의 startId
    const [pageList, setPageList] = useState([]); //글 리스트
    const [lastPage, inView] = useInView(); //이게 ref된 요소가 화면에 보이면 inView가 true로 변경
    const [isLoadFinish, setIsLoadFinish] = useState(false);//false면 더 이상 로드할 내용이 남은 경우, true면 로드할 내용이 더 없는 경우이다.
    const [hashtagFilter, setHashtagFilter] = useState(leftBookState.split('/')[1]);//그냥 리스트면 undefined고, 뭐가 들어있으면 그 값이 들어있다.

    //hashtag변경함수 - 이게 트리거가 되어 page들을 불러온다.
    const setHashtagFilterFunc = () => {
        if(leftBookState.split('/')[1] === undefined){
            setHashtagFilter("");
        }
        else{
            setHashtagFilter(leftBookState.split('/')[1]);
        }
    };
    useEffect(setHashtagFilterFunc, [leftBookState]);

    //게시글 로드 함수 <---------------------------------------------hashtagFilter에 따라 여기 다르게 해야함
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
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("글을 로드해 오지 못했습니다.");
            }
        });
    };
    useEffect(loadPageListFunc, [hashtagFilter]);

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