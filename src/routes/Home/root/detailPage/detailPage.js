//가운데에 띄우는 화면 총괄 - 계층상 1단계

import Style from './detailPage.module.css';
import heartImg from '../heart_outline.png';
import heartImgFill from '../heart_fill.png';
import leftArrow from '../caret_left.png';
import rightArrow from '../caret_right.png';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    LoadDetailPageUrl,
    likeThisPageUrl,
    checkILikedThisPageOrComment,
    newCommentUrl,
    ReportUrl,
    deletePageUrl,
    unlikeThisPageUrl,
} from '../../../../apiUrl';
import { makeIntoArray } from '../../../../makeStringIntoArray';
import { getAxios, postAxios, deleteAxios } from '../../../../apiCall';
import { calculateTimeFrom } from '../../../../timeCalculation';

import ContentArea from '../contentArea/contentArea';
import RenderComment from './renderComment';

//모든 페이지
/* 
    댓글부르기 : pageId와 startId에 따른다 => groupId를 알게 된다
    대댓글 부르기 : pageId와 startId와 groupId를 알게 된다.
        - 각 댓글이 groupId를 가지며, 그 값은 commentList의 length와 같다.
    즉, 순차적으로 처리해서 각각의 list가 생성된다.
    댓글 부르기 트리거는 가장 하단의 댓글을 사용자가 확인했을 때이고,
    대댓글 부르기는 댓글 부르기함수가 호출된 상황 자체이다 - 호출 시 groupId가 달라진다.
*/
const DetailPage = ({pageId, refreshAccessToken, setPageId, leftBookChangeHandler, userId, resetPage, setDetailPageLikeClick, leftBookState}) => {//pageId가 -1이 되면 DetailPage가 사라진다.
    const [pageUploadUserId, setPageUploadUserId] = useState("");//page를 올린 사람의 id
    const [postedImageList, setPostedImageList] = useState([]);//올린 이미지 list
    const [postedPersonImage, setPostedPersonImage] = useState("");//올린 사람의 이미지
    const [postedPersonNickname, setPostedPersonNickname] = useState("");//올린 사람의 닉네임
    const [postedWordArray, setPostedWordArray] = useState([]);//올린 글을 실제로 보여주기 위해 처리한 문자열 배열
    const [likeNumber, setLikeNumber] = useState(0); //좋아요 개수
    const [postedTime, setPostedTime] = useState("");//업로드 시간(n분전같은 글로 저장)
    const [isLiked, setIsLiked] = useState(false);//해당 페이지를 좋아요했는지 저장
    const [likeCountVisual, setLikeCountVisual] = useState(true);//글 작성자가 해당 페이지 좋아요 개수를 보여주도록 허용했는지 아닌지 알려주는 함수
    const [imageIndex, setImageIndex] = useState(0);//보고있는 이미지의 index
    const [commentToWhom, setCommentToWhom] = useState(["p", -1, "", pageId]);//[0]은 페이지에 댓글인지 댓글에 대댓글인지(c) 표시 // [1]은 대댓글인 경우 groupId를 의미 댓글이면 -1 // [2]는 대댓글인 경우 유저의 닉네임 댓글이면 "" // [3]은 대상(comment)의 Id
    const [userCommentInput, setUserCommentInput] = useState("");//유저가 작성하고있는 댓글

    const [commentList, setCommentList] = useState([]); //업로드된 댓글
    const [commentStartId, setCommentStartId] = useState(0);//불러올 댓글의 index
    const [isLastComment, setIsLastComment] = useState(false);//마지막 댓글이 불린 경우 true로 설정
    const [lastComment, inView] = useInView();//마지막 댓글을 인식할 inView

    const [COCAddedTriger, setCOCAddedTriger] = useState(-1);//대댓글을 쓴 경우, 이 값을 대댓글이 달린 댓글의 id로 설정한다.

    const [loading, setLoading] = useState(true);

    //초기 화면 로드 - 글 내용 + 초기 댓글
    const presetDetailPage = async () => {
        if(pageId === -1) return;
        if(commentStartId !== 0) return;//초기에 댓글을 로드한 상황이 아니면 실행하지 않는다.

        const res = await getAxios(`${LoadDetailPageUrl}${pageId}/detail`, {}, refreshAccessToken);
        //기본적인 내용 초기 세팅 부분
        setPostedImageList(res.data.data.imgUrlList);
        setPageUploadUserId(res.data.data.pageDto.userDto.userId);
        setPostedPersonImage(res.data.data.pageDto.userDto.imgUrl);
        setPostedPersonNickname(res.data.data.pageDto.userDto.nickname);
        setPostedWordArray(makeIntoArray(res.data.data.pageDto.content));
        setLikeNumber(res.data.data.pageDto.likeCount);
        setLikeCountVisual(res.data.data.pageDto.likeReadAuth);
        //댓글 초기 세팅 부분
        const tmp = [...res.data.data.commentDtoList.data];
        setCommentList(tmp);
        setCommentStartId(res.data.data.commentDtoList.startId);
        //시간 연산부분
        setPostedTime(calculateTimeFrom(res.data.data.pageDto.createdDate));

        const res2 = await getAxios(`${checkILikedThisPageOrComment}?targetId=${pageId}&type=PAGE`, {}, refreshAccessToken);
        setIsLiked(res2.data.data.like);

        setLoading(false);
    };
    useEffect(() => {presetDetailPage();}, [commentStartId]);

    //댓글로드 함수 - 추가 댓글
    const presetComment = async () => {
        if(pageId === -1) return;
        const res = await getAxios(`${LoadDetailPageUrl}${pageId}/comment?startId=${commentStartId}`, {}, refreshAccessToken);
        const cur = [...commentList];//기존의 댓글 리스트
        const tmp = [...res.data.data];//불러온 댓글들
        if(tmp.length === 0){//불러온 리스트가 빈 배열인 경우 - 즉, 더 댓글이 없는 경우 : 이 경우 이후 과정이 필요 없으므로 그냥 return
            setIsLastComment(true); //더 불러올 댓글이 없다고 세팅한다. - inView에 의해 과도하게 api호출을 막기 위함
            return;
        }
        const next = cur.concat(tmp);//기존의 리스트에 불러온 댓글을 붙여넣는다
        setCommentList(next); //댓글 리스트 업데이트
        setCommentStartId(res.data.startId); // startId업데이트
    };

    //가장 하단의 댓글이 사용자에게 읽혔을 때, 댓글을 더 불러오기 위해 조건을 확인하는 함수
    const loadMoreComment = () => {
        if(!isLastComment && inView){//불러올 내용이 더 있는 경우
            presetComment();
        }
    };
    useEffect(loadMoreComment, [inView]);

    /*********************외부**********************/
    //외부 클릭 시 화면 닫기
    const closePage = (event) => {
        if(event.target.id === "outSide"){
            setPageId(-1);
        }
    }

    /*********************이미지 영역**********************/
    const leftArrowClickHandler = (event) => {
        event.preventDefault();
        if(imageIndex === 0) return;//넘어서지 않게 한다
        else setImageIndex((cur) => cur - 1);
    };

    const rightArrowClickHandler = (event) => {
        event.preventDefault();
        if(imageIndex === postedImageList.length - 1) return;//넘어서지 않게 한다
        else setImageIndex((cur) => cur + 1);
    };

    const moveImageHandler = () => {
        if(loading) return;
        document.querySelector("#onlyImageArea").style.transform = `translate(-${(imageIndex * 100) / postedImageList.length}%)`;
    };
    useEffect(moveImageHandler, [imageIndex]);

    /********************글 영역 - 유저 클릭 관련*********************/
    const pageUserClickHandler = () => {
        setPageId(-1);//현재 페이지에서 나감
        leftBookChangeHandler(`pList/${pageUploadUserId}`);//해당 유저의 페이지로 이동
    };

    /*********************글 영역 - 좋아요 관련**********************/
    //글의 좋아요 클릭 handler
    const pageLikeClickHandler = async () => {
        let url = ""
        isLiked ? url = unlikeThisPageUrl : url = likeThisPageUrl

        const sendBody = {
            targetId: pageId,
            type: "PAGE"
        };
        await postAxios(url, sendBody, {}, refreshAccessToken);
        isLiked ? setLikeNumber(cur => cur - 1) : setLikeNumber(cur => cur + 1) //임시로라도 반영
        setIsLiked((cur) => !cur);

        if(leftBookState.includes("page")){//좌측 페이지가 page들이 있는 페이지 상태라면 좋아요를 triger줘야한다.
            setDetailPageLikeClick(pageId);
        }
    };

    /*********************글 영역 - 댓글 관련**********************/
    //댓글 작성 대상 글로 변경함수
    const changeCommentToPage = (event) => {
        event.preventDefault();
        setCommentToWhom(["p", -1, ""]);
    };

    //댓글 작성 대상 변경시, placeholder변경 함수
    const changePlaceholder = () => {
        if(loading) return;
        setUserCommentInput("");
        if(commentToWhom[0] === 'p'){//댓글을 작성
            document.querySelector("#userCommentArea").placeholder = "댓글을 입력하세요...";
        }
        else{
            document.querySelector("#userCommentArea").placeholder = `${commentToWhom[2]}님에게 댓글을 남깁니다...(다시 댓글을 작성하려면 글을 클릭하세요.)`
        }
    };
    useEffect(changePlaceholder, [commentToWhom]);

    //댓글 입력 시 변경 함수
    const userCommentInputChangeHandler = (event) => {
        event.preventDefault();
        setUserCommentInput(event.target.value);
    };

    //댓글 제출 함수
    const [commentSubmitClicked, setCommentSubmitClicked] = useState(false);

    const submitAbleAgain = () => {
        setCommentSubmitClicked(false);
        const btn = document.querySelector('#CommentSubmitBtn');
        btn.innerHTML = '게시';
        btn.style.color = 'white';
        btn.style.backgroundColor = '#F4DEDE';
        btn.style.cursor = 'pointer';
        btn.disabled = false;
    };

    const userCommentSubmitHandler = (event) => {
        event.preventDefault();
        if(commentSubmitClicked) return;//이미 제출중이면 종료

        if(userCommentInput === ""){
            alert("1자 이상의 댓글을 입력해 주세요.");
            return;
        }

        setCommentSubmitClicked(true);
        const btn = document.querySelector('#CommentSubmitBtn');
        btn.innerHTML = "제출중";
        btn.style.color = 'black';
        btn.style.backgroundColor = 'gray';
        btn.style.cursor = 'wait';
        btn.disabled = true;
    };

    const userCommitSubmitHandlerSecondAction = async () => {
        if(!commentSubmitClicked) return;

        //정보를 바탕으로 댓글 작성
        const sendBody = {
            pageId: Number(pageId),
            content: userCommentInput,
            group: commentToWhom[0] === "p" ? 0 : commentToWhom[1],
            nested: !(commentToWhom[0] === "p"),
            visible: true,
        };
        await postAxios(`${newCommentUrl}${pageId}/comment`, sendBody, {}, refreshAccessToken);
        console.log("댓글 작성완료");
        setUserCommentInput("");//댓글 부분 초기화
        setCommentToWhom(["p", -1, "", pageId]);//댓글 대상 초기화
        presetComment();//댓글 내가 쓴거까지 로드된내용 불러오기
        setIsLastComment(false);//원활하게 다시 호출 되도록 세팅
        submitAbleAgain();
        if(commentToWhom[0] !== "p"){//즉, 대댓글 입력의 경우
            setCOCAddedTriger(commentToWhom[3]);
        }
    }
    useEffect(() => {userCommitSubmitHandlerSecondAction();}, [commentSubmitClicked]);

    /*****************글 영역 - 신고*********************/
    const pageReportClickHandler = async() => {
        if(window.confirm("정말 신고하시겠습니까?")){
            const sendBody = {
                targetId: pageId,
                type: "PAGE",
            };
            await postAxios(ReportUrl, sendBody, {}, refreshAccessToken);
            alert("게시글을 신고했습니다.");
        }
    };

    /******************글 영역- 삭제*********************/
    const pageDeleteClickHandler = async () => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            await deleteAxios(`${deletePageUrl}${pageId}`, {}, refreshAccessToken);
            alert("글을 삭제했습니다.");
            setPageId(-1);
            resetPage();
        }
    };

    return(
        loading ? null :
        <div className={Style.wholeCover} onClick={closePage} id="outSide">
            <div className={Style.ImageAndScriptCover}>
                <div className={Style.imageArea}>
                    {/* 이미지공간 */}
                    <div style={{overflow:"hidden"}}>
                        <div id="onlyImageArea" style={{width:`${100 * postedImageList.length}%`, height: "100%", transition: "transform 0.5s"}}>
                            {
                                postedImageList.map((data, index) =>
                                    <div style={{height: "100%", width: `${100 / postedImageList.length}%`, float: "left"}} key={index}>
                                        <img src={data} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {/* 버튼공간 */}
                    {
                        postedImageList.length === 1 ? null :
                        <div className={Style.cover}>
                            <img src={leftArrow} className={Style.arrowButton} onClick={leftArrowClickHandler}/>
                            <img src={rightArrow} className={Style.arrowButton} onClick={rightArrowClickHandler}/>
                        </div>
                    }
                </div>
                <div className={Style.ScriptArea}>
                    {/* 글 영역 */}
                    <div className={Style.pageScriptArea}>
                        <div className={Style.postPersonProfileArea}>
                            <img src={postedPersonImage} className={Style.UserImage} onClick={pageUserClickHandler}/>
                            <p className={Style.UserNickname} onClick={pageUserClickHandler}>{postedPersonNickname}</p>
                        </div>
                        <div className={Style.contentArea} onClick={changeCommentToPage}>
                            {
                                postedWordArray.map((d, index) => (
                                    <ContentArea data={d} key={index} />
                                ))
                            }
                        </div>
                        <div className={Style.likeTimeArea}>
                            <div className={Style.cover}>
                                <img src={isLiked ? heartImgFill : heartImg} className={Style.buttonImg} onClick={pageLikeClickHandler} />
                                <p className={Style.likeandCommentCount} style={{cursor: "default"}}>{likeCountVisual ? `좋아요 ${likeNumber} 개` : `좋아요 여러 개`}</p>
                                <p className={Style.likeandCommentCount} style={{cursor: "default"}}>|</p>
                                {
                                    pageUploadUserId === userId ?
                                    /* 내 글인 경우 글 삭제 기능이 있음 */
                                    <p className={Style.likeandCommentCount} onClick={pageDeleteClickHandler}>게시글 삭제</p>
                                    :
                                    /* 타인의 글인 경우 글 신고 기능이 있음 */
                                    <p className={Style.likeandCommentCount} onClick={pageReportClickHandler}>글 신고</p>
                                }
                            </div>
                            <p className={Style.time}>{postedTime}</p>
                        </div>
                    </div>
                    {/* 댓글 영역 */}
                    <div className={Style.CommentArea}>
                        {
                            commentList.map((data, index) => (
                                index === commentList.length - 1 ?
                                <RenderComment 
                                    data={data}
                                    key={index}
                                    pageId={pageId}
                                    setPageId={setPageId}
                                    lastComment={lastComment}
                                    setCommentToWhom={setCommentToWhom}
                                    refreshAccessToken={refreshAccessToken}
                                    userId={userId}
                                    presetDetailPage={presetDetailPage}
                                    setCommentStartId={setCommentStartId}
                                    setIsLastComment={setIsLastComment}
                                    setCommentList={setCommentList}
                                    leftBookChangeHandler={leftBookChangeHandler}
                                    COCAddedTriger={COCAddedTriger}
                                    setCOCAddedTriger={setCOCAddedTriger}
                                />
                                :
                                <RenderComment 
                                    data={data}
                                    key={index}
                                    pageId={pageId}
                                    setPageId={setPageId}
                                    lastComment={null}
                                    setCommentToWhom={setCommentToWhom}
                                    refreshAccessToken={refreshAccessToken}
                                    userId={userId}
                                    presetDetailPage={presetDetailPage}
                                    setCommentStartId={setCommentStartId}
                                    setIsLastComment={setIsLastComment}
                                    setCommentList={setCommentList}
                                    leftBookChangeHandler={leftBookChangeHandler}
                                    COCAddedTriger={COCAddedTriger}
                                    setCOCAddedTriger={setCOCAddedTriger}
                                />
                            ))
                        }
                    </div>
                    {/* 댓글 입력 영역 */}
                    <form className={Style.userCommentArea} onSubmit={userCommentSubmitHandler}>
                        <div className={Style.cover}>
                            <textarea 
                                id="userCommentArea"
                                type="text"
                                className={Style.userComment}
                                maxLength={200}
                                placeholder="댓글을 입력하세요..."
                                value={userCommentInput}
                                onChange={userCommentInputChangeHandler}
                                />
                        </div>
                        <div className={Style.cover}>
                            <button id="CommentSubmitBtn" type="submit" className={Style.commentSubmitBtn}>게시</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;