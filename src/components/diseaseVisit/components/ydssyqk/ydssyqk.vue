<template>
  <view class="content">
    <view class="card">
      <view class="ypName">
        <view class="title">胰岛素名称</view>
        <view class="ypInput">
          <input-autocomplete
            v-model="ydssyqk.name"
            class="input"
            :value="ydssyqk.name"
            placeholder="请填写"
            highlight-color="#FF0000"
            :string-list="autocompleteStringList"
            @selectItem="selectItemS"
          ></input-autocomplete>
          <i class="iconfont icon-maikefeng" @tap="voiceInputStart()"></i>
          <!-- <input class="input" v-model="ydssyqk.name" placeholder="请填写" type="text" value="" /> -->
        </view>
      </view>
      <view class="ypUse">
        <view class="ypuseitem">
          <view class="yp-l">
            <view class="title">
              <span class="dot">*</span>
              <view class="title">用法</view>
            </view>
            <view class="dwBox">
              <input v-model="ydssyqk.time" type="number" value="" />
              <span class="dw">次</span>
            </view>
          </view>
          <view class="yp-r">
            <view class="title">
              <span class="dot">*</span>
              <view class="title">用法周期</view>
            </view>
            <picker class="picker" :range="Yfarray" @change="bindPickerChange($event,'yf')">
              <view class="dwBox">
                <view class="plac" v-html="ydssyqk.timeUnit?ydssyqk.timeUnit:'请选择'"></view>
                <i class="iconfont icon-to"></i>
              </view>
            </picker>
          </view>
        </view>
        <view class="ypuseitem">
          <view class="yp-l">
            <view class="title">
              <span class="dot">*</span>
              <view class="title">用量</view>
            </view>
            <view class="dwBox">
              <input v-model="ydssyqk.amount" type="number" value="" />
              <span class="dw">剂量</span>
            </view>
          </view>
          <view class="yp-r">
            <view class="title">
              <span class="dot">*</span>
              <view class="title">用量规格</view>
            </view>
            <picker class="picker" :range="ylggList" @change="bindPickerChange($event,'yldw')">
              <view class="dwBox">
                <view class="plac" v-html="ydssyqk.amountUnit?ydssyqk.amountUnit:'请选择'"></view>
                <i class="iconfont icon-to"></i>
              </view>
            </picker>
          </view>
        </view>
      </view>
      <view class="ypName" style="margin-top: 40rpx;">
        <view class="title">用药备注</view>
        <view class="ypInput">
          <input v-model="ydssyqk.yybz" class="input" placeholder="请填写" type="text" value="" />
        </view>
      </view>
      <button type="primary" class="saveBtn" @tap="save">保存</button>
    </view>
    <!-- 购药渠道 -->
    <!-- <view class="gyqd">
			<view class="title">其他购药渠道</view> 
			<view @tap="qtgyqd=!qtgyqd" :class="qtgyqd?'swiper-fun':'active'"></view>
		</view> -->
  </view>
</template>

<script>
  import {
  	voiceInput
  } from '@/h5PlusApi/plus.js'
  import {
  	getDrugYDSList
  } from '@/request/jmsf.js'
  export default {
  	data() {
  		return {
  			index: null,
  			ydssyqk: {
  				name: '',
  				timeUnit: '日',
  				time: '',
  				amount: '',
  				amountUnit: 'U',
  				yybz: ''
  			},
  			ypm: '',
  			Yfarray: ['日'],
  			ylggList: ['片', 'mg', '粒', 'g', '袋', '支', '瓶', '盒', 'U', 'ml'],
  			qtgyqd: true,
  			autocompleteStringList: [],
  		}
  },
  	onLoad: function(option) {
  		console.log('区分胰岛素新增还是修改', JSON.parse(decodeURIComponent(option.post)))
  		option = JSON.parse(decodeURIComponent(option.post))
  		this.from = option.from
  		if (option.index || option.index == 0) {
  			// 修改药品
  			this.index = option.index
  			this.ydssyqk = option.item
  		} else {
  			this.index = null
  		}
  		// 获取常用药
  		getDrugYDSList().then(res => {
  			//获取的用药
  			console.log('获取的用药', res)
  			if (res.ret && res.data) {
  				res.data.forEach((item, index) => {
  					this.autocompleteStringList.push(item.name)
  				})
  				this.medicList = res.data
  				console.log('获取的用药', res.data)
  			}
  		},)
  	},
  	methods: {
  		bindPickerChange(e, pos) {
  			if (pos == 'yf') {
  				this.ydssyqk.timeUnit = this.Yfarray[e.detail.value]
  			} else if (pos == 'yldw') {
  				this.ydssyqk.amountUnit = this.ylggList[e.detail.value]
  			}
  		},
  		selectItemS(name) {
  			console.log('获取的用药', name)
  			// 根据药品获得用法用量
  			this.medicList.forEach((item, index) => {

  				if (item.name == name) {
  					console.log('获取的用药', item.name, item.period)
  					// 用法周期
  					this.ydssyqk.timeUnit = item.period
  					// 用法
  					this.ydssyqk.eatCount = item.usage
  					// 用量
  					this.ydssyqk.medicineCount = item.dosage
  					// 用量规格
  					this.ydssyqk.medicineUnit = item.specification
  				}
  			})
  		},
  		voiceInputStart() {
  			voiceInput(res => {
  				if (res) {
  					this.ydssyqk.name = res
  				}
  			})
  		},
  		save() {
  			if (this.index || this.index == 0) {
  				// 更新
  				console.log('触发更新', this.ydssyqk)
  				uni.$emit("YDSXG", {
  					data: this.ydssyqk,
  					index: this.index,
  					from: this.from
  				})
  		} else {
  				console.log('触发新增', this.ydssyqk)
  				uni.$emit("UDS", {
  					data: this.ydssyqk,
  					from: this.from
  				})
  		}
  			uni.navigateBack({
  				delta: 1
  			})
  		}
  	}
  }
