import Style from './pageList.module.css';
import { useState, useEffect } from 'react';
import {
    getFolloweeListUrl,
    getfollowerListUrl,
} from '../../../../apiUrl';
import { getAxios } from '../../../../apiCall';

const UserListArea = ({bottomStuff, refreshAccessToken, leftBookChangeHandler, setted}) => {
  const [userList, setUserList] = useState([]);

  //페이지 이동 시 초기화함수
  const reset = () => {
    if(setted){
      setUserList([]);
    }
  };
  useEffect(reset, [setted]);

  //팔로워/팔로잉을 불러오는 함수
  const presetUserListArea = async () => {
      if(!setted) return;
      let url = "";
      bottomStuff === "FOLLOWER" ? 
      url = getfollowerListUrl
      :
      bottomStuff === "FOLLOWEE" ?
        url = getFolloweeListUrl
        :
        url = ""
      if(url === "") return; //에러상황

      const res = await getAxios(url, {}, refreshAccessToken);
      setUserList(res.data.data);
  };
  useEffect(() => {presetUserListArea();}, [bottomStuff]);

  const userClickHander = (event) => {
      event.preventDefault();
      leftBookChangeHandler("pList/" + event.target.id.split('_')[1]);
  };

  return(
      <div className={Style.pageArea}>
          {
              userList.map((data, index) => (
                  <div className={Style.userArea} key={index} onClick={userClickHander} id={`pageListUserId_${data.userId}`}>
                      <img src={data.imgUrl} className={Style.userImg} id={`pageListUserId_${data.userId}`}/>
                      <p className={Style.userNickname} id={`pageListUserId_${data.userId}`}>{data.nickname}</p>
                  </div>
              ))
          }
      </div>
  );
};

export default UserListArea;