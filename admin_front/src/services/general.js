import request from "../utils/request";
import host from "../common/config";
import querystring from "querystring";

export async function rules(modelKey, type = "g") {
  return await request(`${host}/api/${type}/${modelKey}/rules`, {});
}

export async function index(query, modelKey, type = "g") {
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

  return request(`${host}/api/${type}/${modelKey}?${requestQuery}`);
}

export async function create(data, modelKey, type = "g") {
  return request(`${host}/api/${type}/${modelKey}`, {
    method: "POST",
    body: data
  });
}

export async function update(id, data, modelKey, type = "g") {
  return request(`${host}/api/${type}/${modelKey}/${id}`, {
    method: "PUT",
    body: data
  });
}

export async function switchChange(id, data, modelKey, type = "g") {
  return request(`${host}/api/${type}/${modelKey}/${id}/one`, {
    method: "PUT",
    body: data
  });
}

export async function destory(id, modelKey, type = "g") {
  return request(`${host}/api/${type}/${modelKey}/${id}`, {
    method: "DELETE"
  });
}

export async function show(id, modelKey, type = "g") {
  return request(`${host}/api/${type}/${modelKey}/${id}`, {});
}
