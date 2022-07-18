//회원가입 부분

const SignUp = ({changeContent}) => {
    return(
        <div className="container">
           <form className="row">
            <div className="col-12 my-3">
                <input className="form-control" type="email" placeholder="Email" />
            </div>
            <div className="col-12 my-3">
                <input className="form-control" type="password" placeholder="Password" />
            </div>
            <div className="col-12 my-3">
                <input className="form-control" type="password" placeholder="Password 확인" />
            </div>
            <div className="col-12 my-3">
                <input className="form-control" type="text" placeholder="닉네임" />
            </div>

            <div className="col-3 my-3">
                <input className="form-control" type="number" placeholder="나이" />
            </div>
            <div className="form-check col-9 my-3">
            <input type="checkbox" className="form-check-input" id="ageAgree"/>
            <label className="form-check-label" htmlFor="ageAgree">해당 정보를 공개하려면 체크하십시오</label>
            </div>
            
            
           </form>
        </div>
    );
}

export default SignUp;