</script>

<style lang="scss">
  @mixin border {
  	background-color: #deeefb;
  	border-radius: 8rpx;
  	padding: 10rpx 8rpx;
  	border: 2px solid rgb(53, 168, 255);
  }

  .content {
  	padding: 30rpx 32rpx;

  	.saveBtn {
  		position: fixed;
  		bottom: 0;
  		left: 0;
  		width: 100%;
  	}

  	.card {
  		box-sizing: border-box;
  		width: 100%;
  		height: 610rpx;
  		background: rgba(255, 255, 255, 1);
  		border-radius: 10rpx;
  		padding: 30rpx;

  		.ypName {
  			.title {
  				font-size: 30rpx;
  				font-weight: bold;
  				line-height: 30rpx;
  				color: #000234;
  				opacity: 1;
  			}

  			.ypInput {
  				@include border;
  				margin-top: 10rpx;
  				height: 62rpx;
  				display: flex;
  				align-items: center;

  				.input {
  					height: 62rpx;
  					flex: 1;
  				}

  				.iconfont {
  					color: #A2A4B9;
  				}
  			}
  		}

  		.ypUse {
  			.ypuseitem {
  				margin-top: 26rpx;
  				display: flex;
  				justify-content: space-between;

  				.yp-l,
  				.yp-r {
  					width: 240rpx;
  					height: 104rpx;
  				}

  				.title {
  					display: inline-block;
  					font-size: 28rpx;
  					font-weight: 400;
  					color: rgba(112, 112, 132, 1);

  					.dot {
  						color: red;
  					}
  				}

  				.dwBox {
  					@include border;
  					height: 62rpx;
  					line-height: 62rpx;
  					display: flex;
  					align-items: center;

  					input {
  						flex: 1;
  					}

  					.dw {
  						font-size: 20rpx;
  						font-weight: 400;
  						line-height: 28rpx;
  						color: rgba(162, 164, 185, 1);
  					}

  					.plac {
  						font-size: 30rpx;
  						font-weight: 400;
  						color: rgba(162, 164, 185, 1);
  						flex: 1;
  					}

  					.icon-to {
  						color: #A2A4B9;
  					}

  				}
  			}
  		}
  	}

  	.gyqd {
  		box-sizing: border-box;
  		margin-top: 30rpx;
  		padding: 0 30rpx;
  		width: 100%;
  		height: 102rpx;
  		background: rgba(255, 255, 255, 1);
  		border-radius: 10rpx;
  		display: flex;
  		justify-content: space-between;
  		align-items: center;

  		.title {
  			font-size: 30rpx;
  			font-weight: bold;
  			line-height: 102rpx;
  			color: rgba(0, 2, 52, 1);
  		}

  		.swiper-fun {
  			width: 76rpx;
  			height: 42rpx;
  			background: rgba(216, 224, 238, 1);
  			border-radius: 42rpx;
  			position: relative;

  			&::after {
  				content: '';
  				display: block;
  				width: 34rpx;
  				height: 34rpx;
  				position: absolute;
  				top: 50%;
  				left: 2rpx;
  				margin-top: -17rpx;
  				border-radius: 50%;
  				background: rgba(255, 255, 255, 1);
  			}
  		}

  		.active {
  			width: 76rpx;
  			height: 42rpx;
  			background: #35A8FF;
  			border-radius: 42rpx;
  			position: relative;

  			&::after {
  				content: '';
  				display: block;
  				width: 34rpx;
  				height: 34rpx;
  				position: absolute;
  				top: 50%;
  				right: 2rpx;
  				margin-top: -17rpx;
  				border-radius: 50%;
  				background: rgba(255, 255, 255, 1);
  			}
  		}
  	}
  }
</style>
