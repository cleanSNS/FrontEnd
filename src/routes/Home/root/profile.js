//프로필을 보여주는 JS
import Style from './profile.module.css';

const Profile = ({img, name, userId, leftBookChangeHandler}) => {
    const profileClickHandler = (event) => {
        event.preventDefault();
        //console.log(userId);
        leftBookChangeHandler("pageList/" + userId);
    }

    return (
        <div className={Style.friendProfile} onClick={profileClickHandler}>
            <div className={Style.Cover}>
                <img src={img} className={Style.friendProfilePic}/>
            </div>
            <div className={Style.Cover}>
                <p className={Style.friendProfileName}>{name}</p>
            </div>
        </div>
    );
}

export default Profile;