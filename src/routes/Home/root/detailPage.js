//가운데에 띄우는 화면
import Style from './detailPage.module.css';
import moreStuff from './moreStuff.png';
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
} from './../../../apiUrl';
import axios from 'axios';

//대댓글
const RenderCommentOfComment = ({groupId, commentOfCommentList, setLoadCommentOfComment, loadCommentOfComment}) => {
    const [toggle, setToggle] = useState(false);

    const setToggleFunc = () => {
        if(groupId === loadCommentOfComment){
            setToggle((cur) => !cur);
            setLoadCommentOfComment(0);//다시 초기 상태로
        }
    }
    useEffect(setToggleFunc, [loadCommentOfComment]);

    return (
        toggle ?
            commentOfCommentList === undefined ?
            null
            :
            commentOfCommentList.map((data, index) =>
                <div key={index} className={Style.CommentBox} style={{width:"80%"}}>
                    <div className={Style.CommentProfileArea}>
                        <img src={data.userDto.imgUrl} className={Style.UserImage} />
                        <p className={Style.UserNickname}>{data.nickname}</p>
                        <img src={moreStuff} className={Style.UserSetting} />
                    </div>
                    <p className={Style.commentText}>{data.content}</p>
                    <div className={Style.commentbtnArea}>
                        <img src={heartImg} className={Style.buttonImg} />
                        <p className={Style.likeandCommentCount}>{`좋아요${data.likeCount}개`}</p>
                    </div>
                </div>
            )
        : null
    );
}

