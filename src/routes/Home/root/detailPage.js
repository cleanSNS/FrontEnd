//가운데에 띄우는 화면
import Style from './detailPage.module.css';
import heartImg from './heart_outline.png';
import heartImgFill from './heart_fill.png';
import leftArrow from './caret_left.png';
import rightArrow from './caret_right.png';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    LoadDetailPageUrl,
    likeThisPageUrl,
    checkILikedThisPageOrComment,
    newCommentUrl,
    ReportUrl,
    deleteCommentUrl,
    deletePageUrl,
    unlikeThisPageUrl,
    checkLikeUrl,
    getCommentOFCommentNumberUrl,
} from './../../../apiUrl';
import axios from 'axios';
import { Temporal } from '@js-temporal/polyfill';

//시간 계산 함수
/** claTime: 업로드된 시간. output: 안에 들어갈 문자열  */
const calculateTimeFrom = (calTime) => {
    const now = Temporal.Now.plainDateTimeISO();//현재 시간 세팅
    let postedDate = Temporal.PlainDateTime.from(calTime);
    postedDate = postedDate.add({hours: 9});
    const result = now.since(postedDate);
    if(result.minutes === 0){//0분이내인 경우
        return "방금 전";
    }
    else if(result.hours === 0){//1시간보다는 아래인 경우
        return `${result.minutes}분 전`;
    }
    else if(result.days === 0){//1일보다는 아래인 경우
        return `${result.hours}시간 전`;
    }
    else if(result.months === 0){//1달보다는 아래인 경우
        return `${result.days}일 전`;
    }
    else if(result.years === 0){//1년보다는 아래인 경우
        return `${result.months}달 전`;
    }
    else{//1년 이상인 경우
        return `${result.years}년 전`;
    }
};

//대댓글 부분
const SingleCommentOfComment = ({data, lastCommentOfComment, setPageId, userId, groupId, refreshAccessToken, pageId, leftBookChangeHandler, setToggle, setCommentOfCommentList, setCommentOfCommentStartId, setIsLastCommentOfComment, commentId, getCOCCount}) => {
    const [COCIsLiked, setCOCIsLiked] = useState(false);//대댓글 좋아요 여부
    const [COCLikeCount, setCOCLikeCount] = useState(0);//대댓글 좋아요 개수

    const CommentofCommentUserClickHandler = () => {
        setPageId(-1);//현재 페이지에서 나감
        leftBookChangeHandler(`pList/${data.userDto.userId}`);//해당 유저의 페이지로 이동
    };

    //신고 클릭함수
    const COCreportClickHandler = () => {
        if(window.confirm("정말 신고하시겠습니까?")){//다시 한 번 물어보고 실행
            axios.post(ReportUrl, {
                targetId: data.commentId,
                type: "COMMENT",
            })
            .then((res) => {
                alert("신고가 접수되었습니다.");
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("신고하지 못했습니다.");
                }
            });
        }
    };
    
    //삭제 클릭 함수
    const COCdeleteClickHandler = () => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.delete(`${deleteCommentUrl}${pageId}/comment/${data.commentId}`)
            .then((res) => {
                alert("삭제되었습니다.");
                setCommentOfCommentStartId(1)//대댓글 startId 초기화
                setIsLastCommentOfComment(false)//대댓글 lastcomment fasle
                setToggle(false)//토글 값 강제로 false로
                setCommentOfCommentList([])//대댓글 지우기

                getCOCCount(pageId, commentId);
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("삭제하지 못했습니다.");
                }
            })
        }
    };

    //초기에 좋아요 관련 정보 불러오기
    useEffect(() => {
        setCOCLikeCount(data.likeCount);
        axios.get(`${checkLikeUrl}?targetId=${data.commentId}&type=COMMENT`)
        .then((res) => {
            setCOCIsLiked(res.data.data.like);
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("삭제하지 못했습니다.");
            }
        });
    }, []);

    //좋아요 clickhandler
    const CommentOfCommentLikeHandler = () => {
        let url = ""
        COCIsLiked ? url = unlikeThisPageUrl : url = likeThisPageUrl

        axios.post(url, {
            targetId: data.commentId,
            type: "COMMENT"
        })
        .then((res) => {
            COCIsLiked ? setCOCLikeCount(cur => cur - 1) : setCOCLikeCount(cur => cur + 1) //임시로라도 반영
            setCOCIsLiked((cur) => !cur);
            console.log("페이지에 좋아요혹은 좋아요 취소했습니다.");
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("좋아요정보를 보내지 못했습니다.");
            }
        });
    }

    return(
        <div className={Style.CommentBox} style={{width:"80%"}} ref={lastCommentOfComment}>
            <div className={Style.CommentProfileArea}>
                <img src={data.userDto.imgUrl} className={Style.UserImage} onClick={CommentofCommentUserClickHandler}/>
                <p className={Style.UserNickname} onClick={CommentofCommentUserClickHandler}>{data.userDto.nickname}</p>
            </div>
            <p className={Style.commentText}>{data.content}</p>
            <div className={Style.likeTimeArea}>
                <div className={Style.cover}>
                    <img src={COCIsLiked ? heartImgFill : heartImg} className={Style.buttonImg} onClick={CommentOfCommentLikeHandler}/>
                    <p className={Style.likeandCommentCount} style={{cursor: "default"}}>{`좋아요${COCLikeCount}개`}</p>
                    <p className={Style.likeandCommentCount} style={{cursor: "default"}}>|</p>
                    {
                        userId === data.userDto.userId ?
                        /* 내 댓글인 경우 삭제 가능 */
                        <p className={Style.likeandCommentCount} onClick={COCdeleteClickHandler}>댓글 삭제</p>
                        :
                        /* 남의 댓글인 경우 신고 가능 */
                        <p className={Style.likeandCommentCount} onClick={COCreportClickHandler}>댓글 신고하기</p>
                    }
                </div>
                <p className={Style.time}>{calculateTimeFrom(data.createdDate)}</p>
            </div>
        </div>
    )
};

