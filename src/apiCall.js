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
        if(url === withdrawalUrl && error.response.status === 400){//비밀번호가 틀린 경우이다.
            return {message: "error"};   
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
            const res = await axios.delete(url, header)
            return res;
        }
    }
};