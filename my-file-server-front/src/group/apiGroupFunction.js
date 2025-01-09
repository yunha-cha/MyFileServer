import api from "../common/api"

export const groupFindUser = async (id, callBack) => {
    const res = await api.get(`/main/users?id=${id}`);
    callBack(res.data);
}
export const groupCreateGroup = async (users, name, description, callBack) => {
    const userCodeValues = users
    .filter(user => user.userCode)
    .map(user => user.userCode);
    const res = await api.post('/group',{userCodes:userCodeValues,groupName:name,description:description});    
    callBack(res.data);
}
export const groupGetMyGroup = async (callBack) => {
    const res = await api.get('/my-group');
    callBack(res.data);    
}
export const groupGetThisGroup = async (groupCode, callBack) => {
    const res = await api.get(`/group?groupCode=${groupCode}`);
    callBack(res.data);
}
export const groupDeleteGroup = async (groupCode, callBack)=>{
    const res = await api.delete(`/group?groupCode=${groupCode}`);
    callBack(res.data);
}
export async function groupUploadChunk(file, description, folderCode, code, callBack, setPercent, setLoading) {
    const chunkSize = 50 * 1024 * 1024; // 50MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    console.log(setPercent);
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chunk = file.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize);
        const isMergeChunk = chunkIndex === totalChunks - 2;
        const response = await api.post("/main/chunk", {chunk:chunk,chunkIndex:chunkIndex,totalChunks:totalChunks,originalFileName:file.name,description:description,fileSize:file.size,folderCode:folderCode,groupCode:code}
            ,{headers:{ignoreTimeout:isMergeChunk}}
        );
        if(response.data.fileCode){
            callBack(response.data);
        } else if(isMergeChunk){
            setPercent(`병합 작업 중..`);
        } else {
            setLoading((p)=>({...p, upload: false}));
            setPercent(`업로드 ${Math.floor((chunkIndex/totalChunks) * 100)}% 완료`);
        }
    }

}