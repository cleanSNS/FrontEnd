//회원가입 창의 form과 버튼부분

const SignUp = ({changeContent}) => {
    return(
        <div>
            <form>
                <input type="email" id="Email" placeholder="Email" />
                <input type="password" id="Password" placeholder="Password" />
                <input type="password" id="PasswordCheck" placeholder="Password확인" />
                <input type="text" id="nickname" placeholder="닉네임" />
                <input type="number" id="age" placeholder="나이" />
                <label>남<input name="gender" value="male" type="radio" /></label>
                <label>여<input name="gender" value="female" type="radio" /></label>
                <button onClick={changeContent} value="0">취소</button>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default SignUp;