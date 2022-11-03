//대댓글 하나를 띄우는 컴포넌트 - 계층상 4단계

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
} from '../../../../apiUrl';
import { makeIntoArray } from '../../../../makeStringIntoArray';
import { getAxios, postAxios, deleteAxios} from '../../../../apiCall';
import { calculateTimeFrom } from '../../../../timeCalculation';
import ContentArea from '../contentArea/contentArea';

//대댓글 부분
const SingleCommentOfComment = ({data, lastCommentOfComment, setPageId, userId, refreshAccessToken, pageId, leftBookChangeHandler, setToggle, setCommentOfCommentList, setCommentOfCommentStartId, setIsLastCommentOfComment, commentId, getCOCCount}) => {
    const [COCIsLiked, setCOCIsLiked] = useState(false);//대댓글 좋아요 여부
    const [COCLikeCount, setCOCLikeCount] = useState(0);//대댓글 좋아요 개수
    const [COCContentArray, setCOCContentArray] = useState([]);//대댓글 출력용 배열

    //초기에 좋아요 관련 정보 불러오기 및 출력 내용 바꾸기
    const presetLikeInfo = async () => {
        setCOCLikeCount(data.likeCount);
        const res = await getAxios(`${checkLikeUrl}?targetId=${data.commentId}&type=COMMENT`, {}, refreshAccessToken);
        setCOCIsLiked(res.data.data.like);
        setCOCContentArray(makeIntoArray(data.content));
    }
    useEffect(() => {presetLikeInfo();}, []);

    //대댓글의 유저 클릭 시 해당 유저 페이지로 이동
    const CommentofCommentUserClickHandler = () => {
        setPageId(-1);//현재 페이지에서 나감
        leftBookChangeHandler(`pList/${data.userDto.userId}`);//해당 유저의 페이지로 이동
    };

    //신고 클릭함수
    const COCreportClickHandler = async () => {
        if(window.confirm("정말 신고하시겠습니까?")){//다시 한 번 물어보고 실행
            const sendBody = {
                targetId: data.commentId,
                type: "COMMENT",
            };
            await postAxios(ReportUrl, sendBody, {}, refreshAccessToken);
            alert("신고가 접수되었습니다.");
        }
    };
    
    //삭제 클릭 함수
    const COCdeleteClickHandler = async () => {
        if(window.confirm("정말 삭제하시겠습니까?")){
            await deleteAxios(`${deleteCommentUrl}${pageId}/comment/${data.commentId}`, {}, refreshAccessToken);
            alert("삭제되었습니다.");
            setCommentOfCommentStartId(1)//대댓글 startId 초기화
            setIsLastCommentOfComment(false)//대댓글 lastcomment fasle
            setToggle(false)//토글 값 강제로 false로
            setCommentOfCommentList([])//대댓글 지우기
            await getCOCCount(pageId, commentId);
        }
    };

    //좋아요 clickhandler
    const CommentOfCommentLikeHandler = async () => {
        let url = ""
        COCIsLiked ? url = unlikeThisPageUrl : url = likeThisPageUrl
        const sendBody = {
            targetId: data.commentId,
            type: "COMMENT"
        };

        await postAxios(url, sendBody, {}, refreshAccessToken);
        COCIsLiked ? setCOCLikeCount(cur => cur - 1) : setCOCLikeCount(cur => cur + 1) //임시로라도 반영
        setCOCIsLiked((cur) => !cur);
    }

    return(
        <div className={Style.CommentBox} style={{width:"80%"}} ref={lastCommentOfComment}>
            <div className={Style.CommentProfileArea}>
                <img src={data.userDto.imgUrl} className={Style.UserImage} onClick={CommentofCommentUserClickHandler}/>
                <p className={Style.UserNickname} onClick={CommentofCommentUserClickHandler}>{data.userDto.nickname}</p>
            </div>
            <div className={Style.commentTextArea}>
                {
                    COCContentArray.map((d, index) => (
                        <ContentArea data={d} key={index} />
                    ))
                }
            </div>
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

export default SingleCommentOfComment;