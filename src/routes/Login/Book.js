//로그인 화면의 책 전체
import Style from "./Book.module.css";
import Logo from "./Logo";
import MainInnerStuff from "./mainInnerStuff";

const Book = () => {
    return(
        <div className={Style.bookcover}>
            <div />
            <div className={Style.wholebook}>
                <div className={Style.clip1}></div>
                <div className={Style.clip2}></div>
                <div className={Style.clip3}></div>
                <div className={Style.clip4}></div>
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="h-25 col-12 d-flex flex-row justify-content-center align-items-center">
                            <Logo />
                        </div>
                        <div className="h-75 col-12">
                            <MainInnerStuff />
                        </div>
                    </div>
                </div>
            </div>
            <div />
        </div>
    );
}

export default Book;