import { useState, useEffect } from 'react';
import ContentArea from '../../root/contentArea/contentArea';
import heartBtn from './heart_outline.png';
import heartFillBtn from './heart_fill.png';
import Style from './page.module.css';
import {
    likeThisPageUrl,
    unlikeThisPageUrl,
} from "../../../../apiUrl";
import { postAxios } from '../../../../apiCall';
import { makeIntoArray } from "../../../../makeStringIntoArray";

import ImageArea from "./imageArea";

const SinglePage = ({data, lastPage, index, setPageId, setLeftBookState, refreshAccessToken, detailPageLikeClick, setDetailPageLikeClick}) => {
  const [isLiked, setIsLiked] = useState(false);//좋아요 여부
  const [likeCount, setLikeCount] = useState(0);//좋아요 개수
  const [contentArray, setContentArray] = useState([]);

  const pageClickFunc = () => {
      setPageId(data.pageDto.pageId);
  };

  const userProfileClickHandler = () => {
      setLeftBookState(`pList/${data.pageDto.userDto.userId}`);
  };

  //좋아요 초기 설정
  useEffect(() => {
      setLikeCount(data.pageDto.likeCount);//좋아요 개수 불러오기
      setIsLiked(data.like);//좋아요 여부 불러오기
      setContentArray(makeIntoArray(data.pageDto.content));//받은 글을 객체로 변경
  }, [])

  //좋아요 클릭 handler
  const likeClickHandler = async () => {
      let url = ""
      isLiked ? url = unlikeThisPageUrl : url = likeThisPageUrl

      const sendBody = {
        targetId: data.pageDto.pageId,
        type: "PAGE"
      }

      await postAxios(url, sendBody, {}, refreshAccessToken);
      isLiked ? setLikeCount(cur => cur - 1) : setLikeCount(cur => cur + 1) //임시로 반영
      setIsLiked((cur) => !cur);
  };

  //detailpage에서 클릭 시 어떤 페이지를 클릭했는지 확인하고, 그 페이지의 좋아요 여부를 반영 - api호출은 이미 했으므로 할 필요 없다.
  useEffect(() => {
      if(detailPageLikeClick !== data.pageDto.pageId) return;//초기 상황도 -1이므로 동시에 잡을 수 있다.

      isLiked ? setLikeCount(cur => cur - 1) : setLikeCount(cur => cur + 1) //임시로라도 반영
      setIsLiked((cur) => !cur);
      console.log("detailpage에서 클릭한 여부를 반영했습니다.");
      setDetailPageLikeClick(-1);//다시 초기화한다.

  }, [detailPageLikeClick]);

  return(
      <div className={Style.singlePageCover} ref={lastPage}>
          {/* 프로필 영역 */}
          <div className={Style.profileArea}>
              <div className={Style.flexBoxCenter}>
                  <img src={data.pageDto.userDto.imgUrl} className={Style.profileImage} onClick={userProfileClickHandler}/>
              </div>
              <div className={Style.flexBoxStart}>
                  <p className={Style.profileNickname} onClick={userProfileClickHandler}>{data.pageDto.userDto.nickname}</p>
              </div>
          </div>
          {/* 이미지 영역 */}
          <ImageArea imgList={data.imgUrlList} pageIndex={index} pageClickFunc={pageClickFunc}/>
          {/* 아래 좋아요랑 글 영역 */}
          <div className={Style.pageLikeAndContentArea}>
              <div className={Style.pagelikearea}>
                  <img src={isLiked ? heartFillBtn : heartBtn} className={Style.pageLikeBtn} onClick={likeClickHandler}/>
                  <p style={{margin: "0"}}>{data.pageDto.likeReadAuth ? `좋아요 ${likeCount} 개` : `좋아요 여러 개`}</p>
              </div>
              <div className={Style.pageContentArea} onClick={pageClickFunc}>
                  {
                      contentArray.map((d, index) => (
                          <ContentArea data={d} key={index}/>
                      ))
                  }
              </div>
          </div>
      </div>
  );
};

export default SinglePage;