//대댓글 toggle과 불러오는 부분
const RenderCommentOfComment = ({pageId, groupId, setPageId, setLoadCommentOfComment, loadCommentOfComment, refreshAccessToken, userId, leftBookChangeHandler, commentId, getCOCCount}) => {
    const [toggle, setToggle] = useState(false);//대댓글을 보여주는 toggle이다.
    const [commentOfCommentList, setCommentOfCommentList] = useState([]);//대댓글 리스트
    const [commentOfCommentStartId, setCommentOfCommentStartId] = useState(1);//첫 로드시에는 1이온다.
    const [isLastCommentOfComment, setIsLastCommentOfComment] = useState(false);//마지막 요소가 읽어들여지면 true로 세팅해서 inview로 인해 더이상 로드가 안되게 한다.
    const [lastCommentOfComment, InView] = useInView();//마지막 대댓글에 넣는다. 이게 보이면 대댓글을 추가로 요청한다.

    //대댓글 활성화하고 비활성화 하는 함수
    const setToggleFunc = () => {
        if(groupId === loadCommentOfComment){
            setToggle((cur) => !cur);
            setLoadCommentOfComment(0);//다시 초기 상태로
            setCommentOfCommentList([]);//다시 초기 상태로
            setCommentOfCommentStartId(1);//다시 초기 상태로
        }
    }
    useEffect(setToggleFunc, [loadCommentOfComment]);

    //toggle이되고, 그 값이 true면 그 그룹에 해당하는 대댓글을 불러와야한다.
    const loadThisCommentOfComment = () => {
        if(toggle){
            axios.get(`${LoadDetailPageUrl}${pageId}/nested?group=${groupId}&startId=${commentOfCommentStartId}`)
            .then((res) => {
                const tmp = [...res.data.data];
                if(tmp.length === 0){
                    setIsLastCommentOfComment(true);
                    return;//이후의 작업은 불필요하다.
                }
                const cur = [...commentOfCommentList];
                const next = cur.concat(tmp);
                setCommentOfCommentList(next);
                setCommentOfCommentStartId(res.data.startId);
            })
            .catch((res) =>{
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("대댓글을 불러오지 못했습니다.");
                }
            });
        }
    };
    useEffect(loadThisCommentOfComment, [toggle]);

    //맨 아래 요소가 보이면 대댓글을 부른다.
    const lastCommentOfCommentSeen = () => {
        if(!isLastCommentOfComment && InView){//false일 때도 call된다. true일 때만 실제로 로드한다 + 실제로 마지막 댓글이 이미 로드 된 상황이면 로드하지 않는다.
            loadThisCommentOfComment();
        }
    };
    useEffect(lastCommentOfCommentSeen, [InView]);

    return (
        toggle ?
            commentOfCommentList === undefined ?
            null
            :
            commentOfCommentList.map((data, index) =>
                index === (commentOfCommentList.length - 1) ?
                <SingleCommentOfComment 
                    data={data}
                    key={index}
                    lastCommentOfComment={lastCommentOfComment}
                    leftBookChangeHandler={leftBookChangeHandler}
                    setPageId={setPageId}
                    userId={userId}
                    pageId={pageId}
                    groupId={groupId}
                    refreshAccessToken={refreshAccessToken}
                    setToggle={setToggle}
                    setCommentOfCommentList={setCommentOfCommentList}
                    setCommentOfCommentStartId={setCommentOfCommentStartId}
                    setIsLastCommentOfComment={setIsLastCommentOfComment}
                    commentId={commentId}
                    getCOCCount={getCOCCount}
                />
                :
                <SingleCommentOfComment 
                    data={data}
                    key={index}
                    lastCommentOfComment={null}
                    leftBookChangeHandler={leftBookChangeHandler}
                    setPageId={setPageId}
                    userId={userId}
                    pageId={pageId}
                    groupId={groupId}
                    refreshAccessToken={refreshAccessToken}
                    setToggle={setToggle}
                    setCommentOfCommentList={setCommentOfCommentList}
                    setCommentOfCommentStartId={setCommentOfCommentStartId}
                    setIsLastCommentOfComment={setIsLastCommentOfComment}
                    commentId={commentId}
                    getCOCCount={getCOCCount}
                />
            )
        : null
    );
}

