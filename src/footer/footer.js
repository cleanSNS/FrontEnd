import Style from "./footer.module.css";
import PropTypes from 'prop-types';

const Member = ({name, email, github}) =>{
    return(
        <div className={Style.member}>
            <p className={Style.name}>{name}</p>
            <p className={Style.email}>Email - {email}</p>
            <a className={Style.github} href={github}>Github - {github}</a>
        </div>
    );
}
Member.propTypes = {
    name : PropTypes.string,
    email : PropTypes.string,
    github : PropTypes.string,
}

const Members = () => {
    return(
        <div className={Style.memberCover}>
            <Member name="성의현" email="luckhome1020@gmail.com" github="https://github.com/SungIII" />
            <Member name="이종찬" email="reljacer@gmail.com" github="https://github.com/Lipeya" />
            <Member name="임채민" email="chemin9898@gmail.com" github="https://github.com/lacram" />
        </div>
    );
}

export default Members