import Style from './newPost.module.css';

const LeftNewPost = () => {
    return(
        <div className={Style.WholeCover}>
            <div className={Style.pictureCover}>
                <div className={Style.picture}>
                    이미지 또는 비디오를 드래그 앤 드롭 하시거나
                    여기를 눌러 시작하세요.
                </div>
            </div>
            <div className={Style.hashtagCover}>
                <input className={Style.hashtag} />
            </div>
            <div className={Style.wordCover}>
                <input className={Style.word} />
            </div>
            <div className={Style.buttonCover}>
                <button className={Style.buttonn}>V</button>
            </div>
        </div>
    );
}

export default LeftNewPost;