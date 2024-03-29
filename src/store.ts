import { configureStore } from '@reduxjs/toolkit';
import channelReducer from './features/channelSlice';
import viewReducer from './features/viewSlice';
import listenerReducer from './features/listenerSlice';
import publisherReducer from './features/publisherSlice';

const store = configureStore({
    reducer: {
        channel: channelReducer,
        view: viewReducer,
        messages: listenerReducer,
        publisher: publisherReducer,
    },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

