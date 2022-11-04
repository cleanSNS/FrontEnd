//피드 여러개 띄우는 화면
import { useState, useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import Style from './page.module.css';
import {
    pageloadUrl,
} from "../../../../apiUrl";
import SinglePage from './singlePage';
import { getAxios } from "../../../../apiCall";

const LeftPage = ({refreshAccessToken, leftBookState, setPageId, detailPageLikeClick, setDetailPageLikeClick, setLeftBookState}) => {
    const [pageStartId, setPageStartId] = useState(987654321);//글 리스트의 startId
    const [pageList, setPageList] = useState([]); //글 리스트
    const [lastPage, inView] = useInView(); //이게 ref된 요소가 화면에 보이면 inView가 true로 변경
    const [isLoadFinish, setIsLoadFinish] = useState(false);//false면 더 이상 로드할 내용이 남은 경우, true면 로드할 내용이 더 없는 경우이다.

    const [loading, setLoading] = useState(true);

    //게시글 로드 함수
    const loadPageListFunc = async ()=> {
        const res = await getAxios(`${pageloadUrl}?startId=${pageStartId}`, {}, refreshAccessToken);
        const cur = [...pageList];
        const tmp = [...res.data.data];
        if(tmp.length === 0){
            setIsLoadFinish(true);//더 이상 글이 없는 경우이다.
            return;
        }
        const next = cur.concat(tmp);
        setPageList(next);
        setPageStartId(res.data.startId);
        setLoading(false);
    };
    useEffect(() => {loadPageListFunc();}, [leftBookState]);//state가 바뀌면 다시 load

    //화면의 마지막이 읽히면 조건을 확인해서 글을 로드하는 함수
    const loadMorePageFunc = () => {
        if(!isLoadFinish && inView){
            loadPageListFunc();
        }
    };
    useEffect(loadMorePageFunc, [inView]);

    return(
        loading ? null :
        <div className={Style.wholeCover}>
            <div className={Style.pageListArea}>
                {
                    pageList.length === 0 ?
                    <p className={Style.noPageText}>글이 존재하지 않습니다.. 너무도 조용합니다..</p>
                    :
                    pageList.map((data, index) => (
                        index === (pageList.length - 1) ?
                        <SinglePage
                            data={data}
                            key={index}
                            index={index} 
                            lastPage={lastPage}
                            setPageId={setPageId}
                            setLeftBookState={setLeftBookState}
                            refreshAccessToken={refreshAccessToken}
                            detailPageLikeClick={detailPageLikeClick}
                            setDetailPageLikeClick={setDetailPageLikeClick}
                        />
                        :
                        <SinglePage 
                            data={data}
                            key={index}
                            index={index} 
                            lastPage={null}
                            setPageId={setPageId}
                            setLeftBookState={setLeftBookState}
                            refreshAccessToken={refreshAccessToken}
                            detailPageLikeClick={detailPageLikeClick}
                            setDetailPageLikeClick={setDetailPageLikeClick}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default LeftPage;