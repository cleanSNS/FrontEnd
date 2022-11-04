import { useState, useEffect } from 'react';
import leftArrow from './caret_left.png';
import rightArrow from './caret_right.png'
import Style from './page.module.css';

const ImageArea = ({imgList, pageIndex, pageClickFunc}) => {
  const [imageIndex, setImageIndex] = useState(0);//보고있는 이미지의 index

  /* 이미지 영역 */
  const leftArrowClickHandler = (event) => {
      event.preventDefault();
      if(imageIndex === 0) return;//넘어서지 않게 한다
      else setImageIndex((cur) => cur - 1);
  };

  const rightArrowClickHandler = (event) => {
      event.preventDefault();
      if(imageIndex === imgList.length - 1) return;//넘어서지 않게 한다
      else setImageIndex((cur) => cur + 1);
  };

  const moveImageHandler = () => {
      document.querySelector(`#onlyImageArea_${pageIndex}`).style.transform = `translate(-${(imageIndex * 100) / imgList.length}%)`;
  };
  useEffect(moveImageHandler, [imageIndex]);

  return(
      <div className={Style.imageArea}>
          <div className={Style.onlyImageArea} onClick={pageClickFunc}>
              <div style={{overflow:"hidden"}}>
                  <div id={`onlyImageArea_${pageIndex}`} style={{width:`${100 * imgList.length}%`, height: "100%", transition: "transform 0.5s"}}>
                      {
                          imgList.map((imageUrl, index) =>
                              <div style={{height: "100%", width: `${100 / imgList.length}%`, float: "left"}} key={index}>
                                  <img src={imageUrl} style={{width: "100%", height: "100%", objectFit: "contain", cursor: "pointer"}}/>
                              </div>
                          )
                      }
                  </div>
              </div>
          </div>
          <div className={Style.ImageBtnArea}>
              {
                  imgList.length === 1 ?
                  null
                  :
                  <div className={Style.flexBoxCenter}>
                      <img id={`leftArrow_${pageIndex}`} src={leftArrow} className={Style.ImageChangeBtn} onClick={leftArrowClickHandler}/>
                      <img id={`rightArrow_${pageIndex}`} src={rightArrow} className={Style.ImageChangeBtn} onClick={rightArrowClickHandler}/>
                  </div>
              }
          </div>
      </div>
  );
};

export default ImageArea;