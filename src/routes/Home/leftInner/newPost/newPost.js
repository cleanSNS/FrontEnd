import Style from './newPost.module.css';
import { useState } from 'react';
import addImage from '../../root/tagImages/add.png';

/*

지금 남은 할 일

이미지 드래그 앤 드롭하는 부분 다듬기 - CSS
이미지 드래그 앤 드롭으로 이미지 입력 받기
이미지 드래그 앤 드롭으로 받은 정보 화면에 보여주기

정상적으로 업로드 되는지 확인하기

*/

const HashtagList = ({deleteTag, newPostHashtag}) => {
    return (
        <div className={Style.Cover}>
            {
                newPostHashtag.map((data, index) =>(
                    <button className={Style.singleHashTag} onClick={deleteTag} key={index} value={index}>
                        #{data} 
                    </button>
                ))
            }
        </div>
    );
};

const LeftNewPost = ({ newPostImages, setNewPostImages, newPostHashtag, setNewPostHashtag, newPostContent, setNewPostContent, uploadNewPostHandler }) => {
    const [hashtag, setHashtag] = useState("");//임시로 입력되는 값 변경하는 State.

    //글 내용 변경 함수
    const contentHandler = (event) => {
        event.preventDefault();
        setNewPostContent(event.target.value);
    }

    //이미지 영역에 파일을 드랍한 경우 - ondrop
    const imageDropHandler = (event) => {
        event.preventDefault();

        const files = [...event.dataTransfer?.files];
        console.log(files);

        const imageUploadArea = document.querySelector("#imageUploadArea");
        imageUploadArea.style.backgroundColor="white";
        imageUploadArea.style.border="5px dashed rgb(190, 190, 190)";
    };

    //이미지 영역위에 파일을 올려놓은 경우 - ondragover(이게 있어야 ondrop이 활성화 된다.)
    const imageDragOverHandler = (event) => {
        event.preventDefault();
    };

    //파일을 이미지 영역 위로 최초 진입한 경우 - ondragenter
    const imageDragEnterHandler = (event) => {
        event.preventDefault();
        const imageUploadArea = document.querySelector("#imageUploadArea");
        imageUploadArea.style.backgroundColor="rgb(236, 236, 236)";
        imageUploadArea.style.border="5px dashed rgb(150, 150, 150)";
    };

    //파일을 이미지 영역 위에서 벗어나게 한 경우 - ondragleave
    const imageDragLeaveHandler = (event) => {
        event.preventDefault();
        const imageUploadArea = document.querySelector("#imageUploadArea");
        imageUploadArea.style.backgroundColor="white";
        imageUploadArea.style.border="5px dashed rgb(190, 190, 190)";
    };

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
            const input = value.slice(0,-1);
            if(!newPostHashtag.includes(input)){
                tmp.push(input);
                setNewPostHashtag(tmp);
                setHashtag("");
            }
            setHashtag("");
        }
        else{
            setHashtag(value);
        }
    }

    //hashtag 지우는 함수
    const deleteTag = (event) => {
        event.preventDefault();
        const tmp = [...newPostHashtag];
        tmp.splice(Number(event.target.value), 1);
        setNewPostHashtag(tmp);
    };

    return(
        <form className={Style.WholeCover} onSubmit={uploadNewPostHandler}>
            {/* 드래그 앤 드롭 영역 */}
            <div className={Style.picture} id="imageUploadArea" onDrop={imageDropHandler} onDragOver={imageDragOverHandler} onDragEnter={imageDragEnterHandler} onDragLeave={imageDragLeaveHandler}>
                <img src={addImage} className={Style.pictureinnerimage} />
                <p className={Style.pictureinnerword}>업로드할 이미지를 여기로 옮겨주세요.</p>
            </div>
            {/* 올린 이미지 미리 보기 영역 */}
            <div className={Style.ListArea}>

            </div>
            {/* hashtag label 영역 */}
            <p className={Style.hashtag}>키워드 (,로 분리해주세요)</p>
            {/* hashtag input 영역 */}
            <input 
                type="text"
                value={hashtag}
                onChange={hashtagHandler}
                className={Style.hashtagInput}
            />
            {/* hashtag list 영역 */}
            <div className={Style.ListArea}>
                <HashtagList deleteTag={deleteTag} newPostHashtag={newPostHashtag}/>
            </div>
            {/* word label 영역 */}
            <p className={Style.word}>글을 입력해 주세요</p>
            {/* word input 영역 */}
            <input 
                type="text" 
                vaslue={newPostContent}
                onChange={contentHandler}
                className={Style.wordInput} />
            {/* 글 제출 영역 */}
            <div className={Style.submitbtnArea}>
                <button type="submit" className={Style.submitButton}>Submit</button>
            </div>
        </form>
    );
};

export default LeftNewPost;