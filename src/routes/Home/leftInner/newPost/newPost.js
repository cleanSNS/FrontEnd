import Style from './newPost.module.css';
import { useState } from 'react';

/*

지금 남은 할 일

해시태그 지웠을 때 즉각적으로 지워지는지 확인하기

이미지 드래그 앤 드롭하는 부분 다듬기 - CSS
이미지 드래그 앤 드롭으로 이미지 입력 받기
이미지 드래그 앤 드롭으로 받은 정보 화면에 보여주기

정상적으로 업로드 되는지 확인하기

*/





const LeftNewPost = ({ newPostImages, setNewPostImages, newPostHashtag, setNewPostHashtag, newPostContent, setNewPostContent, uploadNewPostHandler }) => {
    const [hashtag, setHashtag] = useState("");//임시로 입력되는 값 변경하는 State.

    //글 내용 변경 함수
    const contentHandler = (event) => {
        event.preventDefault();
        setNewPostContent(event.target.value);
    }

    //hashtag영역 바꿔주는 함수
    const hashtagHandler = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if(value === ","){
            alert("1글자 이상의 키워드를 입력해 주세요");
            return;
        }
        if(value[value.length - 1] === ","){// 이 경우 
            const tmp = newPostHashtag;
            tmp.push(value.slice(0,-1));
            setNewPostHashtag(tmp);
            setHashtag("");
        }
        else{
            setHashtag(value);
        }
    }

    //hashtag 지우는 함수
    const deleteTag = (event) => {
        event.preventDefault();
        const tmp = newPostHashtag;
        tmp.splice(Number(event.target.value), 1);
        setNewPostHashtag(tmp);
    };

    return(
        <form className={Style.WholeCover} onSubmit={uploadNewPostHandler}>
            {/* 드래그 앤 드롭 영역 */}
            <div className={Style.Cover}>
                <div className={Style.picture}>
                    이미지를 드래그 앤 드롭 하시거나
                    여기를 눌러 시작하세요.
                </div>
            </div>
            {/* hashtag label 영역 */}
            <div className={Style.Cover}>
                <p className={Style.hashtag}>키워드 (,로 분리해주세요)</p>
            </div>
            {/* hashtag input 영역 */}
            <div className={Style.Cover}>
                <input 
                    type="text"
                    value={hashtag}
                    onChange={hashtagHandler}
                    className={Style.hashtagInput}
                />
            </div>
            {/* hashtag list 영역 */}
            <div className={Style.Cover}>
                <div className={Style.tagListArea}>
                    {
                    <div className={Style.Cover}>
                        {
                            newPostHashtag.map((data, index) =>(
                                <button className={Style.singleHashTag} onClick={deleteTag} key={index} value={index}>
                                    #{data} 
                                </button>
                            ))
                        }
                    </div>
                    }
                </div>
            </div>
            {/* word label 영역 */}
            <div className={Style.Cover}>
                <p className={Style.word}>글을 입력해 주세요</p>
            </div>
            {/* word input 영역 */}
            <div className={Style.Cover}>
                <input 
                    type="text" 
                    vaslue={newPostContent}
                    onChange={contentHandler}
                    className={Style.wordInput} />
            </div>
            {/* 글 제출 영역 */}
            <div className={Style.Cover}>
                <button type="submit" className={Style.submitButton}>Submit</button>
            </div>
        </form>
    );
}

export default LeftNewPost;