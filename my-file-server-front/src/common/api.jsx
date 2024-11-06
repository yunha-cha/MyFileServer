import axios from "axios";

//로그인 페이지 url 세팅
const loginPageURL = '/login';

const api = axios.create({
    baseURL: `http://${process.env.REACT_APP_IP}`,
});

//요청
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            //토큰있으면 헤더에 추가
            config.headers.Authorization = token;
        }

        if(config.method === 'post' || config.method === ' put'){
            //만약 post 나, put 이라면 폼데이터 사용
            const formData = new FormData();
            for(const key in config.data){          
                formData.append(key, config.data[key]);
            }
            config.data = formData;
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        console.log(`요청 중에 에러 발생 : ${error}`);
        return Promise.reject(error);
    }
);

//응답
api.interceptors.response.use(
    (response) => {
        //정상 응답 온거 처리할거 적기

        return response;
    },
    (error) => {
        if(error.response){
            if(error.response.status === 403){
                alert('토큰이 만료되었습니다.');
                console.log(error.response);
            } else if(error.response.status === 401){   //jwt토큰이 없을 때
                window.location.href = '/';
                alert('토큰이 없거나, Bearer가 포함되어 있지 않습니다.');
            } else if(error.response.status === 400){
                alert('400 에러');
            }
        } else if(error.request){
            //요청 전에 에러 생겼을 때
            console.log('ss');
            
            console.log(error);
        } else {
            //요청도 못했을 때
            console.error(`요청도 못함 : ${error}`)
        }
    }
);

export default api;