import { backend } from "../App.tsx";

export const getUserPostsAsync = async function (pk, set) {
  try {
    let res = await fetch(`${backend}/feed/user_post/latest`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
      body: JSON.stringify({
        user_id: pk,
        set: set,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}