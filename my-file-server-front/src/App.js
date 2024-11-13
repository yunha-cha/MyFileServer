import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./account/login/Login";
import Join from "./account/join/Join";
import Main from "./main/Main";
import SideBar from "./common/SideBar";

import ForumMain from "./forum/pages/ForumMain";
import UserPage from "./user-page/UserPage";
import ForumDetail from "./forum/pages/ForumDetail";
import { useState } from "react";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        {/* <Route path="/join" element={<Join/>}/> */}
        <Route element={<SideBar/>}>
          <Route path="/main" element={<Main/>}/>
          <Route path="/user/:id" element={<UserPage/>}/>
          <Route path="/forum" element={<ForumMain/>} />
          <Route path="/forum/:code" element={<ForumDetail/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
