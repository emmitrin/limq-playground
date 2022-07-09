import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Views {
    Enter,
    Listener,
    Publisher
}

export const viewSlice = createSlice({
    name: 'view',
    initialState: Views.Enter,
    reducers: {
        setView: (state, action: PayloadAction<Views>) => {
            return action.payload;
        }
    },
});

export default viewSlice.reducer;
export const { setView } = viewSlice.actions;
