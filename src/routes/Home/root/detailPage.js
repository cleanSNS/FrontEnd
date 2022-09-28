//가운데에 띄우는 화면
import Style from './detailPage.module.css';
import moreStuff from './moreStuff.png';
import heartImg from './heart_outline.png';
import heartImgFill from './heart_fill.png';
import newCommentImg from './tagImages/message.png';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    LoadDetailPageUrl,
    likeThisPageUrl,
    checkILikedThisPageOrComment,

} from './../../../apiUrl';
import axios from 'axios';

//대댓글 관리
const RenderCommentOfComment = ({commentId, refreshAccessToken, loadCommentOfComment}) => {
    const [commentofCommentstartId, setCommentofCommentstartId] = useState(987654321);
    const [toggle, setToggle] = useState(false);

    const toggleSet = () => {
        if(commentId === loadCommentOfComment){
            setToggle((cur) => !cur);
        }
    };
    useEffect(toggleSet, [loadCommentOfComment]);

    return (
        toggle ?
        <div className={Style.CommentBox} style={{width:"80%"}}>
            <div className={Style.CommentProfileArea}>
                <img className={Style.UserImage} />
                <p className={Style.UserNickname}>아아아아아아아아아아아아아아</p>
                <img src={moreStuff} className={Style.UserSetting} />
            </div>
            <p className={Style.commentText}>대댓글 내용이 오는 공간입니다.ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</p>
            <div className={Style.commentbtnArea}>
                <img src={heartImg} className={Style.buttonImg} />
                <p className={Style.likeandCommentCount}>좋아요111개</p>
                <img src={newCommentImg} className={Style.buttonImg} />
                <p className={Style.likeandCommentCount}>답글 더보기</p>
            </div>
        </div>
        :
        null
    );
}

