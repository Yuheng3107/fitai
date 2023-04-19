import { backend } from "../App.tsx";

export const acceptFriendRequest = async function (pk) {
  try {
    let res = await fetch(`${backend}/users/user/accept/friend_request`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
      body: JSON.stringify({
        user_id: pk,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const declineFriendRequest = async function (pk) {
  try {
    let res = await fetch(`${backend}/users/user/decline/friend_request`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
      body: JSON.stringify({
        user_id: pk,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const sendFriendRequest = async function (pk) {
  try {
    let res = await fetch(`${backend}/users/user/update/friend_request`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
      body: JSON.stringify({
        fk_list: [pk],
      }),
    })
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}