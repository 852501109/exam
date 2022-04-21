<template>
    <!-- 不能用v-if (i: 每个tab页的专属下标;  index: 当前tab的下标; 申明在 MescrollMoreItemMixin )-->
    <view v-show="i === index">
        <!-- top="120"下拉布局往下偏移,防止被悬浮菜单遮住 -->
        <!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
        <mescroll-body :ref="'mescrollRef'+i" @init="mescrollInit" :down="{use:false}" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
            <!-- 数据列表 -->
            <view class="workNotice" style="padding-top: 80rpx;">
                <view class="content">
                    <view class="noNotice" v-show="noticeList.length==0">暂无提醒</view>                    
                        <mescroll-body ref="mescrollRef" @up="upCallback" :down="{use:false}" :up="upOption">
                            <view v-for="(item,index) in noticeList" :key='index' >                            
                                <view class="content-item" v-if="i==0">    
									<view class="notice-card" @tap="linkTo(item)">
										<view class="card-nav">{{item.message}}</view>
										<view class="card-content">
											<view class="base-infor">
												<view class="name">
													<span>{{item.name}}</span>	
												</view>
												
												<view class="phone">
													<i class="iconfont icon-Id"></i>
													<span>{{item.idCard}}</span>                                    
												</view>
												<view class="org">
													<i class="iconfont icon-yiyuan"></i>
													<span>{{item.orgName}}</span>                                   
												</view>
												<view class="ry_type">
													<view class="ry-item gxy">
														{{item.mbType}}
													</view>
													<view class="date">
														{{item.date}}
													</view>
												</view>
											</view>
										</view>
									</view>    
                                </view>
								<view class="content-item" v-else >
									<view class="notice-card" @tap="linkToSh(item)">
										<view class="card-nav">{{item.message}}</view>
										<view class="card-content">
											<view class="base-infor">
												<view class="name">
													<span>{{item.name}}</span>
												</view>
												<view class="phone">
													<i class="iconfont icon-Id"></i>
													<span>{{item.idCard}}</span>                                    
												</view>
												<view class="org">
													<i class="iconfont icon-yiyuan"></i>
													<span>{{item.orgName}}</span><span>{{item.group}}</span>                                    
												</view>
												<view class="ry_type">
													<view class="ry-item gxy">
														{{item.mbType}}
													</view>
													<view class="date">
														{{item.date}}
													</view>
												</view>
											</view>
										</view>
									</view>    
								</view>
                            </view>    
                        </mescroll-body>  
                    </view>
            </view>
        </mescroll-body>
    </view>
</template>
 
<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    //import {apiSearch} from "@/api/mock.js"
    import { getMbPlanList,getMessageList,getAuditList } from '@/request/notice.js'
    
    export default {
        mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
        props:{
            i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
            index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
                type: Number,
                default(){
                    return 0
                }
            },
            post:{
                type: Object,
                default(){    
                    return {}
                }
            },
            tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
                type: Array,
                default(){
                    return []
                }
            }
        },
		created() {
			// uni.$off('NOTICEUPDATA')
			// uni.$once("NOTICEUPDATA", res => {
			// 	console.log('触发监听')
			// 	this.noticeList = []
			// 	this.upCallback()
			
		},
		onLoad() {
			
		},
        data() {
            return {
                downOption:{
                    auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
                },
                options:[
                    {
                        text: '延期提醒',
                        style: {
                            backgroundColor: '#FE9C01',
                            fontSize: '34rpx'
                        }
                    }
                ],
                upOption:{
                    auto:false, // 不自动加载
                    noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                },
                noticeList:[] //列表数据
            }
        },
        methods: {
			// 跳转随访详情
            linkTo(item){
				let { mbType,relevanceId,name,orgId,orgName } = item
				console.log(item,mbType)
                if(mbType == '高血压' ){
                    var gourl = '/pages/home/diseaseVisit/newGxyvisit/newGxyvisit'
					var qureyData = {};
					qureyData.id = relevanceId
					qureyData.name = name
					qureyData.orgId = orgId
					qureyData.orgName = orgName
                    uni.navigateTo({
                        url:gourl + '?data=' + encodeURIComponent(JSON.stringify(qureyData))   
                    })
                }
				// 糖尿病
				if(mbType == '糖尿病' ){
				    var gourl = '/pages/home/diseaseVisit/newTnbVisit/newTnbVisit'
					var qureyData = {};
					qureyData.id = relevanceId
					qureyData.name = name
					qureyData.idCard = item.idCard
					qureyData.orgId = orgId
					qureyData.orgName = orgName
				    uni.navigateTo({
				        url:gourl + '?data=' + encodeURIComponent(JSON.stringify(qureyData))   
				    })
				}
            },
			// 审核
			linkToSh(item){
				let { mbType,id,name,orgId,idCard,orgName } = item
				console.log(item,mbType)
				if(mbType == '高血压' ){
				    var gourl = '/pages/home/diseaseVisit/newGxyvisit/newGxyvisit'
					var qureyData = {};
					qureyData.id = id
					qureyData.name = name
					qureyData.orgId = orgId
					qureyData.orgName = orgName
					qureyData.idCard = idCard
				    uni.navigateTo({
				        url:gourl + '?data=' + encodeURIComponent(JSON.stringify(qureyData))   
				    })
				}
				// 糖尿病
				if(mbType == '糖尿病' ){
				    var gourl = '/pages/home/diseaseVisit/newTnbVisit/newTnbVisit'
					var qureyData = {};
					qureyData.idCard = idCard
					qureyData.id = id
					qureyData.name = name
					qureyData.orgId = orgId
					qureyData.orgName = orgName
				    uni.navigateTo({
				        url:gourl + '?data=' + encodeURIComponent(JSON.stringify(qureyData))   
				    })
				}
			},
            /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
            upCallback(page) {
                console.log('触发回调',this.post)
				if(this.i==0){
					this.getMessageList()
				} else {
					this.getAuditList()
				}
               
            },
			init(){
				this.noticeList = []
				if(this.i==0){
					this.getMessageList({num:1})
				} else {
					this.getAuditList({num:1})
				}
			},
            //获取上传
            getMessageList(page){
				const that = this
				var post = Object.assign({},this.post)
				post.startRow = that.noticeList.length
				console.log('查询条件',post,page)
				this.$showLoading('加载中')
				getMessageList(post).then(res=>{
					console.log('消息列表获取',res)
					if(res.ret){
						uni.hideLoading()
						if(page && page.num == 1) that.noticeList = []; //如果是第一页需手动置空列表
						that.noticeList = that.noticeList.concat(res.data.list); //追加新数据
						that.mescroll.endByPage(res.data.list.length, Math.ceil(res.data.count/10));
						console.log('endbypage',res.data.list.length,Math.ceil(res.data.count/10))
					} else {
						uni.hideLoading()
						this.mescroll.endErr()
					}
				},(err)=>{
					uni.hideLoading()
					console.log('请求错误原因',err)
					this.mescroll.endErr()
				})
			},
            // 获取审核
			getAuditList(page){
				const that = this
				var post = Object.assign({},this.post)
				console.log('消息列表获取传参',post)
				post.startRow = that.noticeList.length
				this.$showLoading('加载中')
				getAuditList(post).then(res=>{
					console.log('消息列表获取',res)
					if(res.ret){
						uni.hideLoading()
						if(page && page.num == 1) that.noticeList = []; //如果是第一页需手动置空列表
						that.noticeList = that.noticeList.concat(res.data.list); //追加新数据
						that.mescroll.endByPage(res.data.list.length, Math.ceil(res.data.count/10));
						console.log('endbypage',res.data.list.length,Math.ceil(res.data.count/10))
					} else {
						uni.hideLoading()
						this.mescroll.endErr()
					}
				},(err)=>{
					uni.hideLoading()
					console.log('请求错误原因',err)
					this.mescroll.endErr()
				})
			},
			emptyClick(){
				console.log("点击了按钮,具体逻辑自行实现")
                // uni.showToast({
                //     title:'点击了按钮,具体逻辑自行实现'
                // })
            },
            
        }
        
    }
