import api from "../common/api";
/**
 * 개인 클라우드의 폴더 안에 있는 파일 가져오는 함수
 * @param {number} folderCode 무슨 폴더 안에 파일 가져올지
 * @param {function} callBack 콜백함수
 */
export const getPrivateFile = async (folderCode, callBack) => {
    const res = await api.get(`/main/folder?folderCode=${folderCode}`);
    callBack(res.data);
}
/**
 * 폴더 만들기
 * @param {string} folderName 폴더 이름 
 * @param {number} folderCode 폴더 코드
 * @param {function} callBack 콜백 함수(a) 메게변수는 서버 응답.data
 */
export const createFolder = async (folderName, folderCode, callBack) => {
    const res = await api.post(`/main/folder`,{folderName:folderName,folderCode:folderCode});
    callBack(res.data);
}
/**
 * /main/upload
 * 개인 클라우드 파일 업로드 함수
 * @param {file} file 파일 예)e.target.files[0]
 * @param {string} description  파일 이름
 * @param {number} folderCode 파일이 들어갈 폴더 코드
 * @param {function} callBack 콜백 함수(a) 메게변수는 서버응답.data
 */
export const creataPrivateFile = async (file,description,folderCode,callBack) => {
    const res = await api.post(`/main/upload`,{file:file,description:description,folderCode:folderCode});
    callBack(res.data);
}