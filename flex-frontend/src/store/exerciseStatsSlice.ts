import { createSlice } from "@reduxjs/toolkit";
import { emptyExerciseStats } from "../types/stateTypes";

const exerciseStatsSlice = createSlice({
    name: 'exerciseStats',
    initialState: emptyExerciseStats,
    reducers: {
        setExerciseStats: (state, action) => {
            console.log(action.payload);
            return action.payload;
        }
    }
})

export const exerciseStatsActions = exerciseStatsSlice.actions;

export default exerciseStatsSlice;