export const makeIntoArray = (str) => {//문자열을 받아서 시작부분이 욕설인지 아닌지와, 문자열을 잘라서 구분한 함수이다.
    const TOKEN = '!모자이크!';
    let answer = [];

    if(str === null) return ['AI 서버에 문제가 있어서 불러오지 못했습니다.'];//이건 문제 해결되면 지우기

    for(let i = 0; i < str.length; i++){
        const pos = str.indexOf(TOKEN, i);//index가 i인 지점부터 확인하여 시간을 줄인다. 토큰은 6글자이다.
        if(pos === -1){//더 이상 없는 경우이다.
            answer.push(str.substring(i, str.length));//앞으로 탐색할 i지점부터 문자열의 길이 까지를 집어넣는다.
            break;
        }
        if(i !== pos) answer.push(str.substring(i,pos));//같은 경우는 i = 0혹은 연속되는 지점에서 발견 가능하다.
        answer.push(str.substring(pos,pos + TOKEN.length));//!모자이크!를 집어넣는다.
        i = pos + TOKEN.length - 1;//토큰이 6글자이므로 6이 들어간다.
    }

    console.log(answer);//확인용 정상작동 되면 지우기
    return answer;
};