import request from '../utils/request';
import host from '../common/config';

export async function create(data, pid = -1) {
  return await request(`${host}/api/category?pid=${pid}`, {
    method: 'POST',
    body: data,
  });
}

export async function moveUp(id) {
  return await request(`${host}/api/category/moveUp/${id}`, {
    method: 'PUT',
  });
}

export async function moveDown(id) {
  return await request(`${host}/api/category/moveDown/${id}`, {
    method: 'PUT',
  });
}

export async function bind(id, bind) {
  return await request(`${host}/api/category/bind/${id}`, {
    method: 'PUT',
    body: {
      bind,
    },
  });
}
