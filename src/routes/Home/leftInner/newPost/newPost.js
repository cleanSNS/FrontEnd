import Style from './newPost.module.css';
import { useState } from 'react';

const LeftNewPost = () => {
    const [hashtag, setHashtag] = useState("");
    const [word, setWord] = useState("");
    const [media, setMedia] = useState([]);
    const [hashtagList, setHashtagList] = useState([]);

    //글 내용 변경 함수
    const wordHandler = (event) => {
        event.preventDefault();
        setWord(event.target.value);
    }

    //hashtag영역 바꿔주는 함수
    const hashtagHandler = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if(value[value.length - 1] === ","){// 이 경우 
            setHashtagList((cur) => cur.push(value.slice(0,-1)));
            setHashtag("");
        }
        else{
            setHashtag(value);
        }
    }

    //hashtag 지우는 함수
    const deleteTag = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        hashtagList.splice(Number(event.target.value), 1);
    };

    //글 올리는 함수

    return(
        <form className={Style.WholeCover} >
            {/* 드래그 앤 드롭 영역 */}
            <div className={Style.Cover}>
                <div className={Style.picture}>
                    이미지 또는 비디오를 드래그 앤 드롭 하시거나
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
                    <div className={Style.Cover}>
                        {
                            hashtagList.map((data, index) =>(
                                <button className={Style.singleHashTag} key={index} onClick={deleteTag} value={index}>
                                    #{data} 
                                </button>
                            ))
                        }
                    </div>
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
                    vaslue={word}
                    onChange={wordHandler}
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