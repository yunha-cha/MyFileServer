import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./account/login/Login";
import Join from "./account/join/Join";
import Main from "./main/Main";

import SideBar from "./common/SideBar";


function App() {
  return (
    <BrowserRouter>
      <SideBar/>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route path="/main" element={<Main/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
