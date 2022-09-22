//빨간색 알림이고 숫자 있는 친구
import Style from './numberNotice.module.css';

const NumberNotice = ({number}) => {
    console.log(number);
    return(
            (number === "0" || number === 0) ?
            null
            :
            <div className={Style.cover}>
                <p className={Style.number}>{number}</p>
            </div>
    );
}

export default NumberNotice;