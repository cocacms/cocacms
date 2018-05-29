import request from '../utils/request';
import host from '../common/config';

export async function my() {
  return await request(`${host}/api/permission/my`)
}
