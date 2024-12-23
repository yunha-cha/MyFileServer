import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { adminGetUsers, searchUsers } from '../apiFunction';
import Pagination from 'react-js-pagination';
import UserDataComponent from './Component/UserDataComponent';
import s from './UserManagement.module.css';
import MobileHeader from '../../main/Mobile/Component/MobileHeader';

const UserManagement = () => {    
    const isMobile = useOutletContext();
    const {data} = useSelector((state)=>state.user);
    const nav = useNavigate();

    const [users, setUsers] = useState([]);
    const [pageStatus, setPageStatus] = useState({page:0,totalElements: 0,});
    const [searchParam, setSearchParam] = useState('');
    const [isSearch, setIsSearch] = useState(false);

    const search = () =>{
        if(searchParam.trim() === '') {return;}
        searchUsers(searchParam,(res)=>{            
            res && setUsers(res);
            setIsSearch(true);
            setSearchParam('');
        })
    }
    const getAllUsers = useCallback(async () => {        
        await adminGetUsers(pageStatus.page, (res) => {
            setPageStatus((prevStatus) => ({
                ...prevStatus,
                totalElements: res.totalElements,
            }));
            setUsers(res.content);
        });
        setIsSearch(false);
    }, [pageStatus.page]);

    useEffect(() => {getAllUsers();}, [pageStatus.page, getAllUsers]);
    useEffect(()=>{if(data &&typeof data==='object'){ data.userRole!=="ROLE_ADMIN"&&nav('/'); }},[data,nav]);

    return (
        <>
        {isMobile&&<MobileHeader title='유저 관리'/>}
        <div className={s.container}>            
            <h1>유저 관리</h1>
            <div className={s.searchConatainer}>
                <input value={searchParam} 
                    onKeyDown={(e)=>e.code==='Enter'&&search()} 
                    onChange={(e)=>setSearchParam(e.target.value)} 
                    placeholder='아이디로 검색'/>
                <button onClick={search}>검색</button>
                {isSearch&&<button onClick={getAllUsers}>전체보기</button>}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>{isMobile?"코드":"유저 코드"}</th>
                        <th>아이디</th>
                        <th>활성화 상태</th>
                        <th>권한</th>
                        <th>비밀번호</th>
                        <th>상태 변경</th>
                    </tr>
                </thead>
                <tbody>
                {users.map((user)=><UserDataComponent key={user.userCode} user={user} setUsers={setUsers}/>)}
                </tbody>
            </table>
            { !isSearch && pageStatus.totalElements > 10 &&
            <div className='pagination'>
                <Pagination
                activePage={pageStatus.page}
                itemsCountPerPage={10}
                totalItemsCount={pageStatus.totalElements}
                onChange={(page)=>setPageStatus({...pageStatus, page:page})}/>
            </div>
            }
        </div>
        </>
    );
};

export default UserManagement;