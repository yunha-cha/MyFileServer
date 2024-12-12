import '../common/Pagination.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PCMainUpdate from "./PC/PCMainUpdate";
import MobileMainUpdate from './Mobile/MobileMainUpdate';

const Main = () => {
    const nav = useNavigate(); 
    
    const [isPhone, setIsPhone] = useState(false);
    const [user, setUser] = useState(null);
    //모바일인지, PC인지 검사하기
    useEffect(()=>{
        const token = localStorage.getItem('token');
        token? setUser(jwtDecode(token)) : nav('/')
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        isMobile ? setIsPhone(true) : setIsPhone(false);
    },[nav]);
    if(isPhone){
        return <MobileMainUpdate user={user}/>
    }else {        
        return <PCMainUpdate/>
    }
}
export default Main;