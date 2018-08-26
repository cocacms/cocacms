import request from '../utils/request';
import host from '../common/config';

export async function create(data, pid = -1) {
  return await request(`${host}/api/menu?pid=${pid}`, {
    method: 'POST',
    body: data,
  });
}

export async function moveUp(id) {
  return await request(`${host}/api/menu/moveUp/${id}`, {
    method: 'PUT',
  });
}

export async function moveDown(id) {
  return await request(`${host}/api/menu/moveDown/${id}`, {
    method: 'PUT',
  });
}
