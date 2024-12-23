import React from 'react';
import { adminDisableUser, adminEnableUser } from '../../apiFunction';
import { useNavigate } from 'react-router-dom';
import { truncateString } from '../../../main/function';

const UserDataComponent = ({user, setUsers }) => {
    const nav = useNavigate();
    // const deleteUser = (userCode) => {
    //     console.log(userCode);
        
    // }
    const disableUser = (userCode) => {
        adminDisableUser(userCode,()=>{
            setUsers((users) => users.map((user)=>user.userCode === userCode?{...user, enable:false}:user));
        });
    }
    const enableUser = (userCode) => {
        adminEnableUser(userCode, ()=>{
            setUsers((users) => users.map((user)=>user.userCode === userCode?{...user, enable:true}:user));
        })
    }
    const goToUserPage = () => {
        nav(`/user/${user.userCode}`)
    }
    return (
        <tr>
            <td style={{width:'10%'}}>{user.userCode}</td>
            <td onClick={goToUserPage} style={user.userRole==="ROLE_ADMIN"?{color:'red'}:{cursor:'pointer'}}>{user.id}</td>
            <td style={{textAlign:'center'}}>{user.enable ? '활성화' : '비활성화'}</td>
            <td style={{textAlign:'center'}}>{user.userRole==='ROLE_ADMIN'?"관리자":"유저"}</td>
            <td onClick={()=>alert(user.rpw)} style={{textAlign:'center'}}>{truncateString(user.rpw,12)}</td>
            <td>
                {
                user.enable?
                    <button onClick={()=>disableUser(user.userCode)}>비활성화</button>
                :
                    <div>
                        {/* <button onClick={()=>deleteUser(user.userCode)}>완전 삭제</button> */}
                        <button onClick={()=>enableUser(user.userCode)}>활성화</button>
                    </div>
                }
            </td>
        </tr>
    );
};

export default UserDataComponent;