import Style from './pageList.module.css';

const SingleUser = ({data, leftBookChangeHandler}) => {
  const userClickHander = (event) => {
      event.preventDefault();
      leftBookChangeHandler("pList/" + event.target.id.split('_')[1]);
  };

  return(
    <div className={Style.userArea} onClick={userClickHander} id={`pageListUserId_${data.userId}`}>
        <img src={data.imgUrl} className={Style.userImg} id={`pageListUserId_${data.userId}`}/>
        <p className={Style.userNickname} id={`pageListUserId_${data.userId}`}>{data.nickname}</p>
    </div>
  );
};

export default SingleUser;