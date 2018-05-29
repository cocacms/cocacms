import request from '../utils/request';
import host from '../common/config';

export async function login(body) {
  return await request(`${host}/api/admin/login`, {
    method: 'POST',
    body,
  })
}

export async function award(body) {
  return await request(`${host}/api/admin/award`, {
    method: 'PUT',
    body,
  })
}


export async function undo(body) {
  return await request(`${host}/api/admin/undo`, {
    method: 'PUT',
    body,
  })
}


export async function resetPassword(body) {
  return await request(`${host}/api/admin/password`, {
    method: 'PUT',
    body,
  })
}
