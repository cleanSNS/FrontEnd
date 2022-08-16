import Style from './numberNotice.module.css';

const NumberNotice = ({number}) => {
    return(
        <div className={Style.cover}>
            <p className={Style.number}>{number}</p>
        </div>
    );
}

export default NumberNotice;