import { backend } from "../App.tsx";

function getProfileData(updateFunction) {
  fetch(`${backend}/users/user`, {
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
      updateFunction(data);
      console.log(data);
    })
    .catch((err) => console.log(err));
}

export default getProfileData;
