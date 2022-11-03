import axios from "axios";

export const getAxios = async (url, refreshfunc) => {
    try {
        const res = await axios.get(url);
        return res;
    } catch(error) {
        if(error.response.status === 401 || error.response.status === 0){
            await refreshfunc();
            const res = await axios.get(url);
            return res;
        }
    }
};

export const postAxios = async (url, body, refreshfunc) => {
    try {
        const res = await axios.post(url, body);
        return res;
    } catch(error) {
        if(error.response.status === 401 || error.response.status === 0){
            await refreshfunc();
            const res = await axios.post(url, body);
            return res;
        }
    }
};

export const deleteAxios = async (url, refreshfunc) => {
    try {
        const res = await axios.delete(url);
        return res;
    } catch(error) {
        if(error.response.status === 401 || error.response.status === 0){
            await refreshfunc();
            const res = await axios.delete(url)
            return res;
        }
    }
};