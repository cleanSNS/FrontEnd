import Style from './pageList.module.css';
import { useState, useEffect } from 'react';
import {
    getUserPageListUrl,
} from '../../../../apiUrl';
import { useInView } from 'react-intersection-observer';
import { getAxios } from '../../../../apiCall';

const PageListArea = ({loadedUserId, refreshAccessToken, setPageId, setted}) => {
  const [userPageList, setUserPageList] = useState([]);
  const [pageStartId, setPageStartId] = useState(987654321);
  const [triger, setTriger] = useState(false);
  const [lastPageInUserPage, inView] = useInView();
  const [lastPage, setLastPage] = useState(false);

  //첫 로드시 원래 있던 값들을 초기화해주는 부분
  const reset = () => {
      if(!setted) return;
      setUserPageList([]);
      setPageStartId(987654321);
      setTriger(true);
  };
  useEffect(reset, [setted]);

  const presetUserPageList = async () => {
      setTriger(false);
      if(!triger) return;//실행 X

      const res = await getAxios(`${getUserPageListUrl}${loadedUserId}?startId=${pageStartId}`, {}, refreshAccessToken);
      const tmp = [...res.data.data];
      if(tmp.length === 0){
          setLastPage(true);
      }
      const currentList = [...userPageList];
      const next = currentList.concat(tmp);
      setUserPageList(next);
      setPageStartId(res.data.startId);
  };
  useEffect(() => {presetUserPageList();}, [triger]);

  const singlePageClickHandler = (event) => {
      event.preventDefault();
      setPageId(event.target.id);
  };

  //무한 로드 함수
  useEffect(() => {
      if(inView && !lastPage){
          presetUserPageList();
      }
  }, [inView]);

  return(
      <div className={Style.pageArea}>
          {
              userPageList.map((data, index) => (
                  <img src={data.imgUrl} className={Style.singlePage} key={index} id={data.pageId} onClick={singlePageClickHandler} ref={userPageList.length - 1 === index ? lastPageInUserPage : null}/>
              ))
          }
      </div>
  );
};

export default PageListArea;