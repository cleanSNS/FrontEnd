import Style from './friend.module.css';
import Profile from '../../root/profile/profile';

const RenderRightFriend = ({friendList, leftBookChangeHandler}) => {
    return(
        <div className={Style.friendList}>
            {
                friendList.length === 0 ? 
                <p className={Style.noFollowee}>친구인 유저가 없습니다.</p>
                :
                friendList.map((data, index) => (
                    <div className={Style.friendProfileCover} key={index}>
                        <Profile img={data.imgUrl} name={data.nickname} userId={data.userId} leftBookChangeHandler={leftBookChangeHandler}/>
                    </div>
                ))
            }
        </div>
    );
};

export default RenderRightFriend;