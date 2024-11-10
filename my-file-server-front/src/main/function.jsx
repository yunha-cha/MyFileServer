import axios from "axios";
import api from "../common/api";

//개인 클라우드 파일 가져오는 함수임
export const getMyFile = async (page,setMyFiles, setTotalElements) => {
    const res = await api.get(`/main/file?page=${page}`);
    setTotalElements && setTotalElements(res.data.totalElements);
    setMyFiles(res.data.content);
}
//공용 클라우드 파일 가져오는 함수임
export const getPublicFile = async (page,setMyFiles, setTotalElements) => {
    const res = await api.get(`/main/file/public?page=${page}`);
    setTotalElements && setTotalElements(res.data.totalElements);
    setMyFiles(res.data.content);
}

//파일 사이즈 Byte 받아서 이쁘게 계산해주는 함수임
export const calcFileSize = (size) => {
    if (size < 1024) {
      return size + " Bytes";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
};

//파일 지우는 함수임
export const deleteFile = async (fileCode) => {
    await api.delete(`/main/file/${fileCode}`);
}

//파일 다운로드 하는 함수임
export const downloadFile = async (file) => {      
    await api.post(`/main/download-count/${file.fileCode}`);
    const fileFullPath = file.fileFullPath;
    
    axios({
      url: fileFullPath,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: localStorage.getItem("token") // JWT 토큰 추가
      },
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName); // 다운로드할 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      console.error('Error downloading the file:', error);
    });
};

//시간을 이쁘게 출력해주는 함수임
export const formattedDateTime = (uploadedAt) => {
  const [year, month, day, hour, minute, second] = uploadedAt.map((time) => {
      if (time === undefined || time === null) {
          return "00";
      } else if (time.toString().length === 1) {
          return `0${time}`;
      } else {
          return time;
      }
  });
  if(second===undefined){
      return `${year}/${month}/${day} | ${hour}:${minute}:00`
  }
  return `${year}/${month}/${day} | ${hour}:${minute}:${second}`;
};