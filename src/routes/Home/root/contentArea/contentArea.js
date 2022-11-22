import Style from './contentArea.module.css';

const ContentArea = ({data}) => {
    return(
        data === '!검열!' ?
        <pre className={Style.pageContentSware}>{data}</pre>
        :
        <pre className={Style.pageContent}>{data}</pre>
    )
};

export default ContentArea;