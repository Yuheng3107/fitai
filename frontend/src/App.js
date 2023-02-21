import './App.css';

import Navbar from './component/navbar/Navbar';
import Main from './component/main/Main';
import Login from './component/login/Login';


function App() {
  

  return (
    <div>
      <Navbar />
      <span classNameName="text-2xl">testing tailwindCSS text</span>
      <Main />

      <Login />
      
      {/* <div>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />;
        <p>Login State:<span classNameName=''></span></p>
      </div> */}
    </div>
  );
}

export default App;
