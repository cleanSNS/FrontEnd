import Style from './chat.module.css';
import { chatCalculateTimeFrom } from '../../../../timeCalculation';

const SingleChat = ({data, setLeftBookState, userId, userAndUserImg, userAndUserNickname, oldestChat}) => {
  //유저의 이미지나 이름을 클릭하면 해당 유저의 페이지로 이동한다.
  const goToThatUserPage = (event) => {
      event.preventDefault();
      setLeftBookState(`pList/${data.userId}`);
  };

  return(
      <div className={userId !== data.userId ? Style.singleOtherChattingArea : Style.singleMyChattingArea} ref={oldestChat}>            
          {/* 유저의 프로필 이미지가 오는 곳 */
              userId !== data.userId ?
             <img src={userAndUserImg[data.userId]} className={Style.chatUserimg} onClick={goToThatUserPage}/> : null
          }
          <div className={Style.userchatFlexBox}>
              {/* 유저의 이름이 오는 곳 */
                  userId !== data.userId ?
                  <p className={Style.chatuserName} onClick={goToThatUserPage}>{userAndUserNickname[data.userId]}</p> : null
              }
              {/* 유저의 채팅 내용이 오는 곳 */}
              <div className={Style.chattingText} style={userId !== data.userId ? null : {backgroundColor: "#F4DEDE"}}>{data.message}</div>
              <p className={Style.chatTime}>{chatCalculateTimeFrom(data.createdDate)}</p>
          </div>
      </div>
  );
};

export default SingleChat;