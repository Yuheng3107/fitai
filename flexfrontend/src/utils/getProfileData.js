import { backend } from "../App.tsx";

export const getProfileDataAsync = async function () {
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

export const getProfileData =  (updateFunction) =>{
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

export const getFavoriteExerciseAsync = async function (pk) {
  try {
    let res = await fetch(`${backend}/exercises/exercise/favorite`, {
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

export const getFavoriteExerciseRegimeAsync = async function (pk) {
  try {
    let res = await fetch(`${backend}/exercises/exercise_regime/favorite`, {
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
