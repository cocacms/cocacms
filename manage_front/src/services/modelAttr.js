import request from '../utils/request';
import host from '../common/config';

export async function indexs(model) {
  return await request(`${host}/api/modelAttr/${model}/indexs`, {
  })
}

export async function adjustIndexs(model, body) {
  return await request(`${host}/api/modelAttr/${model}/indexs`, {
    method: 'PUT',
    body,
  })
}

