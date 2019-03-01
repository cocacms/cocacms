import request from "../utils/request";
import host from "../common/config";

export async function reload() {
  return await request(`${host}/api/plugin/load`);
}

export async function toggle(name, enable) {
  return await request(`${host}/api/plugin`, {
    method: "POST",
    body: {
      name,
      enable
    }
  });
}

export async function setting(name, setting) {
  return await request(`${host}/api/plugin/setting`, {
    method: "POST",
    body: {
      name,
      setting
    }
  });
}

export async function install(name) {
  return await request(`${host}/api/plugin/${name}`, {
    method: "POST"
  });
}

export async function uninstall(name) {
  return await request(`${host}/api/plugin/${name}`, {
    method: "DELETE"
  });
}
