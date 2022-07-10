import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageType } from '../Message';

export enum PostToChannelStatus {
    NoStatus,
    EmptyMessage,
    PostOK,
    PostError,
}

export const publisherSlice = createSlice({
    name: 'publisher',
    initialState: {
        status: PostToChannelStatus.NoStatus,
        statusMessage: '',
        messageType: MessageType.Text,
        textFieldStatus: '',
        message: '' as (string | ArrayBuffer),
    },
    reducers: {
        setStatus: (state, action: PayloadAction<PostToChannelStatus>) => {
            state.status = action.payload;
        },

        setMessageType: (state, action: PayloadAction<MessageType>) => {
            state.messageType = action.payload;
            state.status = PostToChannelStatus.NoStatus;
        },

        setTextFieldStatus: (state, action: PayloadAction<string>) => {
            state.textFieldStatus = action.payload;
        },

        setMessage: (state, action: PayloadAction<string | ArrayBuffer>) => {
            state.textFieldStatus = '';
            state.message = action.payload;
        },

        setStatusMessage: (state, action: PayloadAction<string>) => {
            state.statusMessage = action.payload;
        },
    },
});

export default publisherSlice.reducer;
export const { setStatus, setMessageType, setTextFieldStatus, setMessage, setStatusMessage } = publisherSlice.actions;


