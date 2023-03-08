import { backend } from "../pages/App";

function getProfileData(updateFunction) {
    fetch(`${backend}/users/data`, {
        method: "GET",
        credentials: "include", // include cookies in the request
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
        },
        body: JSON.stringify(),
    })
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((data) => {
            updateFunction(JSON.parse(data));
            console.log(data);
        })
        .catch((err) => console.log(err));
}

export default getProfileData;
