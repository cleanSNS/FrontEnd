//로그인의 초기 화면. id, 비번을 쓰는 곳이 있다.

const Main = ({changeContent}) => {
    return(
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <div className="row w-75">
                <form>
                    <div className="col-12">
                        <input type="text" placeholder="Email" className="form-control my-1" />
                    </div>
                    <div className="col-12">
                        <input type="password" placeholder="Password" className="form-control my-1" />
                    </div>
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center my-4">
                        <button className="btn btn-dark w-50 shadow"type="submit">로그인</button>
                    </div>
                </form>
            </div>
            <div className="row w-75">
                <div className="col-6 position-relative">
                    <a href="" className="w-50 text-dark text-center position-absolute text-decoration-none top-50 end-0 translate-middle-y" onClick={changeContent} name="1">비밀번호 찾기</a>
                </div>
                <div className='col-6 position-relative'>
                    <a href="" className="w-50 text-dark text-center position-absolute text-decoration-none top-50 start-0 translate-middle-y" onClick={changeContent} name="2">회원가입</a>
                </div>
            </div>
        </div>
    );
}

export default Main;