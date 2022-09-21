import { useState, useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import axios from 'axios';
import Style from './page.module.css';
import {
    pageloadUrl,
} from "../../../../apiUrl";

let pageList = [1,2,3,4,5];
let currentStartId = 987654321;

const Pages = ({ obj, lastRef }) => {
    return(
        <div className={Style.singlePageCover}>
            {
                obj.map((data, index) => (
                    index === (obj.length - 1) ? 
                    <p key={index} ref={lastRef}>last obj</p>
                    :
                    <p key={index}>{data}</p>
                ))
            }
        </div>
    );
}


const LeftPage = ({refreshAccessToken}) => {
    const [ref, inView] = useInView();//ref를 {ref}로 설정한요소가 화면에 보이는 상황이면 true가 나오고, 아닌 경우 false이다.

    const pageLoadFunc = () => {
        if(inView){
            axios.get(pageloadUrl + "?startId=" + currentStartId)
            .then((res) => {
                console.log("데이터 추가");
                pageList = [...res.data.data];//추가 데이터 저장
                currentStartId = res.startId;
            })
            .catch((res) => {
                console.log("더이상 글이 없습니다.");
                console.log(res);
            })
        }
    };
    useEffect(pageLoadFunc, [inView]);
    return(
        <div className={Style.pageCover}>
            <Pages obj={pageList} lastRef={ref}/>
        </div>
    );
}

export default LeftPage;

