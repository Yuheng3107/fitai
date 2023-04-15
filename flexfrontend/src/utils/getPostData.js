import { backend } from "../App.tsx";

export const getUserPostsAsync = async function (user_id, set_no) {
  try {
    let res = await fetch(`${backend}/feed/user_post/latest`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
      body: JSON.stringify({
        user_id: user_id,
        set_no: set_no,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}