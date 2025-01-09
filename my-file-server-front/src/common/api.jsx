import axios from "axios";

const api = axios.create({
    // baseURL: '/api',  // 리버스 프록시 경로 설정
    baseURL: 'http://localhost:8080'
});

// 요청 인터셉터 설정
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // 토큰이 있으면 헤더에 추가
            config.headers.Authorization = token;
        }
        if(config.headers.ignoreTimeout){
            config.timeout = 0;
        }
        config.credentials = 'include';

        if (config.method === 'post' || config.method === 'put') {
            // POST나 PUT 요청일 경우 FormData 사용
            const formData = new FormData();
            for (const key in config.data) {
                formData.append(key, config.data[key]);
            }
            config.data = formData;
            config.headers['Content-Type'] = 'multipart/form-data';
            
        }
        return config;
    },
    (error) => {
        console.log(`요청 중에 에러 발생: ${error}`);
        return Promise.reject(error);
    }
);


// 응답 인터셉터 설정
api.interceptors.response.use(
    (response) => {
        // 정상 응답 처리
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/';
            } else if (error.response.status === 401) { // JWT 토큰이 없을 때
                alert('로그인이 만료되었습니다.');
                localStorage.removeItem('token');
                window.location.href = '/';
            } else if (error.response.status === 400) {
                console.log(error.response);
                
            }
        } else if (error.request) {
            // 요청 전 에러 발생
            console.log('요청 전 에러 발생:', error);
        } else {
            // 요청 자체를 못했을 때
            console.error(`요청 자체 실패: ${error}`);
        }
        return Promise.reject(error);
    }
);

export default api;
