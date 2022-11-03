import axios from "axios";
import {
    withdrawalUrl,   
} from './apiUrl';

export const getAxios = async (url, header, refreshfunc) => {
    try {
        const res = await axios.get(url, header);
        return res;
    } catch(error) {
        if(error.response.status === 401 || error.response.status === 0){
            await refreshfunc();
            const res = await axios.get(url, header);
            return res;
        }
    }
};

export const postAxios = async (url, body, header, refreshfunc) => {
    try {
        const res = await axios.post(url, body, header);
        return res;
    } catch(error) {
        console.log(error.response.data.message);

        if(url === withdrawalUrl && error.response.message === "이메일 혹은 비밀번호가 틀립니다."){
            return "fail";   
        }
        if(error.response.status === 401 || error.response.status === 0){
            await refreshfunc();
            const res = await axios.post(url, body);
            return res;
        }
    }
};

export const deleteAxios = async (url, header, refreshfunc) => {
    try {
        const res = await axios.delete(url, header);
        return res;
    } catch(error) {
        if(error.response.status === 401 || error.response.status === 0){
            await refreshfunc();
            const res = await axios.delete(url, header);
            return res;
        }
    }
};