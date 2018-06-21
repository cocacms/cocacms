import request from '../utils/request';
import host from '../common/config';

export async function reload() {
  return await request(`${host}/api/plugin/load`)
}

export async function toggle(id, enable) {
  return await request(`${host}/api/plugin`, {
    method: 'POST',
    body: {
      id,
      enable,
    },
  })
}

export async function install(id) {
  return await request(`${host}/api/plugin/${id}`, {
    method: 'POST',
  })
}


export async function uninstall(id) {
  return await request(`${host}/api/plugin/${id}`, {
    method: 'DELETE',
  })
}
