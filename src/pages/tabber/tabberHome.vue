<template>
  <view class="page_wrapper">
    <!-- 头部导航栏  -->
    <c-normal-nav
      :title="'健康体检'"
      :background-color="'#35A8FF'"
      :right-icon-color="'#fff'"
      :right-text="'已连接主机'"
    ></c-normal-nav>
    <!-- 头部切换 -->
    <view class="end_title">
      <view
        v-for="(item,index) in tabList"
        :key="index"
        :class="{btna:count == index}"
        @tap="tabChange(index)"
      >
        {{item}}/11111人
      </view>
    </view>
    <!-- 中间列表 -->
    <view class="content" style>
      <mescroll-uni
        ref="mescrollRef"
        :fixed="false"
        :down="{use:false}"
        @init="mescrollInit"
        @up="upCallback"
      >
        <!-- //  @init="mescrollInit" @down="downCallback" @up="upCallback"为固定值,不可删改(与mescroll-mixins保持一致) -->
        <!-- // :down="downOption" :up="upOption" 绝大部分情况无需配置 -->
        <!-- // :top="顶部偏移量" :bottom="底部偏移量" :topbar="状态栏" :safearea="安全区" (常用) -->
        <!-- // 字节跳动小程序 ref="mescrollRef" 必须配置 -->
        <!-- // 此处支持写入原生组件 -->
        <view class="infor_list">
          <view v-for="(item,index) in dataList" :key="index" class="infor_list_item">
            <view class="flex_img">
              <image
                v-if="Number(item.garden) === 1"
                src="/static/man.png"
                class="portrait"
              ></image>
              <image
                v-if="Number(item.garden) === 2"
                src="/static/woman.png"
                class="portrait"
              ></image>
            </view>
            <view class="flex_baseinfor">
              <view class="base_box">
                <view class="name">
                  <span>{{item.name}}</span>
                  <span>{{item.age}}岁</span>
                </view>
                <view class="date">{{item.createDate}}登记</view>
              </view>
            </view>
            <view class="flex_idcard">
              <view class="idcard_box">
                <view class="idcard">
                  <span>{{item.idCard}}</span>
                </view>
                <view class="disease_box">
                  <span v-for="(val,i) in item.disease" :key="i" class="disease">{{val}}</span>
                </view>
              </view>
            </view>
          </view>
        </view>
      </mescroll-uni>
    </view>
    <!-- 底部栏 -->
    <view class="footer">
      <view class="footer_fixed">
        <!-- 上传 -->
        <view class="footer_upload">
          <view class="upload_left">
            <uni-data-checkbox
              mode="button"
              class="check_all"
              multiple
              :localdata="[{text: '全选',value: 0}]"
            ></uni-data-checkbox>
            <view class="check_title">已选3条</view>
          </view>
          <view class="upload_right">
            <button class="upload_btn">上传</button>
          </view>
        </view>
        <!-- 搜索 -->
        <view class="footer_search">
          <view class="search_left">
            <uni-icons type="mic-filled" color="#35A8FF" size="20"></uni-icons>
            <uni-easyinput
              class="uni-mt-5"
              :input-border="false"
              confirm-type="search"
              placeholder-style="text-align:right;"
              suffix-icon="search"
              placeholder="搜索"
            ></uni-easyinput>
          </view>
          <view class="search_right">
            <button class="search_btn">
              <uni-icons type="scan" size="18" color="#FFFFFF"></uni-icons>
              扫码
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js"
   export default {
     	mixins: [MescrollMixin], // 使用mixin
     	data() {
     		return {
  			// tab列表
  			tabList: ['未体检','已体检','已登记'],
  			btnnum: 0,
  			count:"",
     			// 列表数据
     			dataList: [{
     				name: '姓名1',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压','高血脂'],
  				garden: '1'
     			},{
     				name: '姓名2',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名3',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名4',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名5',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名6',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名7',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名8',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名9',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			},{
     				name: '姓名10',
     				age: '56',
     				idCard: '3702515199512022144',
     				createDate: '2020.12.12',
     				disease: ['糖尿病','高血压'],
  				garden: '2'
     			}]
     		}
     	  },
     	methods: {
  		// tab切换
  		tabChange(e) {
  			this.count = e
  			this.btnnum = e
  		},
     		// mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)
     		mescrollInit(mescroll) {
     			this.mescroll = mescroll
  		},
     		// 下拉刷新的回调, 重置列表为第一页 (此处可删,mixins已默认)
     		// downCallback(){
     		// 	this.mescroll.resetUpScroll();
     		// },
     		// 上拉加载的回调
     		upCallback(page) {
     			// 此处可以继续请求其他接口
     			// if(page.num == 1){
     			// 	// 请求其他接口...
     			// }

     			// 如果希望先请求其他接口,再触发upCallback,可参考以下写法
     			// if(!this.isInitxx){
     			// 	apiGetxx().then(res=>{
     			// 		this.isInitxx = true
     			// 		this.mescroll.resetUpScroll() // 重新触发upCallback
     			// 	}).catch(()=>{
     			// 		this.mescroll.endErr()
     			// 	})
     			// 	return // 此处return,先获取xx
     			// }

     			const pageNum = page.num // 页码, 默认从1开始
   			const pageSize = page.size // 页长, 默认每页10条
   			// uni.request({
   			// 	url: 'xxxx?pageNum='+pageNum+'&pageSize='+pageSize,
   			// 	success: (data) => {
   			// 		// 接口返回的当前页数据列表 (数组)
   			// 		let curPageData = data.xxx;
   			// 		// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
   			// 		let curPageLen = curPageData.length;
   			// 		// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
   			// 		let totalPage = data.xxx;
   			// 		// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
   			// 		let totalSize = data.xxx;
   			// 		// 接口返回的是否有下一页 (true/false)
   			// 		let hasNext = data.xxx;

   			// 		//设置列表数据
   			// 		if(page.num == 1) this.dataList = []; //如果是第一页需手动置空列表
   			// 		this.dataList = this.dataList.concat(curPageData); //追加新数据

   			// 		// 请求成功,隐藏加载状态
   			// 		//方法一(推荐): 后台接口有返回列表的总页数 totalPage
   			// 		this.mescroll.endByPage(curPageLen, totalPage);

   			// 		//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
   			// 		//this.mescroll.endBySize(curPageLen, totalSize);

   			// 		//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
   			// 		//this.mescroll.endSuccess(curPageLen, hasNext);

   			// 		//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
   			// 		//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
   			// 		//如果传了hasNext,则翻到第二页即可显示无更多数据.
   			// 		//this.mescroll.endSuccess(curPageLen);

   			// 		// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
   			// 		// 建议使用setTimeout,因为this.$nextTick某些情况某些机型不触发
   			// 		setTimeout(()=>{
   			// 			this.mescroll.endSuccess(curPageLen)
   			// 		},20)

   			// 		// 上拉加载的 curPageLen 必传, 否则会一直显示'加载中...':
   			// 		1. 使配置的noMoreSize 和 empty生效
   			// 		2. 判断是否有下一页的首要依据:
   			// 		   当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
   			// 		   比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
   			// 		3. 当传的值等于page.size时(满页),才取totalPage, totalSize, hasNext判断是否有下一页
   			// 		传totalPage, totalSize, hasNext目的是避免方法四描述的小问题

   			// 		// 提示: 您无需额外维护页码和判断显示空布局,mescroll已自动处理好.
   			// 		// 当您发现结果和预期不一样时, 建议再认真检查以上参数是否传正确
   			// 	},
   			// 	fail: () => {
   			// 		//  请求失败,隐藏加载状态
   			// 		this.mescroll.endErr()
   			// 	}
   			// })
   		},
     		// 若希望重新加载列表,只需调用此方法即可(内部会自动page.num=1,再主动触发up.callback)
     		// reloadList(){
     		// 	this.mescroll.resetUpScroll();
     		// }
     	  }
       }
