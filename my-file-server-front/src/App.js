import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./account/login/Login";
import Join from "./account/join/Join";
import Main from "./main/Main";

import SideBar from "./common/SideBar";
import UserPage from "./user-page/UserPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        {/* <Route path="/join" element={<Join/>}/> */}
        <Route element={<SideBar/>}>
          <Route path="/main" element={<Main/>}/>
          <Route path="/user/:id" element={<UserPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
