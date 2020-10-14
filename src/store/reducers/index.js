import userReducer from '../reducers/userReducer'
import navLinkReducer from "./navLinkReducer";
import loadingReducer from './loadingReducer'

import {combineReducers} from 'redux'

export default combineReducers({
    userReducer,
    navLinkReducer,
    loadingReducer
})
