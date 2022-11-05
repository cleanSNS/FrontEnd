import Style from './newPost.module.css';

const ImageList = ({deleteImage, renderedNewPostImages}) => {
  return (
      <div style={{width: `${renderedNewPostImages.length * 200}px`, height: "100%"}}>
          {
              renderedNewPostImages.map((data, index) =>(
                  <img className={Style.singlepicture} src={data} key={index} id={index} onClick={deleteImage} />
              ))
          }
      </div>
  );
};

export default ImageList;