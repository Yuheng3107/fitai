import React, { useState } from 'react';

import Navbar from "../components/navbar/Navbar";
import Main from "../components/main/Main";

const backend = "http://localhost:8000";




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