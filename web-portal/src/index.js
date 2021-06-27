import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
// import { onLocationChange } from "./store/actions/commonActions";

import commonReducer from "./store/reducers/commonReducer";
import authReducer from "./store/reducers/AuthReducer";
import AssessmentReducer from "./store/reducers/AssessmentReducer";
import InviteReducer from "./store/reducers/InviteReducer";
import { createBrowserHistory } from "history";
// import homePageReducer from "./store/reducers/homePageReducer";
import NetworkService from "./NetworkService";

import "reset-css";

import App from "./App";
import * as serviceWorker from './serviceWorker';

// import config from "./config";

let composeEnhancers = compose

if (process.env.NODE_ENV === "development") {
	composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

export const history = createBrowserHistory();

export const store = createStore(
	combineReducers({
		auth: authReducer,
		global: commonReducer,
		assessment: AssessmentReducer,
		invite: InviteReducer
	}),
	composeEnhancers(applyMiddleware(thunk))
);

// Dispatch event for landing page.
// store.dispatch(onLocationChange({ path: history.location.pathname }));
// Listen for changes in history
// history.listen(location => {
//   store.dispatch(onLocationChange({ path: location.pathname }));
// });

if (
	localStorage.getItem("access-token") &&
	localStorage.getItem("refresh-token")
) {
	axios.defaults.headers.common["X-Access-Token"] = localStorage.getItem("access-token");
	axios.defaults.headers.common["X-Refresh-Token"] = localStorage.getItem("refresh-token");
}
NetworkService.setupInterceptors(store);

// WARNING: Using multiple Routers inside each other, check out <App>.
ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<App history={history} />
		</Provider>
	</BrowserRouter>,
	document.getElementById("root")
);
serviceWorker.unregister();
