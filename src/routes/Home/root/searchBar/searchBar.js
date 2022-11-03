//검색창
import { useState, useEffect } from 'react';
import Style from './searchBar.module.css';
import SingleSearchList from './singleSearchList'
import{
    getUserNicknameAndImageUrl,
    pageloadHashtagNumUrl,
} from '../../../../apiUrl';
import { getAxios } from '../../../../apiCall';

const SearchBar = ({setLeftBookState, refreshAccessToken}) =>{
    const [userSearch, setUserSearch] = useState("");//사용자의 search input이다.
    const [isSubmitted, setIsSubmitted] = useState(false);//제출된 상태인지 입력중인 상태인지를 나타낸다.
    const [searchedList, setSearchedList] = useState([]);//검색 결과 list이다.
    const [hashtagPageNumber, setHashtagPageNumber] = useState(0);//해당 해시태그에 속하는 글의 수이다.

    //사용자의 input에 따라 input의 value를 바꾸는 함수
    const userSearchChangeHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(false);//검색을 입력 중에는 submit된 상태가 아니므로 false로 만든다
    setUserSearch(event.target.value);
    }

    //사용자의 input을 검색하는 함수
    const userSearchSubmitHandler = async (event) => {
    event.preventDefault();
    if(userSearch === '') return;//검색어가 없는 경우 아무 일도 하지 않음

    const userResponse = await getAxios(`${getUserNicknameAndImageUrl}search?nickname=${userSearch}`, {}, refreshAccessToken);//유저 검색해서 리스트 업데이트
    const pageCounterResponse = await getAxios(`${pageloadHashtagNumUrl}${userSearch}`, {}, refreshAccessToken);//해시태그의 게시글 숫자 검색

    setSearchedList(userResponse.data.data);
    setHashtagPageNumber(pageCounterResponse.data.data.count);//여기 좀 다를 수 있음
    setIsSubmitted(true);
    };

    const dropBoxInactive = () => {//제출이 끝난 것으로 인식한다. 다시 초기 상태로 변환
    if(isSubmitted){//검색된 상태면 잠시 후에 실행한다. - 검색되어 화면이 넘어가고, 창을 지우기 위함
        setTimeout(() => {
        setIsSubmitted(false);
        setUserSearch("");
        setSearchedList([]);
        }, 500);
    }
    else{
        setIsSubmitted(false);
        setUserSearch("");
        setSearchedList([]);
    }
    };

    const searchedUserClickHandler = (event) => {
    event.preventDefault();
    //이제 좌측 페이지 변경
    setLeftBookState(`pList/${(event.target.id.split('_'))[1]}`);
    dropBoxInactive();
    };

    const searchedHashtagClickHandler = (event) => {
    event.preventDefault();
    //이제 좌측 페이지 변경
    setLeftBookState(`hashtagPage/${userSearch}`);
    dropBoxInactive();
    };
    
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
                onBlur={dropBoxInactive}
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