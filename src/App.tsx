import { useEffect, useState } from "react";
import Login from "./Login";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";

type post = {

  id: number,
  text: string,
  image: string,
  liked: boolean
}

function App () {

return(

  <Routes>

    <Route path="/" element={<Home/>}/>

    <Route path="login" element={<Login/>}/>

  </Routes>
)

}

export default App