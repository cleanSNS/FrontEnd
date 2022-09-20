//검색창
import Style from './searchBar.module.css';

//나중에 a안에 이미지로 변경하기. 그 이미지 스타일도 만들어야함 반응형으로 만들면 좋을듯
const SearchBar = ({userSearch, userSearchChangeHandler, userSearchSubmitHandler}) =>{
    return(
        <form className={Style.searchBarCover} onSubmit={userSearchSubmitHandler}>
            <input 
                type="text"
                className={Style.searchBar}
                placeholder="검색"
                value={userSearch}
                onChange={userSearchChangeHandler}
            />
        </form>
    )
}

export default SearchBar;