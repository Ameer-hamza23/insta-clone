import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice.js";
import PostSlice from "./PostSlice.js";
import SocketSlice from "./SocketSlice.js";
import ChatSlice from "./ChatSlice.js";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rtnSlice from "./rtnSlice.js";

// Persist config with socketio blacklisted
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['socketio']  // Add socketio to the blacklist
}

const rootReducer = combineReducers({
    auth: AuthSlice,
    post: PostSlice,
    socketio: SocketSlice,  // This will not be persisted
    chat: ChatSlice,
    realTimeNotification:rtnSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          ignoredPaths: ['socketio.socket'],  // Ignore socket path for serialization checks
        },
      }),
});

export default store;
