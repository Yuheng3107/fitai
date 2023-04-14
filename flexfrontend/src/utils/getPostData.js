import { backend } from "../App.tsx";

export const getUserPostsAsync = async function (pk) {
  try {
    let res = await fetch(`${backend}/exercises/exercise/${pk}`, {
      method: "GET",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}