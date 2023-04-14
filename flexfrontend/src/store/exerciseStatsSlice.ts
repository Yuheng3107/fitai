import { createSlice } from "@reduxjs/toolkit";
import { emptyExerciseStats } from "../types/stateTypes";

const exerciseStatsSlice = createSlice({
    name: 'exerciseStats',
    initialState: emptyExerciseStats,
    reducers: {
        setExerciseStats: (state, action) => {
            state = action.payload;
        }
    }
})

export const exerciseStatsActions = exerciseStatsSlice.actions;

export default exerciseStatsSlice;