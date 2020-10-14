import {createStore} from 'redux'

import rootReducer from './reducers/index'

import {persistStore, persistReducer} from 'redux-persist'

import storage from 'redux-persist/lib/storage/index'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userReducer', 'navLinkReducer']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer)

export const persistor = persistStore(store)

export default store



