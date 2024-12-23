import MobileMain from "./Mobile/MobileMain";
import '../common/Pagination.css';
import PCMainUpdate from "./PC/PCMainUpdate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    
    return (
    <>
    {isPhone ?<MobileMain user={user}/>:<PCMainUpdate user={user}/>}
    </>
    )
}
export default Main;