import { notification } from "antd";

export const config = () => ({
  onError: (err, dispatch) => {
    err.preventDefault();

    console.debug("====================================");
    console.debug(err.message);
    console.debug("====================================");

    if (err.response) {
      if (err.response.status === 401) {
        dispatch({
          type: "admin/logout"
        });
      }

      err.response.json().then(data => {
        notification.error({
          message: "错误提示",
          description: data.message
        });
      });
      return;
    }

    if (err.message) {
      notification.error({
        message: "错误提示",
        description: err.message
      });
      return;
    }
  }
});
