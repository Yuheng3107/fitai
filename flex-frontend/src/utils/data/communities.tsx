import { backend } from "../../App";

export const getCommunityAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/community/community/${pk}`, {
      method: "GET",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const getCommunityListAsync = async function (pks:Number[]) {
  try {
    let res = await fetch(`${backend}/community/community/list`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        communities: pks,
      }),
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const joinCommunityAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/update/communities`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
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

export const leaveCommunityAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/delete/communities/${pk}`, {
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
