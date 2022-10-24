import Style from './hashtagPage.module.css';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import{
  pageLoadHashtagUrl,
} from '../../../../apiUrl';

const LeftHashtagPage = ({leftBookState, setPageId}) => {
  const [hashTag, setHashTag] = useState("");//받아온 해시태그
  const [hashTagPageList, setHashTagPageList] = useState([]);//글 리스트
  const [hashTagPageStartId, setHashTagPageStartId] = useState(987654321);//글 리스트의 startId
  const [isFinished, setIsFinished] = useState(false);//페이지 로딩이 끝난 경우 더 이상 불리지 않게 세팅한다.
  const [lastHashtagPage, InView] = useInView();//마지막 페이지에 세팅한다.

  /***************************초기 세팅 함수********************************/
  //처음에 해시태그 받는 함수
  const hashTagpreset = () => {
    setHashTag(leftBookState.split('/')[1]);
    setHashTagPageList([]);
    setHashTagPageStartId(987654321);//초기상태로 전환
    setIsFinished(false);//초기 상태로 전환
  };
  useEffect(hashTagpreset, [leftBookState]);//state변경 시 실행

  //해시태그로 검색한 게시글을 불러오는 함수
  const loadHashtagPage = () => {
    if(hashTag === "") return; //빈 문자열인 경우 종료

    axios.get(`${pageLoadHashtagUrl}${hashTag}&startId=${hashTagPageStartId}`)
    .then((res) => {
      const tmp = [...res.data.data];
      if(tmp.length === 0){
        setIsFinished(true);
        return;
      }
      const cur = [...hashTagPageList];
      const next = cur.concat(tmp);
      setHashTagPageList(next);
      setHashTagPageStartId(res.data.startId);
    })
    .catch((res) => {

    })
  };
  useEffect(loadHashtagPage, [hashTag]);//해시태그 변경 시 실행한다.

  //마지막 요소가 보이면 로드한다.
  const lastPageSeen = () => {
    if(InView && !isFinished){
      loadHashtagPage();
    }
  };
  useEffect(lastPageSeen, [InView]);

  /******************************이후 관리 함수*********************************/
  const hastTagPageClickHandler = (event) => {
    setPageId(event.target.id);
  };

  return(
    <div className={Style.wholeCover}>
      <p className={Style.AnswerText}>{`검색하신 "#${hashTag}"에 대한 게시물입니다.`}</p>
      {
        hashTagPageList.map((data, index) => (
          <img 
            key={index}
            src={data.imgUrl}
            id={data.pageId}
            onClick={hastTagPageClickHandler}
            className={Style.singlePage}
            ref={index === hashTagPageList.length - 1 ? lastHashtagPage : null}
          />
        ))
      }
    </div>
  );
};

export default LeftHashtagPage;