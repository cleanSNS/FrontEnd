//글 하나만 띄우는 card
import Style from './singlePage.module.css';

const SinglePage = () => {
    return (
        <div className={Style.wholeCover}>
            <div className={Style.imageArea}>

            </div>
            <div className={Style.ScriptArea}>
                <div className={Style.pageScriptArea}>
                    <div className={Style.covertop}>

                    </div>
                    <div className={Style.cover}>
                        
                    </div>
                    <div className={Style.covertop}>
                        
                    </div>

                </div>
                <div className={Style.CommetArea}>

                </div>
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
    );
}

export default SinglePage