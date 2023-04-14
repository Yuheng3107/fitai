import { createSlice } from "@reduxjs/toolkit";

const ProfileDataSlice = createSlice({
    name: 'profile',
    initialState: {
        profileData: {
            profile_photo: "",
        }
    },
    reducers: {
        setProfileData: (state, action) => {
            console.log(action.payload);
            state.profileData = action.payload;
        }
    }
})

export const profileDataActions = ProfileDataSlice.actions;

export default ProfileDataSlice;