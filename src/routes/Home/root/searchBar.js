import Style from './searchBar.module.css';

//나중에 a안에 이미지로 변경하기. 그 이미지 스타일도 만들어야함 반응형으로 만들면 좋을듯
const SearchBar = () =>{
    return(
        <div className={Style.searchBarCover}>
            <form>
                <input type="text" className={Style.searchBar} placeholder="검색"></input>
            </form>
        </div>
    )
}

export default SearchBar;