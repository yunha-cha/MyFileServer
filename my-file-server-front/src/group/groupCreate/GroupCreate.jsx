import React, { useState } from 'react';
import { groupCreateGroup, groupFindUser } from '../apiGroupFunction';

const GroupCreate = () => {
    const [invitedUser, setInvitedUser] = useState([]); //초대 목록
    const [findedUsers, setFindedUsers] = useState([]); //찾은 유저
    const [inputs, setInputs] = useState({              //입력 값 핸들
        searchParam: '',
        groupName: '',
        description: '',
    });
    const handleOnChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };
    const findUser = () => {
        groupFindUser(inputs.searchParam, (r) => {
            setFindedUsers(r);
        });
    }
    const inviteUser = (user) => { setInvitedUser(p => [...p, user]); }
    const cancleInviteUser = (canceledUser) => {
        setInvitedUser(users => users.filter(user => user.userCode !== canceledUser.userCode ? user : null))
    }
    const createGroup = () => {
        groupCreateGroup(invitedUser,inputs.groupName,inputs.description, ()=>{});
    }
    return (
        <div>
            <input name='groupName' value={inputs.groupName} onChange={handleOnChange} placeholder='그룹 이름을 입력'/>
            <input name='description' value={inputs.description} onChange={handleOnChange} placeholder='그룹 설명을 입력'/>

            <div>
                <div>
                    <input name='searchParam' value={inputs.searchParam} onChange={handleOnChange} />
                    <button onClick={findUser}>찾기</button>
                </div>
                <div>
                    {findedUsers.map(user => (
                        <div key={user.userCode}>
                            <div>{user.id}</div>
                            <button onClick={() => inviteUser(user)}>추가하기</button>
                        </div>
                    ))}
                </div>
                <div>
                    {invitedUser.map(user => (
                        <div key={user.userCode}>
                            <div>{user.id}</div>
                            <button onClick={() => cancleInviteUser(user)}>빼기</button>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={createGroup}>생성</button>
        </div>
    );



};

export default GroupCreate;