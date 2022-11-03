//댓글 영역을 띄우는 컴포넌트 - 계층상 2단계

import Style from './detailPage.module.css';
import heartImg from '../heart_outline.png';
import heartImgFill from '../heart_fill.png';

import { useState, useEffect } from 'react';
import {
    likeThisPageUrl,
    ReportUrl,
    deleteCommentUrl,
    unlikeThisPageUrl,
    checkLikeUrl,
    getCommentOFCommentNumberUrl,
} from '../../../../apiUrl';
import { makeIntoArray } from '../../../../makeStringIntoArray';
import axios from 'axios';
import { calculateTimeFrom } from '../../../../timeCalculation';

import ContentArea from '../contentArea/contentArea';
import RenderCommentOfComment from './renderCommentOfComment';

const RenderComment = ({data, pageId, lastComment, setCommentToWhom, refreshAccessToken, userId, setCommentStartId, setIsLastComment, setCommentList, setPageId, leftBookChangeHandler, COCAddedTriger, setCOCAddedTriger}) => {
    const [loadCommentOfComment, setLoadCommentOfComment] = useState(0);//대댓글 켜는 버튼
    const [CIsLiked, setCIsLiked] = useState(false);//댓글이 좋아요 된 상태인지
    const [CLikeCount, setCLikeCount] = useState(0);//댓글 좋아요 개수
    const [commentContentArray, setCommentContentArray] = useState([]);//실제로 출력할 내용이다.
    const [COCCount, setCOCCount] = useState(0);//대댓글의 개수

    const getCOCCount = (pid, cid) => {//pageId와 commentId를 넣어서 COCCount를 업데이트 하는 함수
        axios.get(`${getCommentOFCommentNumberUrl}/${pid}/comment/${cid}/count`)
        .then((res) => {
            setCOCCount(res.data.data.count);
        })
        .then((res) => {
            if(res.response.status === 401 || res.response.status === 0){
                refreshAccessToken();
                setTimeout(getCOCCount, 1000);
            }
            else{
                console.log(res);
                alert("대댓글의 수를 불러오지 못했습니다.");
            }
        });
    };

    useEffect(() => {
        if(COCAddedTriger !== data.commentId) return;//해당되지 않는 경우 실행 X
        getCOCCount(pageId, COCAddedTriger);//개수 불러오기
        setCOCAddedTriger(-1);
    }, [COCAddedTriger])

    useEffect(() => {
        setCOCCount(data.nestedCommentCount);//초기에 대댓글의 수를 넣어둔다.
        setCommentContentArray(makeIntoArray(data.content));//내용도 배열로 만든다.
    }, []);

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
                if(res.response.status === 401 || res.response.status === 0){
                    refreshAccessToken();
                    setTimeout(reportClickHandler, 1000);
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
                if(res.response.status === 401 || res.response.status === 0){
                    refreshAccessToken();
                    setTimeout(deleteClickHandler, 1000);
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
    const presetLikeorNot = () => {
        setCLikeCount(data.likeCount);
        axios.get(`${checkLikeUrl}?targetId=${data.commentId}&type=COMMENT`)
        .then((res) => {
            setCIsLiked(res.data.data.like);
        })
        .catch((res) => {
            if(res.response.status === 401 || res.response.status === 0){
                refreshAccessToken();
                setTimeout(presetLikeorNot, 1000);
            }
            else{
                console.log(res);
                alert("삭제하지 못했습니다.");
            }
        });
    }
    useEffect(presetLikeorNot, []);

    //좋아요 클릭 handler
    const CommentLikeClickHandler = () => {
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
            if(res.response.status === 401 || res.response.status === 0){
                refreshAccessToken();
                setTimeout(CommentLikeClickHandler, 1000);
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
                    <div className={Style.commentTextArea} style={{cursor: "pointer"}} onClick={changeCommentToComment}>
                        {
                            commentContentArray.map((d, index) => (
                                <ContentArea data={d} key={index} />
                            ))
                        }
                    </div>
                    <div className={Style.likeTimeArea}>
                        <div className={Style.cover}>
                            <img src={CIsLiked ? heartImgFill : heartImg} className={Style.buttonImg} onClick={CommentLikeClickHandler}/>
                            <p className={Style.likeandCommentCount} style={{cursor: "default"}}>{`좋아요 ${CLikeCount}개`}</p>
                            {
                                COCCount === 0 ?
                                null : <p className={Style.likeandCommentCount} style={{cursor: "default"}}>|</p>
                            }
                            {
                                COCCount === 0 ?
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

export default RenderComment;