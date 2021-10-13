import request from "./request";

// category
export const getCategoryList = (categoryNo, orderBy) => {
  return request("categories", "get", null, {});
};

export const getCategoryListByKeyword = keyword => {
  return request('categories', 'get', { keyword }, null)
}
 
// banner
export const loadBanner = (bannerCode) => {
  return request(`display/banners/${bannerCode}`, "get", null, {});
};

// event
export const getDisplayEvents = (keyword = '') => {
  const query = keyword.length > 0 ? {keyword} : null;
  return request("display/events", "get", query, {});
};

export const getDisplayCloseEvents = (query) => {
  return request("display/events/close", "get", query, null);
};
/*
* params: {order, soldout, saleStatus}
* */
export const getEventByEventNo = (eventNo, params) => {
  const query = new URLSearchParams(params);
  return request(`display/events/${eventNo}`, "get", query.toString(), {});
};

export const getEventByProductNo = (query) => {
  if (query?.params) {
    return request('display/events/products', 'get', query.params);
  }
  return request(`display/events/products/${query.pathParams.productNo}`)
}

export const getDisplaySectionsSectionNo = ({ pathParams, params }) => {
  return request(`display/sections/${pathParams.sectionNo}`, 'get', params)
}
