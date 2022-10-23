import Style from './email.module.css';
import {
  emailAuthUrl,
} from '../../apiUrl';
import { useEffect } from 'react';
import axios from 'axios';

const Email = ({authInfo}) => {
  useEffect(() => {//한 번만 실행한다.
    if(authInfo === {}) return;//비어있으면 그냥 종료한다.
    
    axios.post(`${emailAuthUrl}email=${authInfo.email}&authToken=${authInfo.authToken}`,{
      email: authInfo.email,
      authToken: authInfo.authToken,
    })
    .then((res) => {
      alert("정상적으로 인증되었습니다.");
      console.log("인증이 정상적으로 되었습니다.");
    })
    .catch((res) => {
      console.log(res);
      alert("인증에 문제가 있습니다.");
    })
  }, [authInfo]);

  return(
    <div className={Style.WholeCover}>
      <p className={Style.comment}>이메일 인증이 완료되었습니다.<br />해당 페이지를 닫고 다시 페이지로 돌아가 주세요.</p>
    </div>
  )
}

export default Email;