import { backend } from "../pages/App";

function checkLoginStatus(currentLoginState, updateLoginState) {
  // modify to return boolean
  fetch(`${backend}/users/status`, {
    method: "GET",
    credentials: "include", // include cookies in the request
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
    },
    body: JSON.stringify(),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data !== currentLoginState) {
        updateLoginState(data);
        console.log(data);
      }
    })
    .catch((error) => console.error(error));
}

export default checkLoginStatus;
