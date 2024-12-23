import api from "../common/api"

export const groupFindUser = async (id, callBack) => {
    const res = await api.get(`/main/users?id=${id}`);
    callBack(res.data);
}
export const groupCreateGroup = async (users, name,description, callBack) => {
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