</script>
<style lang="scss">
     /*占位导航栏样式*/
	 .noNotice{
	     position: absolute;
	     margin-left: -60rpx;
	     top: 60px;
	     left: 50%;
	     font-size: 30rpx;
	     line-height: 120rpx;
	 }
        .status_bar {
              height: var(--status-bar-height);
              width: 100%;
              background-color: rgb(53, 168, 255);
         }
         .notice-content{
             padding: 20rpx;
             .content-item{
                 position: relative;
                 margin-bottom: 40upx;
                .notice-card{
                    margin-top: 10upx;
                    width: 100%;
                    background:rgba(255,255,255,1);
                    border-radius:10upx;    
                    height: 450rpx;
                    display: flex;
                    flex-direction: column;
                    .card-nav{
						font-weight: 700;
                        font-size:30upx;
                        color:rgba(51,51,51,1);
                        height: auto;
						padding: 40rpx;
                        //line-height: 95upx;
                        text-align: center;
                        border-bottom: 1upx solid #EDEDED;
                    }
                    .card-content{
                        flex: 1;
                        display: flex;
					    height: auto;
                        .base-infor{
                            box-sizing: border-box;
                            margin-left: 80rpx;
                            flex: 1;
                            font-size:24upx;
                            .iconfont{
                                margin-right: 10upx;
                            }
                            .name{
								display: flex;
								justify-content: space-between;
                                font-size:30upx;
                                font-weight:400;
                                color:rgba(51,51,51,1);
                                margin-top: 12upx;
                                span{
                                    margin-right: 30upx;
                                }
                            }
                            .phone{
                                margin-top: 15upx;
                                .icon-Id{
                                    color: #35A7FF;
                                }
                            }
                            .org{
                                margin-top: 12upx;
                                .icon-yiyuan{
                                    color: #23BF00;
                                }
                            }
                            .ry_type{
                                display: flex;
								align-items:center;
								.date{
									padding: 5rpx 10rpx;
									line-height:40rpx ;
								}
                                .ry-item{
                                    margin-top: 12upx;
                                    width:auto;
                                    padding: 5rpx 10rpx;
                                    border-radius: 10rpx;
                                    line-height: 40upx;
                                    height:40upx;
                                    text-align: center;
                                    margin-right: 8upx;
                                }
                                .tnb{
                                    color: #FF7100;
                                    background-color: #ffe3cc;
                                }
                                .gxy{
                                    color: #35A7FF;
                                    background-color: #d7eeff;
                                }
                            }
                        }
                    }
                    .card-bottom{
                        border-top:1upx solid #EDEDED ;
                        text-align: center;
                        line-height: 86upx;
                        height: 86upx;
                        font-size:30upx;
                        font-weight:bold;
                        color:rgba(53,167,255,1);
                    }
                }
             }
         }
</style>
