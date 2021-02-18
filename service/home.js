import request from './network.js';

//请求首页轮播图以及推荐栏数据的接口
export function getMultiData() {
  return request({
    url: '/home/multidata'
  })
}

//1请求商品信息的接口
export function getGoodsData(type,page) {
  return request({
    url: '/home/data',
    data: {
      type: type,
      page: page
    }
  })
}