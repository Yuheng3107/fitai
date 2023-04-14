import React, { useState, useEffect } from "react";

import { ExerciseStats } from "../../types/stateTypes";
import { exercises } from "../../App";

//redux imports
import { useAppSelector } from "../../store/hooks";

type ExerciseStatsDisplayProps = {
  exerciseStats: ExerciseStats;
};


const ExerciseStatsDisplay = ({  }: ExerciseStatsDisplayProps) => {
  const exerciseStats = useAppSelector(state => state.exerciseData)
  return (
    <div
      id="exercise-stats"
      className="flex flex-col justify-start w-full mt-2 h-full px-10"
    >
      <div className="flex flex-row justify-between w-full h-32">
        <div
          id="fav-exercise"
          className="flex flex-col border border-zinc-500 p-2 rounded-lg h-full w-5/12"
        >
          <span className="text-xs">Favourite Exercise</span>
          <span className="text-xl">{exerciseStats?.favorite_exercise?.exercise === null ? "None" : exercises[exerciseStats?.favorite_exercise?.exercise]}</span>
          <div>
            <span className="text-sm font-semibold">{exerciseStats?.favorite_exercise?.total_reps ? exerciseStats?.favorite_exercise?.total_reps : "0" }</span>
            <span className="text-xs"> Reps</span>
          </div>
          <div>
            <span className="text-sm font-semibold">{exerciseStats.favorite_exercise.perfect_reps ? Math.round(exerciseStats?.favorite_exercise?.perfect_reps / exerciseStats?.favorite_exercise?.total_reps*100) : "0" }%</span>
            <span className="text-xs"> Perfect</span>
          </div>
        </div>
        <div className="flex flex-col justify-between w-5/12">
          <div
            id="streak"
            className="flex flex-col border border-zinc-500 p-2 rounded-lg"
          >
            <span className="text-xs">Longest Streak&#9889;</span>
            <span className="text-xl">{exerciseStats?.streak} days</span>
          </div>
          <div
            id="calories"
            className="flex flex-col border border-zinc-500 p-2 rounded-lg"
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
          className="flex flex-col border border-zinc-500 p-2 rounded-lg w-full"
        >
          <span className="text-xs">Favourite Workout</span>
          <span className="text-2xl">HIIT</span>
          <div>
            <span className="text-sm font-semibold">42</span>
            <span className="text-xs"> Times</span>
          </div>
          <div>
            <span className="text-sm font-semibold">11</span>
            <span className="text-xs"> hrs </span>
            <span className="text-sm font-semibold">42</span>
            <span className="text-xs"> mins</span>
          </div>
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