//댓글
const RenderComment = ({commentList, lastComment, commentOfCommentList, setCommentToWhom}) => {
    const [loadCommentOfComment, setLoadCommentOfComment] = useState(0);//대댓글 켜는 버튼

    //대댓글을 켜는 함수
    const onLoadCommentOfCommentClickHandler = (event) => {
        event.preventDefault();
        if(event.target.innerText === "답글 닫기"){
            event.target.innerText = "답글 더보기";
        }
        else{
            event.target.innerText = "답글 닫기";
        }
        setLoadCommentOfComment(Number(event.target.id));
    };

    /*************************상위 요소 전달용 함수들*****************************/
    //댓글에 대댓글을 달 수 있도록 변경하는 함수
    const changeCommentToComment = (event) => {
        event.preventDefault();
        const tmp = (event.target.id).split('/');
        setCommentToWhom(["c", commentList[Number(tmp[1])].group, commentList[Number(tmp[1])].userDto.nickname]);
    }

    return(
        <div className={Style.CommentArea}>
            {
                commentList.map((data, index) => (
                    <div key={index} className={Style.singleCommentArea} ref={index === (commentList.length - 1) ? lastComment : null}>
                        <div className={Style.CommentBox} style={{width:"100%"}}>
                                <div className={Style.CommentProfileArea}>
                                    <img src={data.userDto.imgUrl} className={Style.UserImage} />
                                    <p className={Style.UserNickname}>{data.userDto.nickname}</p>
                                    <img src={moreStuff} className={Style.UserSetting} />
                                </div>
                                <p id={`commentContent/${index}`} className={Style.commentText} style={{cursor: "pointer"}} onClick={changeCommentToComment}>{data.content}</p>
                                <div className={Style.commentbtnArea}>
                                    <img src={heartImg} className={Style.buttonImg}/>
                                    <p className={Style.likeandCommentCount}>{`좋아요 ${data.likeCount}개`}</p>
                                    <p className={Style.likeandCommentCount} style={{cursor: "default"}}>|</p>
                                    <p className={Style.likeandCommentCount} onClick={onLoadCommentOfCommentClickHandler} id={data.group}>답글 더보기</p>
                                </div>
                        </div>
                        <RenderCommentOfComment groupId={data.group} commentOfCommentList={commentOfCommentList[data.group]} setLoadCommentOfComment={setLoadCommentOfComment} loadCommentOfComment={loadCommentOfComment}/>
                    </div>
                ))
            }
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
const DetailPage = ({pageId, refreshAccessToken, setPageId}) => {//pageId가 -1이 되면 DetailPage가 사라진다.
    const [postedImageList, setPostedImageList] = useState([]);//올린 이미지 list
    const [postedPersonImage, setPostedPersonImage] = useState("");//올린 사람의 이미지
    const [postedPersonNickname, setPostedPersonNickname] = useState("");//올린 사람의 닉네임
    const [postedWord, setPostedWord] = useState(""); //올린 글의 내용
    const [likeNumber, setLikeNumber] = useState(0); //좋아요 개수
    const [postedTime, setPostedTime] = useState("");//업로드 시간(n분전같은 글로 저장)
    const [isLiked, setIsLiked] = useState(false);//해당 페이지를 좋아요했는지 저장
    const [imageIndex, setImageIndex] = useState(0);//보고있는 이미지의 index
    const [groupId, setGroupId] = useState(0);//가장 마지막 groupId
    const [commentToWhom, setCommentToWhom] = useState(["p", -1, ""]);//[0]은 페이지에 댓글인지 댓글에 대댓글인지(c) 표시 // [1]은 대댓글인 경우 groupId를 의미 댓글이면 -1 // [2]는 대댓글인 경우 유저의 닉네임 댓글이면 ""
    const [userCommentInput, setUserCommentInput] = useState("");//유저가 작성하고있는 댓글

    const [commentList, setCommentList] = useState([]); //업로드된 댓글
    const [commentStartId, setCommentStartId] = useState(987654321);//불러올 댓글의 index
    const [isLastComment, setIsLastComment] = useState(false);//마지막 댓글이 불린 경우 true로 설정
    const [lastComment, inView] = useInView();//마지막 댓글을 인식할 inView
    const [commentOfCommentList, setCommentOfCommentList] = useState([[]]);//대댓글 리스트 - [[초기화때 필요!], [groupId === 1인 대댓글], [groupId === 2인 대댓글], [groupId === 3인 대댓글], ...]의 형식이다.
    const [commentOfCommentStartId, setCommentOfCommentStartId] = useState(987654321);//대댓글 startId

    /*********************초기 화면 세팅**********************/
    //초기 화면 로드 - 글 내용 + 초기 댓글
    const presetDetailPage = () => {
        if(pageId === -1) return;

        axios.get(`${LoadDetailPageUrl}${pageId}/detail`)//글 불러오기
        .then((res) => {
            setPostedImageList(res.data.data.imgUrlList);
            setPostedPersonImage(res.data.data.pageDto.userDto.imgUrl);
            setPostedPersonNickname(res.data.data.pageDto.userDto.nickname);
            setPostedWord(res.data.data.pageDto.content);
            setLikeNumber(res.data.data.pageDto.likeCount);

            //댓글 초기 세팅 부분
            const tmp = [...res.data.data.commentDtoList.data];
            setCommentList(tmp);
            setGroupId(tmp.length);
            setCommentStartId(res.data.data.commentDtoList.startId);

            //시간 연산부분
            const now = new Date();
            const postedTime = new Date(res.data.data.pageDto.createdDate);
            let timeCal = (now - postedTime) / 1000;//초단위로 계산
            if(timeCal < 1){//1초보다 더 빨리 이전에 올린 경우
                setPostedTime("방금전");
            }
            else{//1초 이상인 경우
                if(timeCal < 60){//1초부터 59초의 경우
                    setPostedTime((Math.floor(timeCal)).toString() + "초전");
                }
                else{//60초 이상인 경우
                    timeCal /= 60; //분단위로 계산
                    if(timeCal < 60){//1분부터 59분의 경우
                        setPostedTime((Math.floor(timeCal)).toString() + "분전");
                    }
                    else{//60분 이상인 경우
                        timeCal /= 60; //시간단위로 계산
                        if(timeCal < 24){//1시간부터 23시간의 경우
                            setPostedTime((Math.floor(timeCal)).toString() + "시간전");
                        }
                        else{//24시간이상의 경우
                            timeCal /= 24; //일단위로 계산
                            if(timeCal < 365){//1일부터 364일의 경우
                                setPostedTime((Math.floor(timeCal)).toString() + "일전");
                            }
                            else{//그 이상의 경우
                                timeCal /= 365;
                                setPostedTime((Math.floor(timeCal)).toString() + "년전");
                            }
                        }
                    }
                }
            }
        })
        .catch((res) => {
            if(res.status === 401){
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
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("글을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(presetDetailPage, []);

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
            setGroupId(next.length);//그룹아이디는 지금까지 불러온 댓글 리스트의 길이와 동일하다.
        })
        .catch((res) => {
            if(res.status === 401){
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

    //대댓글을 불러오는 함수 - group이 변화했을 때가 트리거이며 초기상황인 groupId === 0인 경우를 제외하고 실행된다.
    const loadCommentOfCommentFunc = () => {
        if(groupId === 0) return; //초기상황에는 실행 X
        
        axios.get(`${LoadDetailPageUrl}${pageId}/nested?group=${groupId}&startId=${commentOfCommentStartId}`)
        .then((res) => {
            const next = [...commentOfCommentList];//지금의 리스트
            const tmp = [...res.data.data];//받아온 리스트
            for(let i = 0; i < (groupId - next.length + 1); i++){//추가된 group의 수만큼 빈 배열을 append
                next.push([]);
            }
            tmp.forEach((data) => {
                next[data.group].push(data);//적절한 index위치에 넣기
            });
            setCommentOfCommentList(next);//리스트 업데이트
            setCommentOfCommentStartId(res.data.startId);//대댓글 startId업데이트
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("댓글을 불러오지 못했습니다.");
            }
        });
    };
    useEffect(loadCommentOfCommentFunc, [groupId]);

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


    /*********************글 영역 - 좋아요 관련**********************/
    //글의 좋아요 클릭 handler
    const pageLikeClickHandler = (event) => {
        axios.post(likeThisPageUrl, {
            targetId: pageId,
            type: "PAGE"
        })
        .then((res) => {
            setIsLiked(true);
            console.log("페이지에 좋아요했습니다.");
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("좋아요를 누르지 못했습니다.");
            }
        });
    };

    //좋아요 상태 변경 시 style변경
    const likeStyleChangeHandler = () => {
        if(isLiked){//좋아요가 눌린 경우
            document.querySelector("#likeBtn").src = heartImgFill;
        }
        else{//좋아요가 눌리지 않은 경우
            document.querySelector("#likeBtn").src = heartImg;
        }
    }
    useEffect(likeStyleChangeHandler, [isLiked]);

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
    const userCommentSubmitHandler = (event) => {
        event.preventDefault();
        if(userCommentInput === ""){
            alert("1자 이상의 댓글을 입력해 주세요.");
            return;
        }

        //정보를 바탕으로 댓글 작성
        axios.post(`${newCommentUrl}${pageId}/comment`, {
            pageId: pageId,
            content: userCommentInput,
            group: commentToWhom[0] === "p" ? 0 : commentToWhom[1],
            nested: !(commentToWhom[0] === "p"),
            visible: true,
        })
        .then((res) => {
            alert("댓글 작성 완료");
            setUserCommentInput("");//댓글 부분 초기화
            setCommentToWhom(["p", -1, ""]);//댓글 대상 초기화
            presetComment();//댓글 내가 쓴거까지 로드된내용 불러오기
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("댓글을 작성하지 못했습니다.");
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
                    <div className={Style.cover}>
                        <img src={leftArrow} className={Style.arrowButton} onClick={leftArrowClickHandler}/>
                        <img src={rightArrow} className={Style.arrowButton} onClick={rightArrowClickHandler}/>
                    </div>
                </div>
                <div className={Style.ScriptArea}>
                    {/* 글 영역 */}
                    <div className={Style.pageScriptArea}>
                        <div className={Style.postPersonProfileArea}>
                            <img src={postedPersonImage} className={Style.UserImage}/>
                            <p className={Style.UserNickname}>{postedPersonNickname}</p>
                            <img src={moreStuff} className={Style.UserSetting} />
                        </div>
                        <div className={Style.postPersonSettingArea}>

                        </div>
                        <div className={Style.contentArea}>
                            <p onClick={changeCommentToPage} className={Style.content}>{postedWord}</p>
                        </div>
                        <div className={Style.likeTimeArea}>
                            <div className={Style.cover}>
                                <img id="likeBtn" src={heartImg} className={Style.buttonImg} onClick={pageLikeClickHandler} />
                                <p className={Style.likeandCommentCount}>{`좋아요 ${likeNumber}개`}</p>
                            </div>
                            <p className={Style.time}>{postedTime}</p>
                        </div>
                    </div>
                    {/* 댓글 영역 */}
                    <RenderComment 
                        commentList={commentList}
                        lastComment={lastComment}
                        commentOfCommentList={commentOfCommentList}
                        setCommentToWhom={setCommentToWhom}
                    />
                    {/* 댓글 입력 영역 */}
                    <form className={Style.userCommentArea} onSubmit={userCommentSubmitHandler}>
                        <div className={Style.cover}>
                            <textarea id="userCommentArea" type="text" className={Style.userComment} placeholder="댓글을 입력하세요..." value={userCommentInput} onChange={userCommentInputChangeHandler}/>
                        </div>
                        <div className={Style.cover}>
                            <button type="submit" className={Style.commentSubmitBtn}>게시</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;