import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const channelSlice = createSlice({
    name: 'channel',
    initialState: {
        key: '',
        permissions: 0,
    },
    reducers: {
        setKey: (state, action: PayloadAction<string>) => {
            state.key = action.payload;
        },

        setPermissions: (state, action: PayloadAction<number>) => {
            state.permissions = action.payload;
        },
    },
});

export default channelSlice.reducer;
export const { setKey, setPermissions } = channelSlice.actions;

