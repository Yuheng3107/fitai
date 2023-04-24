import React, { useState, useEffect } from "react";

import { ExerciseStats } from "../../types/stateTypes";
import { exercises } from "../../App";

type ExerciseStatsDisplayProps = {
  exerciseStats: ExerciseStats;
};

const ExerciseStatsDisplay = ({exerciseStats}: ExerciseStatsDisplayProps) => {

  const moduleWidth = "w-[calc(50%-0.4rem)]";
  const moduleHeight = "h-[calc(50%-0.4rem)]";

  return (
    <div
      id="exercise-stats"
      className="flex flex-col justify-start w-full mt-2 h-full px-5"
    >
      <div id="favex-streak-calories" className="flex flex-row justify-between w-full">
        <div
          id="fav-exercise"
          className={`relative flex flex-col border border-zinc-500 p-3 rounded-lg ${moduleWidth} aspect-square text-white
           bg-cover bg-center bg-[url('https://images.healthshots.com/healthshots/en/uploads/2021/09/06145503/shutterstock_1563301450-1600x900.jpg')]`}
        >

          <span className="text-xs text-orange-400 font-bold z-10">Favourite Exercise</span>
          <span className="text-4xl font-bold mt-3 mb-1 z-10">{exerciseStats?.favorite_exercise?.exercise === null ? "None" : exercises[exerciseStats?.favorite_exercise?.exercise]}</span>
          <div className="z-10">
            <span className="text-lg font-semibold leading-3">{exerciseStats?.favorite_exercise?.total_reps ? exerciseStats?.favorite_exercise?.total_reps : "0"}</span>
            <span className="text-xs"> Reps</span>
          </div>
          <div className="z-10">
            <span className="text-lg font-semibold">{exerciseStats.favorite_exercise.perfect_reps ? Math.round(exerciseStats?.favorite_exercise?.perfect_reps / exerciseStats?.favorite_exercise?.total_reps * 100) : "0"}%</span>
            <span className="text-xs"> Perfect</span>
          </div>
          <div className=" absolute w-full h-full left-0 top-0 bg-gradient-to-r from-gray-900 z-0">
          </div>
        </div>
        <div className={`flex flex-col justify-between ${moduleWidth}`}>
          <div
            id="streak"
            className={`flex flex-col border border-zinc-500 p-2 rounded-lg ${moduleHeight}`}
          >
            <span className="text-xs">Longest Streak&#9889;</span>
            <span className="text-xl">{exerciseStats?.streak} days</span>
          </div>
          <div
            id="calories"
            className={`flex flex-col border border-zinc-500 p-2 rounded-lg ${moduleHeight}`}
          >
            <span className="text-xs">Calories Burnt&#128293; </span>
            <span className="text-xl">
              {exerciseStats?.calories_burnt === undefined
                ? "? kcal"
                : `${exerciseStats?.calories_burnt} kcal`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-evenly mt-2">
        <div
          id="workout"
          className={`flex flex-col border border-zinc-500 p-2 rounded-lg w-full aspect-[2/1]`}
        >
          <span className="text-xs">Favourite Workout</span>
          <span className="text-2xl">{exerciseStats?.favorite_exercise_regime?.name === null ? "None" : exerciseStats?.favorite_exercise_regime?.name}</span>
          <div>
            <span className="text-sm font-semibold">{exerciseStats?.favorite_exercise_regime?.times_completed === null ? "0" : exerciseStats?.favorite_exercise_regime?.times_completed}</span>
            <span className="text-xs"> Times</span>
          </div>
          {/*
          <div>
            <span className="text-sm font-semibold">11</span>
            <span className="text-xs"> hrs </span>
            <span className="text-sm font-semibold">42</span>
            <span className="text-xs"> mins</span>
          </div>
          */}
        </div>
      </div>
      <div className="flex flex-row justify-evenly mt-2">
        <div
          id="breakdown"
          className="flex flex-col border border-zinc-500 p-2 rounded-lg w-full"
        >
          <span className="text-xs">Exercise Breakdown</span>
          <span className="text-3xl">IMAGE HERE</span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseStatsDisplay;
