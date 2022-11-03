import Style from './searchBar.module.css';

const SingleSearchList = ({data, clickFunc}) => {
    const mouseOverHandler = () => {
        document.querySelector(`#cover_${data.userId}`).style.backgroundColor="rgb(190, 190, 190)";
    }
    const mouseOutHandler = () => {
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

export default SingleSearchList;