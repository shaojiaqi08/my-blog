import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import {Provider} from 'react-redux'

import store from './store/index'

import "./assets/font/iconfont.css";

import "isomorphic-fetch";

import Layout from "./layout/index/index";

import {persistor} from './store/index'

import {PersistGate} from 'redux-persist/lib/integration/react'

require("es6-promise").polyfill();

ReactDOM.render(<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <Layout />
    </PersistGate>

</Provider>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
