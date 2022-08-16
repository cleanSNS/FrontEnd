import Style from './friendProfile.module.css';

const FriendProfile = ({img, name}) => {
    return (
        <div className={Style.friendProfile}>
            <div className={Style.friendProfilePicCover}>
                <p className={Style.friendProfilePic}>{img}</p>
            </div>
            <div className={Style.friendProfileNameCover}>
                <p className={Style.friendProfileName}>{name}</p>
            </div>
        </div>
    );
}

export default FriendProfile;