</script>

<style lang="scss">
  .page_wrapper {
  	background-color: $gray-bg-color;
  }
  // 头部tab
  .end_title{
  	font-size: 14.71rpx;
      display: flex;
  	background: #FFFFFF;
  	height: 48.04rpx;
  	line-height: 48.04rpx;
  	padding: 0 15.69rpx;
  	view{
  	    flex-grow: 1;
  	    text-align: center;
  		color: #C7C7C7;
  	}
  	.btna{
  	   color: #3A3A3A;
  	   border-bottom: 2px solid $main-color;
  	}
  }
  // 中间列表
  .content {
  	position:relative;
  	height:70vh;
  	.infor_list {
  		padding: 15.69rpx;
  		.infor_list_item {
  			padding: 11.76rpx 15.69rpx 20.59rpx;
  			background-color: $white-bg-color;
  			border-radius: 10rpx;
  			list-style: none;
  			// height: 66.18rpx;
  			margin-bottom: 11.76rpx;
  			display: flex;
  			.flex_img{
  				align-self: center;
  				.portrait {
  					width: 33.82rpx;
  					height: 33.82rpx;
  				}
  			}
  			.flex_baseinfor {
  				padding-left: 16.67rpx;
  				flex: 1;
  				font-size: 16.67rpx;
  				.base_box {
  					.name {
  						color: $main-font-color;
  						span {
  							margin-right: 15.69rpx;
  						}
  					}
  					.date {
  						color: $minor-font-color;
  					}
  				}
  			}
  			.flex_idcard {
  				font-size: 12.75rpx;
  				.idcard_box {
  					.idcard{
  						color: $main-font-color;
  						text-align: right;
  					}
  					.disease_box{
  						text-align: right;
  						.disease {
  							display: inline-block;
  							color: $main-color;
  							font-size: 10.78rpx;
  							border: 1px solid $main-color;
  							padding: 1.96rpx 3.92rpx;
  							margin-left: 11.76rpx;
  							margin-top: 3.92rpx;
  						}
  					}
  				}
  			}
  		}
  	}
  }
  // 底部搜索
  .footer {
  	// height: 153.43rpx;
  	.footer_fixed {
  		background-color: $white-bg-color;
  		position:fixed;
  		bottom: 0;
  		width: 100%;
  		// 底部勾选上传
  		.footer_upload {
  			width: 100%;
  			padding: 15.69rpx;
  			border-top: 1px solid #B9B9B9;
  			@include flex-two(row,space-between,center,nowrap);
  			.upload_left {
  				@include flex-two(row,space-between,center,nowrap);
  				.check_title{
  					font-size: $foot-font;
  					color: $foot-btn-color;
  				}
  				.check_all{
  					// background-color: $input-bg-color;
  				}
  			}
  			.upload_right {
  				.upload_btn {
  					font-size: 16.67rpx;
  					border-radius: 120px;
  					color:$white-color;
  					background-color: #18BC37;
  				}
  			}
  		}
  		// 底部搜索
  		.footer_search {
  			width: 100%;
  			padding: 15.69rpx;
  			border-top: 1px solid #B9B9B9;
  			@include flex-two(row,space-between,center,nowrap);
  			.search_left {
  				width: 272.55rpx;
  				height: 59.31rpx;
  				padding: 0 15.69rpx;
  				background-color: $input-bg-color;
  				border: 1px solid $border-color;
  				border-radius: 120px;
  				@include flex-two(row,space-between,center,wrap);
  			}
  			.search_right {
  				width: 201.47rpx;
  				height: 58.82rpx;
  				.search_btn {
  					color:$white-color;
  					background-color: $foot-btn-color;
  				}
  			}
  		}
  	}
  }
</style>
