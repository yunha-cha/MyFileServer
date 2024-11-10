import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./account/login/Login";
import Join from "./account/join/Join";
import Main from "./main/Main";

import SideBar from "./common/SideBar";
import ForumMain from "./forum/pages/ForumMain";


function App() {
  return (
    <BrowserRouter>
      <SideBar/>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/forum" element={<ForumMain/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
