import React, { useState, useEffect } from "react";

//components
import Login from "../login/Login";

//login utils
import checkLoginStatus from "../../utils/checkLogin";
import getProfileData from '../../utils/getProfileData.js';
import { profile } from "@tensorflow/tfjs-core";


function Navbar() {

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [profileData, setProfileData] = useState({});


  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`)
    console.log(`the current profileData is ${profileData}`)
    checkLoginStatus(loginStatus, setLoginStatus);

    if (loginStatus && !Object.keys(profileData).length) {
      getProfileData(setProfileData);
    }
  }, [loginStatus, setLoginStatus, checkLoginStatus, getProfileData, setProfileData, profileData])

  function showMobileMenu() {
    setMobileMenuVisible((prevState) => {
      return !prevState;
    });
  }



  return (
    <nav className="text-2xl bg-white text-zinc-900 border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900">
      <div className="container flex flex-wrap flex-row items-center justify-between mx-auto">
        <a href="#" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-zinc-900 dark:text-white">
            FIT AI
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={showMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className={`${mobileMenuVisible ? "hidden" : "block"} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 
          md:flex-row md:items-center md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white 
          dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                aria-current="page"
              >
                App
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Tutorial
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Form
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Lobby
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                About
              </a>
            </li>
            {!loginStatus ? <li>
              <Login setLoginStatus={setLoginStatus} />
            </li> :
              <li className="block py-2 pl-3 pr-4 text-zinc-50">Hi, {profileData.username}</li>}

          </ul>

        </div>
      </div>
    </nav>
  );
}
export default Navbar;
