//빨간색 알림이고 숫자 있는 친구
import Style from './numberNotice.module.css';

const NumberNotice = ({number}) => {
    return(
            <div className={Style.cover}>
                <p className={Style.number}>{number + 30}</p>
            </div>
    );
}

export default NumberNotice;