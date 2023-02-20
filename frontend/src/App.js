import './App.css';
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

import Navbar from './component/navbar/Navbar';


function App() {
  return (
    <div>
      <Navbar />
      <span className="text-2xl">testing tailwindCSS text</span>
      <main></main>
      <div>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />;
        <p>Login State:<span className=''></span></p>
      </div>
    </div>
  );
}

export default App;
