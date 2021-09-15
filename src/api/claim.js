import request from './request';

export const getProfileClaimApplyInfoByOrderOptionNo = ({ path: { orderOptionNo }, params: { claimType } }) =>
  request(`profile/order-options/${orderOptionNo}/claim`, 'get', { claimType });

export const putProfileClaimRefundAccountByClaimNo = ({
  path: { claimNo },
  requestBody: { bank, account, depositorName },
}) => request(`profile/claims/${claimNo}/account`, 'put', null, { bank, account, depositorName });
