import axios from "axios";
export default {
  setupInterceptors: () => {
    axios.interceptors.response.use(
      function(response) {
        // Do something with response data
        if (
          response.headers["x-access-token"] &&
          response.headers["x-refresh-token"]
        ) {
          window.localStorage.setItem(
            "access-token",
            response.headers["x-access-token"]
          );
          window.localStorage.setItem(
            "refresh-token",
            response.headers["x-refresh-token"]
          );
          axios.defaults.headers.common["X-Access-Token"] =
            response.headers["x-access-token"];
          axios.defaults.headers.common["X-Refresh-Token"] =
            response.headers["x-refresh-token"];
          return { ...response, success: true };
        } else if (response.status > 399) {
          return { ...response, success: false };
        } else {
          return { ...response, success: true };
        }
      },
    /*  function(error) {
        // Do something with response error
        store.dispatch({ type: "ON_SERVER_ERROR", serverError: true });
        if (error.response.status === 403) {
          window.localStorage.removeItem("access-token");
          window.localStorage.removeItem("refresh-token");
          delete axios.defaults.headers.common["X-Access-Token"];
          delete axios.defaults.headers.common["X-Refresh-Token"];
          window.location.href = "/login/";
          store.dispatch({ type: "INVALID_SESSION" });
        }
        return new window.Promise.reject(...error);
      }*/
    );
  }
};
