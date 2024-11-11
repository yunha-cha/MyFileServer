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
        const res = await api.post(`/admin/user-enable/${userCode}`);
        console.log(res.data);
    }
    useEffect(()=>{
        getDisableUser();
    },[])
    return (
        <div>
            {data && data.userRole==='ROLE_USER' ? permissionDenied() : 
            <div>
                <div>반갑다 어드민</div>
                {disableUsers.map((user)=>(
                    <div key={user.userCode} className={s.members}>
                        <div>{user.userCode}</div>
                        <div>{user.id}</div>
                        <div>{user.userRole}</div>
                        {user.enable ? <></> : <button onClick={()=>enableUser(user.userCode)}>회원가입 승인</button>}
                    </div>
                ))}
            </div>
            }
        </div>
    )
}

export default JoinMember