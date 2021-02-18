// pages/home/home.js
import {getMultiData,getGoodsData} from '../../service/home.js'

//将商品数据的三个关键字放进数组，再随点击的index进行一对应匹配
const types = ['pop','new','sell']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommends: [],
    titles:['流行','新款','精选'],
    goods: {
      'pop': {page: 0,list: []},
      'new': {page: 0,list: []},
      'sell': {page: 0,list: []},
    },
    currentType: 'pop',
    showBackTop: false,
    isTabFixed: false,
    tabScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.请求轮播图以及推荐数据
    this._getMultiData();

    //2.请求商品数据
    this._getGoodsData('pop');
    this._getGoodsData('new');
    this._getGoodsData('sell');
  },

  // ----------- 网络请求函数 -----------
  // 请求轮播图以及推荐数据
  _getMultiData() {
    getMultiData().then(res => {
      // console.log(res)
      //取出轮播图和推荐数据
      const banners = res.data.banner.list.map(item => {
        return item.image
      })
      const recommends = res.data.recommend.list;
      // console.log(banners);
      // console.log(recommends);

      //将banner和recommend放到data中
      this.setData({
        banners: banners,
        recommends: recommends
      })
    })
  },

  // 请求商品数据
  _getGoodsData(type) {
    // 1.获取页码
    const page = this.data.goods[type].page + 1;
    // 2.发送网络请求
    getGoodsData(type,page).then(res => {
      // console.log(res)
      //2.1取出数据
      const list = res.data.list;

      //2.2将数据设置到对应的type的list中
      const oldList = this.data.goods[type].list;
      oldList.push(...list);

      // 2.3将数据设置到data的goods中
      const typeKey = `goods.${type}.list`
      const pageKey = `goods.${page}.page`
      this.setData({
        [typeKey]: oldList,
        [pageKey]: page
      })
    })
  },

  // ----------- 事件监听函数 -----------
  handleTabClick(event) {
    // console.log(event)
    //取出index
    const index = event.detail.index;
    // console.log(index)

    //设置并修改currentType
    this.setData({
      currentType: types[index]
    })
  },

  //监听推荐栏的图片加载
  handleImageLoad(){
    // console.log('图片加载完成')
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect =>{
      // console.log(rect)
      this.data.tabScrollTop = rect.top
    }).exec()
  },

 /**
 * 页面上拉触底事件的处理函数
 */
  //滚动到底部，上拉加载更多
  onReachBottom() {
    // console.log('123')
    //上拉加载更多 -> 请求新的数据
    this._getGoodsData(this.data.currentType)
  },

  //监听页面滚动，显示返回顶部按钮
  onPageScroll(options){
    // 1.取出scrollTop
    const scrollTop = options.scrollTop;

    // 2.修改showBackTop属性值
    //官方警告：不要在滚动的函数中频繁调用this.setData()
    const flag1 = scrollTop >= 1000
    if(flag1 != this.data.showBackTop){
    this.setData({
      showBackTop: flag1
    })
    }

    //3.修改isTabFixed属性值
    const flag2 = scrollTop >= this.data.tabScrollTop;
    if(flag2 != this.data.isTabFixed) {
      this.setData({
        isTabFixed:flag2
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})