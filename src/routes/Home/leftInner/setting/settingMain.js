import ProfileSetting from './profileSetting';
import NoticeSetting from './noticeSetting';
import PasswordSetting from './passwordSetting';
import FilteringSetting from './filteringSetting';
import BlockSetting from './blockSetting';


//settingState로 가능한 것들 profile // Snotice // password // filtering // block
const LeftSetting = ({settingState}) => {
    return(
        <div>
            { settingState === 'profile' ? <ProfileSetting /> : null }
            { settingState === 'Snotice' ? <NoticeSetting /> : null }
            { settingState === 'password' ? <PasswordSetting /> :null }
            { settingState === 'filtering' ? <FilteringSetting /> : null }
            { settingState === 'block' ? <BlockSetting /> : null }
        </div>
    );
}

export default LeftSetting;