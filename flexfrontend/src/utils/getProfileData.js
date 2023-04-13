import { backend } from "../App.tsx";

async function getProfileData(updateFunction) {
  try {
    let res = await fetch(`${backend}/users/user`, {
      method: "GET",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
      body: JSON.stringify(),
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export default getProfileData;
