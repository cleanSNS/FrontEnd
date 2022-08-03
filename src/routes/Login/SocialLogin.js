import { useEffect } from 'react';
import axios from 'axios';;

const kakaotokenUrl = 'http://52.78.49.137:8080/social/login/kakao';
const navertokenUrl = 'http://52.78.49.137:8080/social/login/naver';

const SocialLogin = () =>{
    const sendCode = () => {
        let url = new URL(window.location.href);
        const userCode = url.searchParams.get('code');
        axios.post(kakaotokenUrl,{
            code : userCode,
        })
            .then((res)=>{
                console.log(res);
                //window.location.href='/';
            })
            .catch((res)=>{
                console.log(res);
                //window.location.href='/login';
            });
    }
    useEffect(sendCode, []);
    return(
        <div>
            <h1>처리중입니다.</h1>
        </div>
    );
}

export default SocialLogin;