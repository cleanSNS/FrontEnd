import Style from './newPost.module.css';
import {useEffect} from 'react';

const RightNewPost = ({newPostLikeNotice, setNewPostLikeNotice, newPostCommentNotice, setNewPostCommentNotice, newPostReadPostAuth, setNewPostReadPostAuth, newPostReadCommentAuth, setNewPostReadCommentAuth, newPostWriteCommentAuth, setNewPostWriteCommentAuth, newPostReadLikeAuth, setNewPostReadLikeAuth}) => {
    //초기에 모든 허용을 진하게 만드는 함수
    const firstColoring = () => {
        //좋아요 알림부분 반영
        if(newPostLikeNotice){
            document.querySelector("#likeNoticeAllow").style.fontWeight = "600";
            document.querySelector("#likeNoticeDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#likeNoticeAllow").style.fontWeight = "400";
            document.querySelector("#likeNoticeDenial").style.fontWeight = "600";
        }

        //댓글 알림 부분 반영
        if(newPostCommentNotice){
            document.querySelector("#commentNoticeAllow").style.fontWeight = "600";
            document.querySelector("#commentNoticeDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#commentNoticeAllow").style.fontWeight = "400";
            document.querySelector("#commentNoticeDenial").style.fontWeight = "600";
        }

        //읽기 권한 반영
        if(newPostReadPostAuth === "ALL"){
            document.querySelector("#readPostAuthAllow").style.fontWeight = "600";
            document.querySelector("#readPostAuthHalfAllow").style.fontWeight = "400";
            document.querySelector("#readPostAuthDenial").style.fontWeight = "400";
        }
        else if(newPostReadPostAuth === "FOLLOW_ONLY"){
            document.querySelector("#readPostAuthAllow").style.fontWeight = "400";
            document.querySelector("#readPostAuthHalfAllow").style.fontWeight = "600";
            document.querySelector("#readPostAuthDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#readPostAuthAllow").style.fontWeight = "400";
            document.querySelector("#readPostAuthHalfAllow").style.fontWeight = "400";
            document.querySelector("#readPostAuthDenial").style.fontWeight = "600";
        }

        //댓글 읽기 반영
        if(newPostReadCommentAuth){
            document.querySelector("#readCommentAuthAllow").style.fontWeight = "600";
            document.querySelector("#readCommentAuthDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#readCommentAuthAllow").style.fontWeight = "400";
            document.querySelector("#readCommentAuthDenial").style.fontWeight = "600";
        }

        //댓글 쓰기 반영
        if(newPostWriteCommentAuth){
            document.querySelector("#writeCommentAuthAllow").style.fontWeight = "600";
            document.querySelector("#writeCommentAuthDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#writeCommentAuthAllow").style.fontWeight = "400";
            document.querySelector("#writeCommentAuthDenial").style.fontWeight = "600";
        }
        
        //좋아요 읽기 반영
        if(newPostReadLikeAuth){
            document.querySelector("#readLikeAuthAllow").style.fontWeight = "600";
            document.querySelector("#readLikeAuthDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#readLikeAuthAllow").style.fontWeight = "400";
            document.querySelector("#readLikeAuthDenial").style.fontWeight = "600";
        }
    };
    useEffect(firstColoring, []);

    //누른 설정을 반영하는 함수
    //좋아요 알림
    const likeNoticeClickHandler = (event) => {
        const clicked = event.target.id;
        if(newPostLikeNotice){//지금 허용이 눌려있는 상황
            if(clicked === "likeNoticeDenial"){//근데 거부를 누른 경우
                document.querySelector("#likeNoticeAllow").style.fontWeight = "400";//허용을 없앤다.
                document.querySelector("#likeNoticeDenial").style.fontWeight = "600";//거부를 누른다.
                setNewPostLikeNotice(false);//거부로 변경
            }
        }
        else{//거부가 눌려있는 상황
            if(clicked === "likeNoticeAllow"){//근데 허용을 누른 경우
                document.querySelector("#likeNoticeAllow").style.fontWeight = "600";//허용을 누른다.
                document.querySelector("#likeNoticeDenial").style.fontWeight = "400";//거부를 없앤다.
                setNewPostLikeNotice(true);//허용으로 설정
            }
        }
    };
    //댓글 알림
    const commentNoticeClickHandler = (event) => {
        const clicked = event.target.id;
        if(newPostCommentNotice){//지금 허용이 눌려있는 상황
            if(clicked === "commentNoticeDenial"){//근데 거부를 누른 경우
                document.querySelector("#commentNoticeAllow").style.fontWeight = "400";//허용을 없앤다.
                document.querySelector("#commentNoticeDenial").style.fontWeight = "600";//거부를 누른다.
                setNewPostCommentNotice(false);//거부로 변경
            }
        }
        else{//거부가 눌려있는 상황
            if(clicked === "commentNoticeAllow"){//근데 허용을 누른 경우
                document.querySelector("#commentNoticeAllow").style.fontWeight = "600";//허용을 누른다.
                document.querySelector("#commentNoticeDenial").style.fontWeight = "400";//거부를 없앤다.
                setNewPostCommentNotice(true);//허용으로 설정
            }
        }
    };
    //읽기 권한 - 얘만 3개다.
    const readPostAuthClickHandler = (event) => {
        const clicked = event.target.id;
        if(clicked === "readPostAuthAllow"){//허용이 눌린 경우
            if(newPostReadPostAuth !== "ALL"){//근데 이미 허용으로 되어있지 않은 경우
                document.querySelector("#readPostAuthAllow").style.fontWeight = "600";//허용을 누른다.
                document.querySelector("#readPostAuthHalfAllow").style.fontWeight = "400";//거부를 없앤다.
                document.querySelector("#readPostAuthDenial").style.fontWeight = "400";//거부를 없앤다.
                setNewPostReadPostAuth("ALL");//허용으로 변경
            }
        }
        else if(clicked === "readPostAuthHalfAllow"){//팔로우만 허용인 경우
            if(newPostReadPostAuth !== "FOLLOW_ONLY"){//근데 이미 팔로우만 허용으로 되어있지 않은 경우
                document.querySelector("#readPostAuthAllow").style.fontWeight = "400";//허용을 누른다.
                document.querySelector("#readPostAuthHalfAllow").style.fontWeight = "600";//거부를 없앤다.
                document.querySelector("#readPostAuthDenial").style.fontWeight = "400";//거부를 없앤다.
                setNewPostReadPostAuth("FOLLOW_ONLY");//팔로우만 허용으로 변경
            }
        }
        else{//거부인 경우
            if(newPostReadPostAuth !== "NONE"){//근데 이미 거부로 되어있지 않은 경우
                document.querySelector("#readPostAuthAllow").style.fontWeight = "400";//허용을 누른다.
                document.querySelector("#readPostAuthHalfAllow").style.fontWeight = "400";//거부를 없앤다.
                document.querySelector("#readPostAuthDenial").style.fontWeight = "600";//거부를 없앤다.
                setNewPostReadPostAuth("NONE");//거부로 변경
            }
        }
    };
    //댓글 읽기 권한
    const readCommentAuthClickHandler = (event) => {
        const clicked = event.target.id;
        if(newPostReadCommentAuth){//지금 허용이 눌려있는 상황
            if(clicked === "readCommentAuthDenial"){//근데 거부를 누른 경우
                document.querySelector("#readCommentAuthAllow").style.fontWeight = "400";//허용을 없앤다.
                document.querySelector("#readCommentAuthDenial").style.fontWeight = "600";//거부를 누른다.
                setNewPostReadCommentAuth(false);//거부로 변경
            }
        }
        else{//거부가 눌려있는 상황
            if(clicked === "readCommentAuthAllow"){//근데 허용을 누른 경우
                document.querySelector("#readCommentAuthAllow").style.fontWeight = "600";//허용을 누른다.
                document.querySelector("#readCommentAuthDenial").style.fontWeight = "400";//거부를 없앤다.
                setNewPostReadCommentAuth(true);//허용으로 설정
            }
        }
    };
    //댓글 쓰기 권한
    const writeCommentAuthHandler = (event) => {
        const clicked = event.target.id;
        if(newPostWriteCommentAuth){//지금 허용이 눌려있는 상황
            if(clicked === "writeCommentAuthDenial"){//근데 거부를 누른 경우
                document.querySelector("#writeCommentAuthAllow").style.fontWeight = "400";//허용을 없앤다.
                document.querySelector("#writeCommentAuthDenial").style.fontWeight = "600";//거부를 누른다.
                setNewPostWriteCommentAuth(false);//거부로 변경
            }
        }
        else{//거부가 눌려있는 상황
            if(clicked === "writeCommentAuthAllow"){//근데 허용을 누른 경우
                document.querySelector("#writeCommentAuthAllow").style.fontWeight = "600";//허용을 누른다.
                document.querySelector("#writeCommentAuthDenial").style.fontWeight = "400";//거부를 없앤다.
                setNewPostWriteCommentAuth(true);//허용으로 설정
            }
        }
    };
    //좋아요 읽기 권한
    const readLikeAuthClickHandler = (event) => {
        const clicked = event.target.id;
        if(newPostReadLikeAuth){//지금 허용이 눌려있는 상황
            if(clicked === "readLikeAuthDenial"){//근데 거부를 누른 경우
                document.querySelector("#readLikeAuthAllow").style.fontWeight = "400";//허용을 없앤다.
                document.querySelector("#readLikeAuthDenial").style.fontWeight = "600";//거부를 누른다.
                setNewPostReadLikeAuth(false);//거부로 변경
            }
        }
        else{//거부가 눌려있는 상황
            if(clicked === "readLikeAuthAllow"){//근데 허용을 누른 경우
                document.querySelector("#readLikeAuthAllow").style.fontWeight = "600";//허용을 누른다.
                document.querySelector("#readLikeAuthDenial").style.fontWeight = "400";//거부를 없앤다.
                setNewPostReadLikeAuth(true);//허용으로 설정
            }
        }
    };


    return(
        <div className={Style.WholeCover}>
            <div className={Style.Cover}>
                <div className={Style.settingCover} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <div className={Style.settingName}>좋아요 알림</div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSetting}>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="likeNoticeAllow" onClick={likeNoticeClickHandler}>허용</div>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="likeNoticeDenial" onClick={likeNoticeClickHandler}>거부</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingCover} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <div className={Style.settingName}>댓글 알림</div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSetting}>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="commentNoticeAllow" onClick={commentNoticeClickHandler}>허용</div>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="commentNoticeDenial" onClick={commentNoticeClickHandler}>거부</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingCover} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <div className={Style.settingName}>읽기 권한</div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.threeSetting}>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="readPostAuthAllow" onClick={readPostAuthClickHandler}>허용</div>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="readPostAuthHalfAllow" onClick={readPostAuthClickHandler}>팔로우 된 사람만 허용</div>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="readPostAuthDenial" onClick={readPostAuthClickHandler}>거부</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingCover} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <div className={Style.settingName}>댓글 읽기 권한</div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSetting}>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="readCommentAuthAllow" onClick={readCommentAuthClickHandler}>허용</div>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="readCommentAuthDenial" onClick={readCommentAuthClickHandler}>거부</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingCover} style={{borderBottom:"1px solid rgb(216, 216, 216)"}}>
                    <div className={Style.Cover}>
                        <div className={Style.settingName}>댓글 쓰기 권한</div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSetting}>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="writeCommentAuthAllow" onClick={writeCommentAuthHandler}>허용</div>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="writeCommentAuthDenial" onClick={writeCommentAuthHandler}>거부</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.Cover}>
                <div className={Style.settingCover}>
                    <div className={Style.Cover}>
                        <div className={Style.settingName}>좋아요 읽기 권한</div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.twoSetting}>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="readLikeAuthAllow" onClick={readLikeAuthClickHandler}>허용</div>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.settingTag} id="readLikeAuthDenial" onClick={readLikeAuthClickHandler}>거부</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightNewPost;