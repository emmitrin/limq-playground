import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../Message';

export const listenerSlice = createSlice({
    name: 'listener',
    initialState: {
        messagesHistory: [] as Message[],
    },
    reducers: {
        pushMessage: (state, action: PayloadAction<Message>) => {
            state.messagesHistory.unshift(action.payload);
        },

        clearMessages: (state) => {
            state.messagesHistory = [];
        }
    },
});

export default listenerSlice.reducer;
export const { pushMessage, clearMessages } = listenerSlice.actions;


