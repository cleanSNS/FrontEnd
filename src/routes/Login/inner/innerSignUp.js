//회원가입 부분

const SignUp = ({changeContent}) => {
    return(
        <div className="container bg-light border rounded-3 shadow">
           <form>
            <fieldset className="row">
                <legend>
                    <p className="my-4 d-flex flex-column justify-content-center align-items-center fw-bold">회 원 가 입</p>
                </legend>
                <div className="col-12 my-3">
                    <input className="form-control shadow-sm" type="email" placeholder="Email" />
                </div>
                <div className="col-12 my-3">
                    <input className="form-control shadow-sm" type="password" placeholder="Password" />
                </div>
                <div className="col-12 my-3">
                    <input className="form-control shadow-sm" type="password" placeholder="Password 확인" />
                </div>
                <div className="col-12 my-3">
                    <input className="form-control shadow-sm" type="text" placeholder="닉네임" />
                </div>

                <div className="col-4 my-3">
                    <input className="form-control shadow-sm" type="number" placeholder="나이" />
                </div>
                <div className="form-check col-3 my-3">
                    <input type="checkbox" className="form-check-input shadow-sm" id="ageAgree"/>
                    <label className="form-check-label" htmlFor="ageAgree">공개 여부</label>
                </div>
                <div className="form-check col-1 my-3">
                    <input className="form-check-input shadow-sm" type="radio" name="gender" id="male" />
                    <label className="form-check-label" htmlFor="male">남</label>
                </div>
                <div className="form-check col-1 my-3">
                    <input className="form-check-input shadow-sm" type="radio" name="gender" id="female" />
                    <label className="form-check-label" htmlFor="female">여</label>
                </div>
                <div className="form-check col-3 my-3">
                    <input type="checkbox" className="form-check-input shadow-sm" id="ageAgree"/>
                    <label className="form-check-label" htmlFor="ageAgree">공개 여부</label>
                </div>
            </fieldset>
            <div className="row my-4">
                <div className="col-3" />
                <div className="col-3 my-4">
                    <button className="btn btn-light shadow-sm" onClick={changeContent} value="0">취소</button>
                </div>
                <div className="col-3 my-4">
                    <button type="submit" className="btn btn-dark shadow-sm" onClick={changeContent} value="0">회원 가입</button>
                </div>
                <div className="col-3" />
            </div>
           </form>
        </div>
    );
}

export default SignUp;