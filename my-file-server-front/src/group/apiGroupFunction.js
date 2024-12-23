import api from "../common/api"

export const groupFindUser = async (id, callBack) => {
    const res = await api.get(`/main/users?id=${id}`);
    callBack(res.data);
}
export const groupCreateGroup = async (users, name, callBack) => {
    const userCodeValues = users
    .filter(user => user.userCode)
    .map(user => user.userCode);
    const res = await api.post('/group',{userCodes:userCodeValues,groupName:name});    
    callBack(res.data);
}
export const groupGetMyGroup = async (callBack) => {
    const res = await api.get('/group');
    callBack(res.data);    
}