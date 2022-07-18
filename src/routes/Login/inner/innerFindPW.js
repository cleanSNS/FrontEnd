//비밀번호 찾기 창의 비밀번호 찾는 부분

const FindPW = ({changeContent}) => {
    return(
        <div className="container w-75">
            <div className="row text-center">
                <p>로그인에 문제가 있나요?<br />이메일 주소를 입력하시면<br /> 다시 엑세스 할 수 있는 링크를 보내드립니다.</p>
            </div>
            <div className="row">
                <form>
                    <div className="col-12">
                        <input className="form-control my-5 shadow" type="email" placeholder="Email" />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-dark my-2 w-100 shadow" type="submit">비밀번호 초기화 링크 보내기</button>
                    </div>
                </form>
                <div className="col-12">
                    <button className=" btn btn-dark my-2 w-100 shadow" onClick={changeContent} value="2">회원가입 하기</button>
                </div>
                <div className="col-12">
                    <button className="col-12 btn btn-dark my-2 w-100 shadow" onClick={changeContent} value="0">로그인으로 돌아가기</button>
                </div>
            </div>
        </div>
    );
}

export default FindPW;