import Style from './newChat.module.css';

const SingleFriend = ({data, setChosenFriendList, chosenFriendList, addStyle}) => {
  //유저를 클릭하면 chosenfriendList를 변경한다. => 이미 선택중이면 거기서 제외되고, 선택중이 아니면 추가된다.
  const addFriend = () => {
      if(addStyle === null){
          const tmp = [...chosenFriendList];//지금까지 선택된 친구들
          tmp.push(data);//클릭된 유저를 집어넣는다.
          setChosenFriendList(tmp);//선택된 유저를 변경한다.
      }
      else{
          const tmp = [...chosenFriendList];//지금까지 선택된 친구들
          const JSONtmp = tmp.map(d => JSON.stringify(d));
          const JSONdata = JSON.stringify(data);
          const JSONnext = JSONtmp.filter(x => x !== JSONdata);//선택되지 않은 친구들만 집어넣는다.
          setChosenFriendList(JSONnext.map(d => JSON.parse(d)));
      }
  };

  return(
      <div className={Style.singleFriendCover}>
          <div className={Style.singleFriend} onClick={addFriend} style={addStyle}>
              <div className={Style.flexBox}>
                  <img src={data.imgUrl} className={Style.friendImg} />
              </div>
              <div className={Style.flexBox}>
                  <p className={Style.friendNickname}>{data.nickname}</p>
              </div>
          </div>
      </div>
  );
};

export default SingleFriend;