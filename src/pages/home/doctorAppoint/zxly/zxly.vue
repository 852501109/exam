<template>
	<view class="zxly">
		<!-- nav-tap-->
		<WucTab
		class="navTitle"
			:tab-list="tabList"
			v-model="TabCur"
			@tabChange="tabChange"
		>
			<view :slot="index" style="height: 200px;"  v-for="(item,index) in tabList" :key="index">
				<view class="cjBall">
					<view class="card-checkbox" v-for="(item,index) in serveList[TabCur]" :key="index">
						<view class="card-head" :class="item.show?'card-active':''">
                            <view class="iconBox" :class="serveResult.includes(item.itemId)?'active':''" @tap="checkboxChange(item.itemId)">
                            	<text class="icon"></text>
                            </view>
							<view class="card-title" @tap="cardClickHandle(index)">
                                <view class="card-left" >
                                	<p>{{item.content}}</p>
                                </view>
                                <view class="card-right">
                                	<text class="iconfont " :class="item.show?'icon-down2':'icon-arrow-down'"></text>
                                </view>
                            </view>
						</view>
					</view>
				</view>
			</view>
		</WucTab>
		<!-- 按钮区域 -->
		<view class="btnArea">
			<view class="step">已选{{chooseNum}}项</view>
			<view class="nextStep" @tap="nextStep()">下一步</view>
		</view>
		<!-- 履约服务 -->
		<selfBottomPop
            v-model="visible"
            :date="lyData.createDate"
            @rightHandle="save()"
            >
			<view slot="content" class="edit" v-if="visible">
				<textarea id="editor" 
				v-model="lyData.conclusion"
				class="ql-container" placeholder="请输入本次服务结论(必填)" @ready="onEditorReady">
				</textarea>
			</view>
		</selfBottomPop>
	</view>
</template>

<script>
	import { GetNowTime } from '@/common/tool.js'
	import { getPackItems,service } from '@/request/jyly.js'
	import WucTab from '@/components/wuc-tab/wuc-tab.vue'
	import selfBottomPop from '@/components/self-bottom-pop/self-bottom-pop.vue'
	export default {
		components:{ WucTab, selfBottomPop },
		data() {
			return {
				date:"2012-8-25",
				visible:false,
				show:false,
				tabList:[],
				chooseNum:'0',
				//tabList: [{ name: '初级服务包',num:0}, { name: '中级服务包',num:0},{ name: '高级服务包',num:0}],
				TabCur: 0,
				cardShow:false,
				serveList:[],
				cjServe:[],
				serveResult:[],
				config: [],
				//执行条件
				lyData:{
					// 传递而来
					signId:'',
					// 服务包id
					packId:'',
					// 服务项id string
					itemId:'',
					conclusion:'',
					createDate:''
				}
			};
		},
		onLoad: function (option) {
			const that = this;
			console.log('执行履约获取id',option.id);
			that.lyData.signId = option.id
			var req = {}
			req.signId = option.id|| '0ee05622-7092-4256-9b68-1491e7cbc24d'
			getPackItems(req).then((res)=>{
				console.log('服务包配置',res)
				if(res.ret){
					that.config = res.data
					that.config.forEach((item,index)=>{
						that.tabList.push({name:item['packName'],num:0})
						that.serveList.push(item.item)
					})
					console.log(that.serveList)
				}
			},)	
		},
		watch:{
			serveResult:{
				handler(newValue, oldValue) {
					this.tabList.forEach((item,index)=>{
						if(this.TabCur == index){
							this.$set(this.tabList[this.TabCur],'num',this.serveResult.length)
							this.chooseNum = this.serveResult.length;
						}
					})
				},
		　　　　deep:true
			}
		},
		created() {
			this.lyData.createDate = GetNowTime('-')
		},
		methods:{
			save(){
                if(!this.lyData.conclusion.trim()) {
                    this.$showToast('结论不能为空！')
                    return
                }
				this.lyData.packId = this.config[this.TabCur]['packId'];
				this.lyData.itemId = this.serveResult.join(',')
				//this.lyData.packName = this.config[this.TabCur]['packName']
				console.log(this.lyData)
				service(this.lyData).then(res=>{
					console.log('执行履约',res)
					if(res.ret){
						this.$showToast('执行履约完成');
						this.visible = false
						setTimeout(()=>{
							uni.navigateBack()
						}, 500)
					}
				})
			},
			tabChange(){
				this.serveResult.length = 0
				this.tabList.forEach((item,index)=>{
					this.$set(this.tabList[index],'num',0)
				})
			},
			// textArea输入
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			// 卡片展开状态
			cardClickHandle(index){	
				this.$set(this.serveList[this.TabCur][index],'show',!this.serveList[this.TabCur][index].show)
			},
			checkboxChange(value) {
				this.serveResult.indexOf(value)>-1?this.serveResult.splice(this.serveResult.indexOf(value),1): this.serveResult.push(value)
			},
			nextStep(){
				this.visible = true;
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.zxly{
		position: relative;
		height: 90%;
		.cjBall{
			margin-top: 40rpx;
			height: 100%;
			.card-checkbox{
				margin: 20rpx;
				background-color: #fff;
				border-radius: 10rpx;
				.card-head{
					position: relative;
					box-sizing: border-box;
                    display: flex;
					height:70rpx;
					background:rgba(255,255,255,1);
					border-radius:10rpx;
                    overflow: hidden;
                    .iconBox{
                        width: 60rpx;
                        float: left;
                        text-align: center;
                    	&::before{
                    		vertical-align: -10rpx;
                    		content: '';
                    		display: inline-block;
                    		width:29rpx;
                    		height:29rpx;
                    		border:1rpx solid rgba(210,210,210,1);
                    		border-radius:4rpx;
                            font-size: 26rpx;
                            font-weight: 600;
                            text-align: center;
                            content: '\2713';
                            color: #ffffff;
                    	}
                        &.active{
                            &::before{
                                background-color: #35A8FF;
                                border:1rpx solid #35A8FF;
                            }
                        }
                    }
                    .card-title{
                        flex: 1;
                        display: flex;
                        padding: 6rpx 0;
                        .card-left{
                            flex: 1;
                            box-sizing: border-box;
                            height:auto;
                            overflow: hidden;
                            font-size:30rpx;
                            font-weight:500;
                            color:rgb(51,51,51);
                            line-height: 46rpx;
                            p{
                                height: auto;
                                padding-top: 8rpx;
                            }
                        }
                        .card-right{
                            width: 60rpx;
                            text-align: center;
                            color: #999999;
                            line-height: 60rpx;
                            .iconfont{
                                display: inline-block;
                                font-size: 30rpx;
                            }
                        }
                    }
				}
				.card-active{
					height:auto;
				}
			}
		}
		.btnArea{
			z-index: 222;
			width: 100%;
			height: 98rpx;
			line-height: 98rpx;
			display: flex;
			position: fixed;
			font-size: 30rpx;
			bottom: 0;
			left: 0;
			text-align: center;
			.step{
				background-color: #fff;
				width: 50%;
			}
			.nextStep{
				color: #fff;
				background-color: #35A8FF;
				width: 50%;
			}
		}
	}
	.edit{
		font-size:30rpx;
		color:rgba(153,153,153,1);
		box-sizing: border-box;
		padding: 30rpx 20rpx;
		width:100%;
		height:349rpx;
		background:rgba(242,242,250,1);
		border-radius:10rpx;
	}
    .ql-container{
        color: #666666;
    }
</style>
