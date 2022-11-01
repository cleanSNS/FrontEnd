import Style from './contentArea.module.css';

const ContentArea = ({data}) => {
    return(
        data === '!모자이크!' ?
        <p className={Style.pageContentSware}>{data}</p>
        :
        <p className={Style.pageContent}>{data}</p>
    )
};

export default ContentArea;