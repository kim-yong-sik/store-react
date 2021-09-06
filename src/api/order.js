import request from './request';

export const postOrderSheets = requestBody =>
  request('order-sheets', 'post', null, null, requestBody)