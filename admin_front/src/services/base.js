import request from "../utils/request";
import host from "../common/config";
import querystring from "querystring";

export default function build(name) {
  return {
    index: async (query, tag = "") => {
      let requestQuery = "";
      if (query) {
        if (query.where && query.where.length > 0) {
          query.where = JSON.stringify(query.where);
        }

        if (query.order && query.order.length > 0) {
          query.order = JSON.stringify(query.order);
        }

        requestQuery = querystring.stringify(query);
      }

      return request(`${host}/api/${name}${tag}?${requestQuery}`);
    },

    new: async (id, tag = "") => {
      return request(`${host}/api/${name}${tag}/new`);
    },

    show: async (id, tag = "") => {
      return request(`${host}/api/${name}${tag}/${id}`);
    },

    create: async (data, tag = "") => {
      return request(`${host}/api/${name}${tag}`, {
        method: "POST",
        body: data
      });
    },

    update: async (id, data, tag = "") => {
      return request(`${host}/api/${name}${tag}/${id}`, {
        method: "PUT",
        body: data
      });
    },

    destory: async (id, tag = "") => {
      return request(`${host}/api/${name}${tag}/${id}`, {
        method: "DELETE"
      });
    }
  };
}
