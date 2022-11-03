//대댓글을 불러오고 toggle하는 컴포넌트 - 계층상 3단계
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    LoadDetailPageUrl,
} from '../../../../apiUrl';
import { getAxios } from '../../../../apiCall';
import SingleCommentOfComment from './singleCommentOfComment';


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
    const loadThisCommentOfComment = async () => {
        if(toggle){
            const res = await getAxios(`${LoadDetailPageUrl}${pageId}/nested?group=${groupId}&startId=${commentOfCommentStartId}`, {}, refreshAccessToken);
            const tmp = [...res.data.data];
            if(tmp.length === 0){
                setIsLastCommentOfComment(true);
                return;//이후의 작업은 불필요하다.
            }
            const cur = [...commentOfCommentList];
            const next = cur.concat(tmp);
            setCommentOfCommentList(next);
            setCommentOfCommentStartId(res.data.startId);
        }
    };
    useEffect(() => {loadThisCommentOfComment();}, [toggle]);

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
};

export default RenderCommentOfComment;