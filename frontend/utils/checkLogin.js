import { backend } from "../pages/App";

function checkLoginStatus() {


    // modify to return boolean
    fetch(`${backend}/check_login_status`, {
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

export default checkLoginStatus;