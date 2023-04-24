import { backend } from "../../App";

export const getExerciseAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/exercises/exercise/${pk}`, {
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

export const getExerciseRegimeAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/exercises/exercise_regime/${pk}`, {
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
