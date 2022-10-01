//피드 여러개 띄우는 화면
import { useState, useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import axios from 'axios';
import Style from './page.module.css';
import {
    pageloadUrl,
} from "../../../../apiUrl";

const Pages = ({pageList}) => {
    return(
        <div className={Style.pageListArea}>
            {
                pageList.map((data, index) => (
                    <div className={Style.singlePageCover} />
                ))
            }
        </div>
    );
}


const LeftPage = ({refreshAccessToken}) => {
    const [pageStartId, setPageStartId] = useState(987654321);
    const [pageList, setPageList] = useState([]);
    const [lastPage, inView] = useInView();

    //게시글 로드 함수
    const loadPageListFunc = () => {
        axios.get(`${pageloadUrl}?startId=${pageStartId}`)
        .then((res) => {
            const cur = [...pageList];
            const tmp = [res.data.data];
            const next = cur.concat(tmp);
            setPageList(next);
            setPageStartId(res.data.startId);
        })
        .catch((res) => {
            if(res.status === 401){
                refreshAccessToken();
            }
            else{
                console.log(res);
                alert("글을 로드해 오지 못했습니다.");
            }
        })
    }
    useEffect(loadPageListFunc, []);//초기 상황에서 로드

    return(
        <div className={Style.wholeCover}>
            <Pages pageList={pageList} />
        </div>
    );
}

export default LeftPage;