//댓글
const RenderComment = ({data, pageId, lastComment, setCommentToWhom, refreshAccessToken, userId, setCommentStartId, setIsLastComment, setCommentList, setPageId, leftBookChangeHandler, COCCount, setCOCCount, getCOCCount}) => {
    const [loadCommentOfComment, setLoadCommentOfComment] = useState(0);//대댓글 켜는 버튼
    const [CIsLiked, setCIsLiked] = useState(false);//댓글이 좋아요 된 상태인지
    const [CLikeCount, setCLikeCount] = useState(0);//댓글 좋아요 개수

    useEffect(() => {
        setCOCCount(data.nestedCommentCount);
    }, []);//초기에 대댓글의 수를 넣어둔다.

    //대댓글을 켜는 함수
    const onLoadCommentOfCommentClickHandler = (event) => {
        event.preventDefault();
        if(event.target.innerText === "답글 닫기"){
            event.target.innerText = `답글 (${COCCount})개`;
        }
        else{
            event.target.innerText = "답글 닫기";
        }
        setLoadCommentOfComment(Number(data.group));
    };

    //신고 클릭함수
    const reportClickHandler = () => {
        if(window.confirm("정말 신고하시겠습니까?")){//다시 한 번 물어보고 실행
            axios.post(ReportUrl, {
                targetId: data.commentId,
                type: "COMMENT",
            })
            .then((res) => {
                alert("신고가 접수되었습니다.");
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("신고하지 못했습니다.");
                }
            });
        }
    }

    //삭제 클릭 함수
    const deleteClickHandler = () => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.delete(`${deleteCommentUrl}${pageId}/comment/${data.commentId}`)
            .then((res) => {
                alert("삭제되었습니다.");
                setCommentStartId(0);//다시 로드되도록 초기값으로 설정
                setIsLastComment(false);//원활한 로드를 위해 설정
                setCommentList([]);//지금까지 로드된 댓글 지우기
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("삭제하지 못했습니다.");
                }
            })
        }
    };

    //댓글에 유저 클릭 함수
    const commentUserClickHandler = () => {
        setPageId(-1);//현재 페이지에서 나감
        leftBookChangeHandler(`pList/${data.userDto.userId}`);//해당 유저의 페이지로 이동
    };

    /*************************상위 요소 전달용 함수들*****************************/
    //댓글에 대댓글을 달 수 있도록 변경하는 함수
    const changeCommentToComment = (event) => {
        event.preventDefault();
        setCommentToWhom(["c", data.group, data.userDto.nickname, data.commentId]);
    };

    /********************************좋아요 관련************************************/
    //먼저 댓글이 로드될 때마다 해당 댓글에 좋아요를 눌렀었는지 반영해야한다.
    useEffect(() => {
        setCLikeCount(data.likeCount);
        axios.get(`${checkLikeUrl}?targetId=${data.commentId}&type=COMMENT`)
        .then((res) => {
            setCIsLiked(res.data.data.like);
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("삭제하지 못했습니다.");
            }
        });
    }, []);

    //좋아요 클릭 handler
    const CommentLikeClickHandler = (event) => {
        let url = ""
        CIsLiked ? url = unlikeThisPageUrl : url = likeThisPageUrl

        axios.post(url, {
            targetId: data.commentId,
            type: "COMMENT"
        })
        .then((res) => {
            CIsLiked ? setCLikeCount(cur => cur - 1) : setCLikeCount(cur => cur + 1) //임시로라도 반영
            setCIsLiked((cur) => !cur);
            console.log("페이지에 좋아요혹은 좋아요 취소했습니다.");
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("좋아요정보를 보내지 못했습니다.");
            }
        });
    };

    return(
            <div className={Style.singleCommentArea} ref={lastComment}>
                <div className={Style.CommentBox} style={{width:"100%"}}>
                    <div className={Style.CommentProfileArea}>
                        <img src={data.userDto.imgUrl} className={Style.UserImage} onClick={commentUserClickHandler}/>
                        <p className={Style.UserNickname} onClick={commentUserClickHandler}>{data.userDto.nickname}</p>
                    </div>
                    <pre className={Style.commentText} style={{cursor: "pointer"}} onClick={changeCommentToComment}>{data.content}</pre>
                    <div className={Style.likeTimeArea}>
                        <div className={Style.cover}>
                            <img src={CIsLiked ? heartImgFill : heartImg} className={Style.buttonImg} onClick={CommentLikeClickHandler}/>
                            <p className={Style.likeandCommentCount} style={{cursor: "default"}}>{`좋아요 ${CLikeCount}개`}</p>
                            {
                                data.nestedCommentCount === 0 ?
                                null : <p className={Style.likeandCommentCount} style={{cursor: "default"}}>|</p>
                            }
                            {
                                data.nestedCommentCount === 0 ?
                                null : <p className={Style.likeandCommentCount} onClick={onLoadCommentOfCommentClickHandler} id={`comment_${data.group}`}>{`답글 (${COCCount})개`}</p>
                            }
                            <p className={Style.likeandCommentCount} style={{cursor: "default"}}>|</p>
                            {
                                userId === data.userDto.userId ?
                                /* 내 댓글인 경우 수정, 삭제 가능 */
                                <p className={Style.likeandCommentCount} onClick={deleteClickHandler}>댓글 삭제</p>
                                :
                                /* 남의 댓글인 경우 신고 가능 */
                                <p className={Style.likeandCommentCount} onClick={reportClickHandler}>댓글 신고하기</p>
                            }
                        </div>
                        <p className={Style.time}>{calculateTimeFrom(data.createdDate)}</p>
                    </div>
                </div>
                <RenderCommentOfComment 
                    pageId={pageId} 
                    groupId={data.group}
                    commentId={data.commentId}
                    getCOCCount={getCOCCount}
                    setLoadCommentOfComment={setLoadCommentOfComment} 
                    loadCommentOfComment={loadCommentOfComment} 
                    refreshAccessToken={refreshAccessToken} 
                    reportClickHandler={reportClickHandler} 
                    userId={userId} 
                    deleteClickHandler={deleteClickHandler}
                    leftBookChangeHandler={leftBookChangeHandler}
                    setPageId={setPageId}
                />
            </div>
    );
};

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
    const [postedWord, setPostedWord] = useState(""); //올린 글의 내용
    const [likeNumber, setLikeNumber] = useState(0); //좋아요 개수
    const [postedTime, setPostedTime] = useState("");//업로드 시간(n분전같은 글로 저장)
    const [isLiked, setIsLiked] = useState(false);//해당 페이지를 좋아요했는지 저장
    const [likeCountVisual, setLikeCountVisual] = useState(true);//글 작성자가 해당 페이지 좋아요 개수를 보여주도록 허용했는지 아닌지 알려주는 함수
    const [imageIndex, setImageIndex] = useState(0);//보고있는 이미지의 index
    const [commentToWhom, setCommentToWhom] = useState(["p", -1, "", pageId]);//[0]은 페이지에 댓글인지 댓글에 대댓글인지(c) 표시 // [1]은 대댓글인 경우 groupId를 의미 댓글이면 -1 // [2]는 대댓글인 경우 유저의 닉네임 댓글이면 "" // [3]은 대상의 Id
    const [userCommentInput, setUserCommentInput] = useState("");//유저가 작성하고있는 댓글

    const [commentList, setCommentList] = useState([]); //업로드된 댓글
    const [commentStartId, setCommentStartId] = useState(0);//불러올 댓글의 index
    const [isLastComment, setIsLastComment] = useState(false);//마지막 댓글이 불린 경우 true로 설정
    const [lastComment, inView] = useInView();//마지막 댓글을 인식할 inView

    /*********************초기 화면 세팅**********************/
    //초기 화면 로드 - 글 내용 + 초기 댓글
    const presetDetailPage = () => {
        if(pageId === -1) return;
        if(commentStartId !== 0) return;//초기에 댓글을 로드한 상황이 아니면 실행하지 않는다.

        axios.get(`${LoadDetailPageUrl}${pageId}/detail`)//글 불러오기
        .then((res) => {
            setPostedImageList(res.data.data.imgUrlList);
            setPageUploadUserId(res.data.data.pageDto.userDto.userId);
            setPostedPersonImage(res.data.data.pageDto.userDto.imgUrl);
            setPostedPersonNickname(res.data.data.pageDto.userDto.nickname);
            setPostedWord(res.data.data.pageDto.content);
            setLikeNumber(res.data.data.pageDto.likeCount);
            setLikeCountVisual(res.data.data.pageDto.likeReadAuth);

            //댓글 초기 세팅 부분
            const tmp = [...res.data.data.commentDtoList.data];
            setCommentList(tmp);
            setCommentStartId(res.data.data.commentDtoList.startId);

            //시간 연산부분
            setPostedTime(calculateTimeFrom(res.data.data.pageDto.createdDate));
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("글을 불러오지 못했습니다.");
            }
        });

        axios.get(`${checkILikedThisPageOrComment}?targetId=${pageId}&type=PAGE`)//좋아요 여부 불러오기
        .then((res) => {
            setIsLiked(res.data.data.like);
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("좋아요 여부를 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetDetailPage, [commentStartId]);

    //댓글로드 함수 - 추가 댓글
    const presetComment = () => {
        if(pageId === -1) return;
        axios.get(`${LoadDetailPageUrl}${pageId}/comment?startId=${commentStartId}`)
        .then((res) => {
            const cur = [...commentList];//기존의 댓글 리스트
            const tmp = [...res.data.data];//불러온 댓글들
            if(tmp.length === 0){//불러온 리스트가 빈 배열인 경우 - 즉, 더 댓글이 없는 경우 : 이 경우 이후 과정이 필요 없으므로 그냥 return
                setIsLastComment(true); //더 불러올 댓글이 없다고 세팅한다. - inView에 의해 과도하게 api호출을 막기 위함
                return;
            }
            const next = cur.concat(tmp);//기존의 리스트에 불러온 댓글을 붙여넣는다
            setCommentList(next); //댓글 리스트 업데이트
            setCommentStartId(res.data.startId); // startId업데이트
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("댓글을 불러오지 못했습니다.");
            }
        });
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
        document.querySelector("#onlyImageArea").style.transform = `translate(-${(imageIndex * 100) / postedImageList.length}%)`;
    };
    useEffect(moveImageHandler, [imageIndex]);

    /********************글 영역 - 유저 클릭 관련*********************/
    const pageUserClickHandler = (event) => {
        setPageId(-1);//현재 페이지에서 나감
        leftBookChangeHandler(`pList/${pageUploadUserId}`);//해당 유저의 페이지로 이동
    };

    /*********************글 영역 - 좋아요 관련**********************/
    //글의 좋아요 클릭 handler
    const pageLikeClickHandler = (event) => {
        let url = ""
        isLiked ? url = unlikeThisPageUrl : url = likeThisPageUrl

        axios.post(url, {
            targetId: pageId,
            type: "PAGE"
        })
        .then((res) => {
            isLiked ? setLikeNumber(cur => cur - 1) : setLikeNumber(cur => cur + 1) //임시로라도 반영
            setIsLiked((cur) => !cur);
            console.log("페이지에 좋아요혹은 좋아요 취소했습니다.");
        })
        .catch((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("좋아요정보를 보내지 못했습니다.");
            }
        });
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

    useEffect(() => {
        if(!commentSubmitClicked) return;

        //정보를 바탕으로 댓글 작성
        axios.post(`${newCommentUrl}${pageId}/comment`, {
            pageId: Number(pageId),
            content: userCommentInput,
            group: commentToWhom[0] === "p" ? 0 : commentToWhom[1],
            nested: !(commentToWhom[0] === "p"),
            visible: true,
        })
        .then((res) => {
            console.log("댓글 작성완료");
            setUserCommentInput("");//댓글 부분 초기화
            setCommentToWhom(["p", -1, ""]);//댓글 대상 초기화
            presetComment();//댓글 내가 쓴거까지 로드된내용 불러오기
            setIsLastComment(false);//원활하게 다시 호출 되도록 세팅
            submitAbleAgain();
            if(commentToWhom[0] !== "p"){//즉, 대댓글 입력의 경우
                getCOCCount(pageId, commentToWhom[3]);
            }
        })
        .catch((res) => {
            submitAbleAgain();
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("댓글을 작성하지 못했습니다.");
            }
        });
    }, [commentSubmitClicked]);

    /*****************글 영역 - 신고*********************/
    const pageReportClickHandler = () => {
        if(window.confirm("정말 신고하시겠습니까?")){
            axios.post(ReportUrl, {
                targetId: pageId,
                type: "PAGE",
            })
            .then((res) => {
                alert("게시글을 신고했습니다.");
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("게시글을 신고하지 못했습니다.");
                }
            });
        }
    };

    /******************글 영역- 삭제*********************/
    const pageDeleteClickHandler = () => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.delete(`${deletePageUrl}${pageId}`)
            .then((res) => {
                alert("글을 삭제했습니다.");
                setPageId(-1);
                resetPage();
            })
            .catch((res) => {
                if(res.response.status === 401){
                    refreshAccessToken();
                }
                else{
                    console.log(res);
                    alert("게시글을 삭제하지 못했습니다.");
                }
            });
        }
    };

    /**********************글 영역 - 대댓글************************/
    const [COCCount, setCOCCount] = useState(0);//대댓글의 개수

    const getCOCCount = (pid, cid) => {
        axios.get(`${getCommentOFCommentNumberUrl}/${pid}/comment/${cid}/count`)
        .then((res) => {
            setCOCCount(res.data.data.count);
        })
        .then((res) => {
            if(res.response.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("대댓글의 수를 불러오지 못했습니다.");
            }
        });
    };

    return(
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
                        <div className={Style.contentArea}>
                            <pre onClick={changeCommentToPage} className={Style.content}>{postedWord}</pre>
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
                                    COCCount={COCCount}
                                    setCOCCount={setCOCCount}
                                    getCOCCount={getCOCCount}
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
                                    COCCount={COCCount}
                                    setCOCCount={setCOCCount}
                                    getCOCCount={getCOCCount}
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