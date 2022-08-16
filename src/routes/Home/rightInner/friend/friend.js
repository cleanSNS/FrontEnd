import Style from './friend.module.css';
import FriendProfile from './friendProfile';

const RightFriend = () => {
    return(
        <div className={Style.wholeCover}>
            <div className={Style.myProfileCover}>
                <div className={Style.myProfile}>
                    <div className={Style.myProfilePicCover}>
                        <p className={Style.myProfilePic}>이미지</p>
                    </div>
                    <div className={Style.myProfileNameCover}>
                        <p className={Style.myProfileName}>내 이름</p>
                    </div>
                </div>
            </div>
            <div className={Style.friendList}>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img'} name={'nnnnnnnnnnnn'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img2'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img3'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img4'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img5'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img6'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img7'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <FriendProfile img={'img8'} name={'mmmmmmmmmmmm'} />
                </div>
            </div>
        </div>
    );
}

export default RightFriend