import axios from "axios";
import api from "../common/api";

export const getMyFile = async (page,setMyFiles, setTotalElements) => {
    const res = await api.get(`/main/file?page=${page}`);
    setTotalElements && setTotalElements(res.data.totalElements);
    setMyFiles(res.data.content);
}

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

export const deleteFile = async (fileCode) => {
    const res = await api.delete(`/main/file/${fileCode}`);
}

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

export const upload = async (file,fileName,isPrivate) => {
    if(file){
        const extension = file.name.split('.')[1];
        await api.post('/main/upload',{file:file,description:fileName+'.'+extension,isPrivate:isPrivate});
    }
}