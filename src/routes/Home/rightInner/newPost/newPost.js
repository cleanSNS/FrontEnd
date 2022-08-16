import Style from './newPost.module.css';

const RightNewPost = () => {
    return(
        <div className={Style.WholeCover}>
            <div className={Style.eachSettingCover}>
                <div className={Style.settingCover}>
                    <div className={Style.settingNameCover}>
                        <p className={Style.settingName}>좋아요 알림</p>
                    </div>
                    <div className={Style.settingsCover}>
                        <div className={Style.twoSetting}>
                            <div className={Style.setCover}>
                                <p className={Style.pickedSetting} >허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.eachSettingCover}>
                <div className={Style.settingCover}>
                    <div className={Style.settingNameCover}>
                        <p className={Style.settingName}>댓글 알림</p>
                    </div>
                    <div className={Style.settingsCover}>
                        <div className={Style.twoSetting}>
                            <div className={Style.setCover}>
                                <p className={Style.pickedSetting} >허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.eachSettingCover}>
                <div className={Style.settingCover}>
                    <div className={Style.settingNameCover}>
                        <p className={Style.settingName}>읽기 권한</p>
                    </div>
                    <div className={Style.settingsCover}>
                        <div className={Style.threeSetting}>
                            <div className={Style.setCover}>
                                <p className={Style.pickedSetting} >허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.eachSettingCover}>
                <div className={Style.settingCover}>
                    <div className={Style.settingNameCover}>
                        <p className={Style.settingName}>댓글 읽기 권한</p>
                    </div>
                    <div className={Style.settingsCover}>
                        <div className={Style.threeSetting}>
                            <div className={Style.setCover}>
                                <p className={Style.pickedSetting} >허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.eachSettingCover}>
                <div className={Style.settingCover}>
                    <div className={Style.settingNameCover}>
                        <p className={Style.settingName}>댓글 쓰기 권한</p>
                    </div>
                    <div className={Style.settingsCover}>
                        <div className={Style.threeSetting}>
                            <div className={Style.setCover}>
                                <p className={Style.pickedSetting} >허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Style.eachSettingCover}>
                <div className={Style.settingCoverLast}>
                    <div className={Style.settingNameCover}>
                        <p className={Style.settingName}>좋아요 읽기 권한</p>
                    </div>
                    <div className={Style.settingsCover}>
                        <div className={Style.threeSetting}>
                            <div className={Style.setCover}>
                                <p className={Style.pickedSetting} >허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >팔로우 된 사람만 허용</p>
                            </div>
                            <div className={Style.setCover}>
                                <p className={Style.notPickedSetting} >거부</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightNewPost