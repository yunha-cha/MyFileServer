import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../common/api';
import s from './JoinMember.module.css';

function JoinMember() {
    const {data} = useSelector((state)=>state.user);
    const [disableUsers, setDisableUsers] = useState([]);
    const nav = useNavigate();
    const permissionDenied = () => {
        alert('잘못된 접근입니다.');
        nav('/');
    }
    const getDisableUser = async () => {        
        const res = await api.get('/admin/disable-user');
        setDisableUsers(res.data);
    }
    const enableUser = async (userCode) => {
        await api.post(`/admin/user-enable/${userCode}`);
        getDisableUser();
    }
    useEffect(()=>{
        getDisableUser();
    },[])
    return (
        <div className={s.container}>
            {data && data.userRole==='ROLE_USER' ? permissionDenied() : 
            <div>
                {disableUsers[0] ? disableUsers.map((user)=>(
                    <div key={user.userCode} className={s.members}>
                        <div>{user.userCode}</div>
                        <div>{user.id}</div>
                        <div>{user.userRole}</div>
                        {user.enable ? <></> : <button onClick={()=>enableUser(user.userCode)}>회원가입 승인</button>}
                    </div>
                )):<div>회원 가입을 요청한 유저가 없습니다.</div>}
            </div>
            }
        </div>
    )
}

export default JoinMember