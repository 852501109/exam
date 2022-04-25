<template>
  <view class="content">
    <view v-if="list.length==0" class="notice">暂无记录！</view>
    <uni-swipe-action
      v-for="(item,index) in list"
      :key="index+'a'"
      :threshold="200"
      class="swiper-item"
    >
      <uni-swipe-action-item :right-options="options" @click="onClick(item.id)">
        <view class="card" @tap="gxySfHandle(item.id)">
          <view class="imgArea">
            <img v-show="item.imgUrl" class="img" :src="$IMGURL + item.imgUrl" alt="" />
          </view>
          <view class="other">
            <view class="data">
              <text>{{item.data}}</text>
              <text class="dw">mmHg</text>
            </view>
            <text class="classFlow">随访方式:{{getfolType(item.classifyFollowUp)}}</text>
            <view class="status">
              <view class="shStatus">
                <text class="iconfont" :class="getStatus(item.upStatus)">
                  <text class="text">上传</text>
                </text>
                <text class="iconfont" :class="getStatus(item.shStatus)">
                  <text class="text">审核</text>
                </text>
              </view>
              <view class="time">{{item.date}}</view>
            </view>
          </view>
          <view class="conclusion" :class="item.conclusion=='满意'?'okCss': ''">
            {{item.conclusion}}
          </view>
        </view>
      </uni-swipe-action-item>
    </uni-swipe-action>
  </view>
</template>

<script>
  export default {
      props:{
          list:{
              type: Array,
              default() {
                  return []
              }
          },
      },
      data() {
          return {
              options:[
                  {
                      text: '删除',
                      style: {
                          backgroundColor: '#FE9C01',
                          fontSize: '34rpx'
                      }
                  }
              ],

          }
      },
      methods: {
  		//获取状态
  		getStatus(val) {
  			let status = ''
  			if(val == '0') {
  				status = 'icon-guanbi'
  			} else if (val == '1') {
  				status = 'icon-zhengque actIcon'
  			} else {
  				status = 'icon-guanbi red'
  			}
  			return status
  	},
  		getfolType(val) {
  			let type = ''
  			if(val == '1') {
  				type = '门诊'
  			} else if(val == '2') {
  				type = '家庭'
  			} else {
  				type = '电话'
  			}
  			return type
  		},
  		okLaterHandle() {
  			console.log(this.sfTitle)
  			if(this.sfTitle == '高血压') {
  				this.curr = '高血压'
  				this.addSf()
  			}
  			if(this.sfTitle == '糖尿病') {
  				this.curr = '糖尿病'
  				this.addSf()
  			}
  		},

      }

  }
</script>

<style lang="scss">
  .content {
  	padding: 45upx 32upx;

  	.card-box {
  		.swiper-item{
  			height: 186upx;
  			margin: 20rpx 0;
  		}
  		.card {
  			position: relative;
  			box-sizing: border-box;
  			background-color: #fff;
  			width: 100%;
  			height: 186upx;
  			border-radius: 10px;
  			padding: 20upx;
  			box-sizing: border-box;
  			display: flex;
  			.imgArea {
                  width: 181upx;
                  height: 136upx;
                  background-image: url('/static/image/err.png');
                  background-size:cover;
                  background-repeat:no-repeat;
                  background-position: center;
  				border-radius: 10upx;
                  overflow: hidden;
  				.img {
  					width: 181upx;
  					height: 136upx;
  				}
  			}
  			.other {
  				padding-left: 30upx;
  				flex: 1;
  				display: flex;
  				flex-direction: column;
  				.classFlow{
  					line-height: 40upx;
  					margin-left: 6upx;
  					font-size: 24rpx;
  					color: rgba(162, 164, 185, 1);
  				}
  				.data {
  					line-height: 56upx;
  					font-size: 40upx;
  					font-weight: bold;
  					color: rgba(255, 114, 0, 1);

  					.dw {
  						line-height: 56upx;
  						margin-left: 6upx;
  						font-size: 24rpx;
  						color: rgba(162, 164, 185, 1);
  					}
  				}

  				.status {
  					display: flex;
  					justify-content: space-between;
  					flex: 1;

  					.shStatus {
  						color: rgba(162, 164, 185, 1);

  						.iconfont {
  							margin-right: 20upx;
  							font-size: 20upx;

  							.text {
  								margin-left: 5upx;
  								font-size: 24rpx;
  							}
  							.acttext {
  								color: #00D39F;
  							}
  						}
  						.red{
  							color: #FF7200;
  						}
  						.actIcon {
  							color: #00D39F;
  						}
  					}

  					.time {
  						margin-top: 27upx;
  						font-size: 24rpx;
  						font-weight: 400;
  						color: rgba(162, 164, 185, 1);
  					}
  				}
  			}

  			.conclusion {
  				position: absolute;
  				top: 0;
  				right: 0;
  				border-radius: 0px 10px 0px 30px;
  				background-color: #FF7200;
  				text-align: center;
  				line-height: 30upx;
  				width: 135upx;
  				height: 30upx;
  				font-size: 24rpx;
  				color: rgba(255, 255, 255, 1);
  			}

  			.okCss {
  				background-color: #00D39F;
  			}
  		}

  		.notice {
  			color: #C0C0C0;
  			font-size: 28rpx;
  			text-align: center;
  		}
  	}
  }
</style>
