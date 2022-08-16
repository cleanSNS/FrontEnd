import Style from './notice.module.css';

const Notice = ({img, script}) => {
    return(
        <div className={Style.noticeBlock}>
            <div className={Style.noticeCover}>
                <div className={Style.noticeImgCover}>
                    <p className={Style.noticeImg}>{img}</p>
                </div>
                <div className={Style.scriptCover}>
                    <p className={Style.script}>{script}</p>
                </div>
            </div>
        </div>
    );
};

const RightNotice = () => {
    return(
        <div className={Style.noticeList}>
            <Notice img='aaa' script='fsdfsd' />
            <Notice img='aaa' script='sdfsdf' />
            <Notice img='aaa' script='fdsdfsdfsdf' />
            <Notice img='aaa' script='ffsdfsdf' />
            <Notice img='aaa' script='ffsd' />
            <Notice img='aaa' script='fsdfsssdfd' />
            <Notice img='aaa' script='fsdfssdfsd' />
            <Notice img='aaa' script='fsdssfsd' />
            <Notice img='aaa' script='fsdfsssssd' />
            <Notice img='aaa' script='fsdfsssssfdfsd' />
        </div>
    );
};

export default RightNotice;