//댓글관리
const RenderComment = ({pageId, refreshAccessToken}) => {
    const [commentList, setCommentList] = useState([
        {
            "userDto": {
                "userId": 1,
                "nickname": "홍길동",
                "imgUrl": null
            },
            "commentId": 1,
            "content": "first comment",
            "likeCount": 0,
            "createdDate": "2022-08-04T23:45:55.11111"
        },
        {
            "userDto": {
                "userId": 1,
                "nickname": "홍길동",
                "imgUrl": null
            },
            "commentId": 5,
            "content": "second comment",
            "likeCount": 3,
            "createdDate": "2022-08-04T23:45:55.55555"
        }
    ]); //업로드된 댓글
    const [commentStartId, setCommentStartId] = useState(987654321);//불러올 댓글의 index
    const [isLastComment, setIsLastComment] = useState(false);//마지막 댓글이 불린 경우 true로 설정
    const [loadCommentOfComment, setLoadCommentOfComment] = useState(-1);//대댓글 켜는 버튼
    const [lastComment, inView] = useInView();

    //초기 화면 로드 - 댓글
    const presetComment = () => {
        if(pageId === -1) return;
        axios.get(LoadDetailPageUrl + pageId.toString() + "/comment?startId=" + commentStartId.toString())
        .then((res) => {
            const tmp = [...res.data.data];//불러온 댓글
            if(tmp.length === 0){//더 불러온 내용이 없는 경우
                setIsLastComment(true);
            }
            const current = [...commentList];
            const next = tmp.concat(current);
            setCommentList(next);
            setCommentStartId(res.data.startId);
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
    useEffect(presetComment, []);

    //댓글을 더 불러오는 함수
    const loadMoreComment = () => {
        console.log(commentStartId);
        if(!isLastComment){//불러올 내용이 더 있는 경우
            presetComment();
        }
        else{
            console.log("더 불러올 내용이 없습니다.");
        }
    };
    useEffect(loadMoreComment, [inView]);

    //대댓글 켜는 버튼
    const onLoadCommentOfCommentClickHandler = (event) => {
        event.preventDefault();
        if(loadCommentOfComment){//더보기가 활성화 되어있었을 때 클릭 된 경우
            event.target.innerText = "답글 더보기";
        }
        else{//더 보기가 없을 때 클릭된 경우
            event.target.innerText = "답글 닫기";
        }
        setLoadCommentOfComment(event.target.id);
    };

    return(
        <div className={Style.CommentArea}>
            {
            commentList.map((data, index) => (
                index === commentList.length - 1 ?
                <div key={index} className={Style.singleCommentArea} ref={lastComment}>
                    <div className={Style.CommentBox} style={{width:"100%"}}>
                            <div className={Style.CommentProfileArea}>
                                <img src={data.userDto.imgUrl} className={Style.UserImage} />
                                <p className={Style.UserNickname}>{data.userDto.nickname}</p>
                                <img src={moreStuff} className={Style.UserSetting} />
                            </div>
                            <p className={Style.commentText}>{data.content}</p>
                            <div className={Style.commentbtnArea}>
                                <img src={heartImg} className={Style.buttonImg}/>
                                <p className={Style.likeandCommentCount}>{`좋아요 ${data.likeCount}개`}</p>
                                <img src={newCommentImg} className={Style.buttonImg} onClick={onLoadCommentOfCommentClickHandler} id={data.commentId}/>
                                <p className={Style.likeandCommentCount} onClick={onLoadCommentOfCommentClickHandler} id={data.commentId}>답글 더보기</p>
                            </div>
                    </div>
                    <RenderCommentOfComment commentId={data.commentId} refreshAccessToken={refreshAccessToken} loadCommentOfComment={loadCommentOfComment}/>
                </div>
                :
                <div key={index} className={Style.singleCommentArea}>
                    <div className={Style.CommentBox} style={{width:"100%"}}>
                            <div className={Style.CommentProfileArea}>
                                <img src={data.userDto.imgUrl} className={Style.UserImage} />
                                <p className={Style.UserNickname}>{data.userDto.nickname}</p>
                                <img src={moreStuff} className={Style.UserSetting} />
                            </div>
                            <p className={Style.commentText}>{data.content}</p>
                            <div className={Style.commentbtnArea}>
                                <img src={heartImg} className={Style.buttonImg}/>
                                <p className={Style.likeandCommentCount}>{`좋아요 ${data.likeCount}개`}</p>
                                <img src={newCommentImg} className={Style.buttonImg} onClick={onLoadCommentOfCommentClickHandler} id={data.commentId}/>
                                <p className={Style.likeandCommentCount} onClick={onLoadCommentOfCommentClickHandler} id={data.commentId}>답글 더보기</p>
                            </div>
                    </div>
                    <RenderCommentOfComment commentId={data.commentId} refreshAccessToken={refreshAccessToken} loadCommentOfComment={loadCommentOfComment}/>
                </div>
            ))
            }
        </div>
    );
};

//모든 페이지
const DetailPage = ({pageId, refreshAccessToken, setPageId}) => {//pageId가 -1이 되면 DetailPage가 사라진다.
    const [postedImageList, setPostedImageList] = useState([]);//올린 이미지 list
    const [postedPersonImage, setPostedPersonImage] = useState("");//올린 사람의 이미지
    const [postedPersonNickname, setPostedPersonNickname] = useState("");//올린 사람의 닉네임
    const [postedWord, setPostedWord] = useState(""); //올린 글의 내용
    const [likeNumber, setLikeNumber] = useState(0); //좋아요 개수
    const [postedTime, setPostedTime] = useState("");//업로드 시간(n분전같은 글로 저장
    const [isLiked, setIsLiked] = useState(false);//해당 페이지를 좋아요했는지 저장

    //초기 화면 로드 - 글 내용
    const presetDetailPage = () => {
        if(pageId === -1) return;

        axios.get(LoadDetailPageUrl + pageId.toString() + "/detail")//글 불러오기
        .then((res) => {
            setPostedImageList(res.data.data.imgUrlList);
            setPostedPersonImage(res.data.data.pageDto.userDto.imgUrl);
            setPostedPersonNickname(res.data.data.pageDto.userDto.nickname);
            setPostedWord(res.data.data.pageDto.content);
            setLikeNumber(res.data.data.pageDto.likeCount);
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

        axios.get(checkILikedThisPageOrComment + `?targetId=${pageId}&type=PAGE`)//좋아요 여부 불러오기
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

    //외부 클릭 시 화면 닫기
    const closePage = (event) => {
        if(event.target.id === "outSide"){
            setPageId(-1);
        }
    }

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

    return(
        <div className={Style.wholeCover} onClick={closePage} id="outSide">
            <div className={Style.ImageAndScriptCover}>
                <div className={Style.imageArea}>

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
                            <p className={Style.content}>{postedWord}</p>
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
                    <RenderComment pageId={pageId} refreshAccessToken={refreshAccessToken}/>
                    {/* 댓글 입력 영역 */}
                    <div className={Style.userCommentArea}>
                        <div className={Style.cover}>
                            <textarea type="text" className={Style.userComment} placeholder="댓글을 입력하세요..."/>
                        </div>
                        <div className={Style.cover}>
                            <button className={Style.commentSubmitBtn}>게시</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailPage;