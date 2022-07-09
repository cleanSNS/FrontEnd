//로그인 화면의 책 전체
import Style from "./Book.module.css";
import Logo from "./Logo";
import MainInnerStuff from "./mainInnerStuff";

const Book = () => {
    return(
        <div className={Style.wholebook}>
            <div className={Style.clip1}></div>
            <div className={Style.clip2}></div>
            <div className={Style.clip3}></div>
            <div className={Style.clip4}></div>
            <div className={Style.book}>
                <Logo />
                <MainInnerStuff />
            </div>
        </div>
    );
}

export default Book;