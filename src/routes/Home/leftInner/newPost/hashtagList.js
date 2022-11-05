import Style from './newPost.module.css';

const HashtagList = ({deleteTag, newPostHashtag}) => {
  return (
      <div style={{width: "100%", height: "100px"}}>
          {
              newPostHashtag.map((data, index) =>(
                  <button className={Style.singleHashTag} onClick={deleteTag} key={index} value={index}>
                      #{data} 
                  </button>
              ))
          }
      </div>
  );
};

export default HashtagList;