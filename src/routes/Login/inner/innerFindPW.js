//비밀번호 찾기 창의 비밀번호 찾는 부분

const FindPW = ({changeContent}) => {
    return(
        <div>
            <p>로그인에 문제가 있나요?<br />이메일 주소를 입력하시면<br /> 다시 엑세스 할 수 있는 링크를 보내드립니다.</p>
            <form>
                <input type="email" placeholder="Email" />
                <button type="submit">비밀번호 초기화 링크 보내기</button>
            </form>
            <button onClick={changeContent} value="2">회원가입 하기</button>
            <button onClick={changeContent} value="0">로그인으로 돌아가기</button>
        </div>
    );
}

export default FindPW;