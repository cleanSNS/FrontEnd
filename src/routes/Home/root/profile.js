import Style from './profile.module.css';

const Profile = ({img, name}) => {
    return (
        <div className={Style.friendProfile}>
            <div className={Style.Cover}>
                <p className={Style.friendProfilePic}>{img}</p>
            </div>
            <div className={Style.Cover}>
                <p className={Style.friendProfileName}>{name}</p>
            </div>
        </div>
    );
}

export default Profile;