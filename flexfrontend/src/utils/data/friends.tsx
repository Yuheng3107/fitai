import { backend } from "../../App";

export const acceptFriendRequest = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/accept/friend_request`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        user_id: pk,
      })
    })
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const declineFriendRequest = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/decline/friend_request`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        user_id: pk,
      })
    })
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const sendFriendRequest = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/update/friend_request`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        user_id: pk,
      }),
    })
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const deleteFriendRequest = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/delete/friend_request/${pk}`, {
      method: "DELETE",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
    })
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const deleteFriend = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/delete/friend/${pk}`, {
      method: "DELETE",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
    })
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}