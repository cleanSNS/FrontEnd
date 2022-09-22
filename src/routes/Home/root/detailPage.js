//가운데에 띄우는 화면
import Style from './detailPage.module.css';
import SinglePage from './singlePage';

const DetailPage = ({pageId}) => {
    return(
        <div className={Style.wholeCover}>
            <SinglePage pageId={pageId} />
        </div>
    );
}

export default DetailPage;