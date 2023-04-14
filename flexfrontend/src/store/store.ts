import { configureStore } from "@reduxjs/toolkit";

import profileDataSlice from './profileDataSlice'

const store = configureStore({
    reducer: {
        profile: profileDataSlice.reducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;