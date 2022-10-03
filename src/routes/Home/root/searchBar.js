//검색창
import Style from './searchBar.module.css';

//나중에 a안에 이미지로 변경하기. 그 이미지 스타일도 만들어야함 반응형으로 만들면 좋을듯
const SearchBar = ({userSearch, userSearchChangeHandler, userSearchSubmitHandler}) =>{
    const mouseOverHandler = (event) => {
        event.target.style.backgroundColor = "gray";
    }
    const mouseOutHandler = (event) => {
        event.target.style.backgroundColor="white"
    }

    return(
        <form className={Style.searchBarCover} onSubmit={userSearchSubmitHandler}>
            <input 
                type="text"
                className={Style.searchBar}
                placeholder="검색"
                value={userSearch}
                onChange={userSearchChangeHandler}
            />
            <div className={Style.dropBox}>
                <div className={Style.dropBoxInner}>
                    <div className={Style.content} onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler}/>
                    <div className={Style.content} onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler}/>
                </div>
            </div>
        </form>
    )
}

export default SearchBar;