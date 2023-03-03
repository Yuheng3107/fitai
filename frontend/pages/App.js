import React, { useState } from 'react';

import Navbar from "../components/navbar/Navbar";
import Main from "../components/main/Main";

const backend = "http://localhost:8000";




function getLoginData() {
  fetch(`${backend}/get_login_data`, {
    method: "GET",
    credentials: "include", // include cookies in the request
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
    },
    body: JSON.stringify(),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}



function App() {

  return (
    <div className="h-screen dark:bg-zinc-900 dark:text-zinc-50">
      <Navbar />
      <Main />
    </div>
  );
}

export default App;
export {backend}