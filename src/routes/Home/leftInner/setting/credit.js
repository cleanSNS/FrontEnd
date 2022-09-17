import Style from './credit.module.css';
import HongikLogo from './Logo_of_hongik_university.jpg';

const Person = ({name, email, github}) => {
    return(
        <div className={Style.personArea}>
            <p className={Style.name}>{name}</p>
            <p className={Style.email}>{email}</p>
            <a className={Style.github} href={github}>{github}</a>
        </div>
    );
}

const Credit = () => {
    return(
        <div className={Style.wholeCover}>
            <div className={Style.Cover}>
                <img src={HongikLogo} className={Style.HongikLogo} />
            </div>
            <div className={Style.Cover}>
                <div className={Style.creditArea}>
                    <div className={Style.Cover}>
                        <Person name="B711093 / 성의현" email="luckhome1020@gmail.com" github="https://github.com/SungIII" />
                    </div>
                    <div className={Style.Cover}>
                        <Person name="B711142 / 이종찬" email="reljacer@gmail.com" github="https://github.com/Lipeya" />
                    </div>
                    <div className={Style.Cover}>
                        <Person name="B711163 / 임채민" email="chemin9898@gmail.com" github="https://github.com/lacram" />
                    </div>
                    <div />
                </div>
            </div>
        </div>
    );
}

export default Credit;