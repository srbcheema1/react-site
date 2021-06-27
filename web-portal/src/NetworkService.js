import axios from "axios";
// import { flash } from "./store/actions/NotificationActions";
export default {
  setupInterceptors: store => {
    axios.interceptors.request.use(
      function(config) {
        config.metadata = { startTime: new Date() };
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function(response) {
        response.config.metadata.endTime = new Date();
        response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
        // Do something with response data
        if (
          response.headers["x-access-token"] &&
          response.headers["x-refresh-token"]
        ) {
          localStorage.setItem("access-token",response.headers["x-access-token"]);
          localStorage.setItem("refresh-token",response.headers["x-refresh-token"]);
          axios.defaults.headers.common["X-Access-Token"] = response.headers["x-access-token"];
          axios.defaults.headers.common["X-Refresh-Token"] = response.headers["x-refresh-token"];
          return { ...response, success: true };
        } else {
          return { ...response, success: true };
        }
      },
      function(error) {
        // let message = "";

        // switch (error.response.status) {
        //   case 401:
        //     message =
        //       "Unauthorized: Please try to login before accessing this information.";
        //     break;
        //   case 403:
        //     message =
        //       "Forbidden: You do not have sufficent permissions to access this information.";
        //     localStorage.removeItem("access-token");
        //     localStorage.removeItem("refresh-token");
        //     delete axios.defaults.headers.common["X-Access-Token"];
        //     delete axios.defaults.headers.common["X-Refresh-Token"];
        //     store.dispatch({ type: "ON_TOGGLE_AUTH_MODAL", payload: "login" });
        //     break;
        //   case 502:
        //     message =
        //       "Bad Gateway: Server error, please try again after some time.";
        //     break;
        //   case 503:
        //     message =
        //       "Service unavailable: Servers are busy right now please reload after some time.";
        //     break;
        //   case 504:
        //     message =
        //       "Gateway Timeout: Servers are unable to reply, please try again after some time. ";
        //     break;
        //   default:
        //     message = "Server Error: Please try again after some time";
        //     break;
        // }

        // store.dispatch(
        //   flash({
        //     type: "error",
        //     message: message
        //   })
        // );

        // Do something with response error
        // store.dispatch({ type: "ON_SERVER_ERROR", serverError: true });
        // if (!error.response) {
        //   window.console.error(error);
        // }

        // return { ...error.response, success: false };
        return Promise.reject(error)
      }
    );
  }
};

// Add a response interceptor
/*axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        //catches if the session ended!
        if ( error.response.data.token.KEY == 'ERR_EXPIRED_TOKEN') {
            console.log("EXPIRED TOKEN!");
            localStorage.clear();
            store.dispatch({ type: UNAUTH_USER });
        }
        return Promise.reject(error);
    });*/
/*verificationInterceptor: (store) => {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        console.log(config);
        // Do something before request is sent
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });
  }*/

//   function deleteAllCookies() {
//     var cookies = document.cookie.split(";");

//     for (var i = 0; i < cookies.length; i++) {

//         var cookie = cookies[i];
//         var eqPos = cookie.indexOf("=");
//         var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
//     }
// }
