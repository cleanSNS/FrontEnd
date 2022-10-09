//검색창
import { useEffect } from 'react';
import Style from './searchBar.module.css';

const SingleSearchList = ({data, clickFunc}) => {
    const mouseOverHandler = (event) => {
        document.querySelector(`#cover_${data.userId}`).style.backgroundColor="rgb(190, 190, 190)";
    }
    const mouseOutHandler = (event) => {
        document.querySelector(`#cover_${data.userId}`).style.backgroundColor="white";
    }
    return(
        data.userId === -1 ?
        <div id={`cover_${data.userId}`} className={Style.content} onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler} onClick={clickFunc}>
            <div id={`image_${data.userId}`} className={Style.searchedUserImage} onClick={clickFunc}/>
            <p id={`nickname_${data.userId}`} className={Style.searchedUserNickname} onClick={clickFunc}>{data.nickname}</p>
        </div>
        :
        <div id={`cover_${data.userId}`} className={Style.content} onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler} onClick={clickFunc}>
            <img id={`image_${data.userId}`} src={data.imgUrl} className={Style.searchedUserImage} onClick={clickFunc}/>
            <p id={`nickname_${data.userId}`} className={Style.searchedUserNickname} onClick={clickFunc}>{data.nickname}</p>
        </div>
    );
};

//나중에 a안에 이미지로 변경하기. 그 이미지 스타일도 만들어야함 반응형으로 만들면 좋을듯
const SearchBar = ({userSearch, hashtagPageNumber, userSearchChangeHandler, userSearchSubmitHandler, isSubmitted, searchedList, searchedUserClickHandler, searchedHashtagClickHandler}) =>{
    
    //dropbox를 활성화 하는 함수
    const dropBoxActivate = () => {
        if(userSearch.length >= 1){
            document.querySelector("#searchBarDropBox").style.display = "flex";
        }
        else{
            document.querySelector("#searchBarDropBox").style.display = "none";
        }
    };
    useEffect(dropBoxActivate, [userSearch]);

    return(
        <form className={Style.searchBarCover} onSubmit={userSearchSubmitHandler}>
            <input 
                type="text"
                className={Style.searchBar}
                placeholder="검색"
                value={userSearch}
                onChange={userSearchChangeHandler}
            />
            <div id="searchBarDropBox" className={Style.dropBox}>
                {
                    isSubmitted ?
                    <div className={Style.dropBoxInner}>
                        <SingleSearchList data={{userId: -1, nickname: `#${userSearch} 게시물 ${hashtagPageNumber}개`, imgUrl: "#"}} index={0} clickFunc={searchedHashtagClickHandler}/> 
                        {
                            searchedList.map((data, index) => (
                                <SingleSearchList data={data} key={index} clickFunc={searchedUserClickHandler} />
                            ))
                        }
                    </div>
                    :
                    <div className={Style.dropBoxInner}>
                        <p style={{textAlign: "center", paddingTop: "30px"}}>검색어를 검색합니다. 엔터를 눌러주세요.</p>
                    </div>
                }
            </div>
        </form>
    )
}

export default SearchBar;