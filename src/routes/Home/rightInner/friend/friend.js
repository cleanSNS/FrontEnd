import Style from './friend.module.css';
import Profile from '../../root/profile';

const RightFriend = () => {
    return(
        <div className={Style.wholeCover}>
            <div className={Style.Cover}>
                <Profile img={'내사진'} name={'내 이름'} />
            </div>
            <div className={Style.friendList}>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img'} name={'nnnnnnnnnnnn'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img2'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img3'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img4'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img5'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img6'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img7'} name={'mmmmmmmmmmmm'} />
                </div>
                <div className={Style.friendProfileCover}>
                    <Profile img={'img8'} name={'mmmmmmmmmmmm'} />
                </div>
            </div>
        </div>
    );
}

export default RightFriend;