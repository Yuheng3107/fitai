import "./App.css";

import Navbar from "./component/navbar/Navbar";
import Main from "./component/main/Main";
import Login from "./component/login/Login";

function App() {
  return (
    <div className="bg-zinc-900 text-zinc-50">
      <Navbar />
      <Main />

      <Login />
    </div>
  );
}

export default App;
