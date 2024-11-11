import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import api from "../common/api";


function UserPage() {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const getUser = useCallback(async () => {
        const res = await api.get(`/main/other-user/${id}`);
        if(typeof res.data === 'object'){setUser(res.data);} else {setUser(null)}
    },[id]) 
    useEffect(()=>{getUser()},[getUser])
    return (
        <div>
            {
            user?
            <div>
                <div>{user.id}</div>
                <div>{user.userRole==="ROLE_USER"?"유저":"어드민"}</div>
            </div>
            :
            <div>유저가 없습니다.</div>
            }
        </div>
    )
}

export default UserPage