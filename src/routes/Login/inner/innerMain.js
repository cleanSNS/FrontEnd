//로그인의 초기 화면. id, 비번을 쓰는 곳이 있다.

const Main = ({changeContent}) => {
    return(
        <div>
            <form >
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">로그인</button>
            </form>
            <button onClick={changeContent} value="1">비밀번호 찾기</button>
            <button onClick={changeContent} value="2">회원가입</button>
        </div>
    );
}

export default Main;