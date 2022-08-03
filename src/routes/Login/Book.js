//로그인 화면의 책 전체
import Style from "./Book.module.css";
import Logo from "./Logo";
import MainInnerStuff from "./mainInnerStuff";
import Members from "../../footer/footer";

const Book = () => {
    return(
        <div className={Style.bookCover}>
            <div />
            <div className={Style.main}>
                <div className={Style.book}>
                    <div className={Style.clip1} />
                    <div className={Style.clip2} />
                    <div className={Style.bookinnerCover}>
                        <div className={Style.booklogocover}>
                            <Logo />
                        </div>
                        <div>
                            <MainInnerStuff />
                        </div>
                    </div>
                </div>
            </div>
            <div />
            <Members />
        </div>
    );
}

export default Book;