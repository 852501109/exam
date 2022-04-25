<template>
  <view class="content">
    <view class="card">
      <view class="ypName">
        <view class="title">药品名称</view>
        <view v-if="!existDrug" class="ypInput">
          <input-autocomplete
            v-model="ydssyqk.medicineName"
            class="input"
            :value="ydssyqk.medicineName"
            placeholder="请填写"
            highlight-color="#FF0000"
            :string-list="autocompleteStringList"
            @selectItem="selectItemS"
          ></input-autocomplete>
          <i class="iconfont icon-maikefeng" @tap="voiceInputStart()"></i>
        </view>
        <picker
          v-if="existDrug"
          class="picker"
          :range="autocompleteStringList"
          @change="selectItemS"
        >
          <view class="dwBox">
            <text class="plac" v-html="ydssyqk.medicineName?ydssyqk.medicineName:'请选择'"></text>
            <i class="iconfont icon-to"></i>
          </view>
        </picker>
      </view>
      <view class="ypUse">
        <view class="ypuseitem">
          <view class="yp-l">
            <view class="title">
              <span class="dot">*</span>
              <view class="title">用法</view>
            </view>
            <view class="dwBox">
              <input v-model="ydssyqk.eatCount" type="number" value="" />
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
              <input v-model="ydssyqk.medicineCount" type="number" value="" />
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
                <view
                  class="plac"
                  v-html="ydssyqk.medicineUnit?ydssyqk.medicineUnit:'请选择'"
                ></view>
                <i class="iconfont icon-to"></i>
              </view>
            </picker>
          </view>
        </view>
        <view class="ypName" style="margin-top: 60rpx;">
          <view class="title">用药备注</view>
          <view class="ypInput">
            <input v-model="ydssyqk.yybz" class="input" placeholder="请填写" type="text" value="" />
          </view>
        </view>
      </view>
      <button type="primary" class="saveBtn" @tap="save">保存</button>
      <view class="btnArea">
        <self-checkbox
          v-model="zDate"
          :list="zzList"
          @checkboxChange="checkboxChange"
        ></self-checkbox>
      </view>
    </view>
    <!-- 购药渠道 -->
    <!-- <view class="gyqd">
			<view class="title">其他购药渠道</view> 
			<view @tap="qtgyqd=!qtgyqd" :class="qtgyqd?'swiper-fun':'active'"></view>
		</view> -->
  </view>
</template>

<script>
   import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue'
  import selfCheckbox from '@/components/self-checkbox/self-checkbox.vue'
   import {
   	voiceInput
   } from '@/h5PlusApi/plus.js'
   import {
   	getDrugList
   } from '@/request/jmsf.js'
   export default {
   	components: {
   		selfCheckbox,
   		inputAutocomplete
   	},
   	onLoad: function(option) {
   		console.log('区分高血压糖尿病', JSON.parse(decodeURIComponent(option.post)))
   		option = JSON.parse(decodeURIComponent(option.post))
   		this.type = option.type
   		this.from = option.from
   		if (option.index || option.index == 0) {
   			// 修改药品
   			this.index = option.index
   			this.ydssyqk = option.item
   			// 处理自指
   			this.zDate = []
  			if (this.ydssyqk.yybz.indexOf('自') > -1) {
   				this.zDate.push('(自)')
   			}
   			if (this.ydssyqk.yybz.indexOf('指') > -1) {
   				this.zDate.push('(指)')
   			}
   		} else {
   			this.index = null
   		}
   		let config = uni.getStorageSync('config')
  		config = JSON.parse(config)
   		if (config.existDrug === "是") {
   			this.existDrug = true
   		}
   		// 获取常用药
   		const getDrugListPara = {
  			type: this.type,
  		}
   		if (this.existDrug) {
   			getDrugListPara.orgId = "existDrug"
   		}
   		getDrugList(getDrugListPara).then(res => {
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
  	data() {

  		return {
  			index: null,
  			medicList: [],
  			type: '',
  			ydssyqk: {
  				medicineName: '',
  				timeUnit: '日',
  				eatCount: '',
  				medicineCount: '',
  				medicineUnit: '片',
  				yybz: '',
  			},
  			autocompleteStringList: [],
  			zzList: [{
  					text: '(指)',
  					value: '(指)'
  				},
  				{
  					text: '(自)',
  					value: '(自)'
  				}
  			],
  			zDate: [],
  			Yfarray: ['日', '两日', '三日'],
  			ylggList: ['片', 'mg', '粒', 'g', '袋', '支', '瓶', '盒', 'U', 'ml'],
  			qtgyqd: true,
  			existDrug: false
  		}
  },
  	computed: {},
   	watch: {
   		// 'ydssyqk.medicineName': {
   		// 	 handler: function() {
   		// 		//do something
   		// 		console.log('药品名更改')
   		// 	 },
   		// 	 deep: true
   		// }
   	},
   	methods: {
   		selectItemS(event) {
   			let name
   			// 根据药品获得用法用量
   			if (this.existDrug) {
   				name = this.autocompleteStringList[event.target.value]
   				this.ydssyqk.medicineName = name
   			} else {
   				name = event
   			}
   			this.medicList.forEach((item, index) => {

   				if (item.name == name) {
   					console.log('获取的用药object', item.name, item.period)
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
   		//handleYyqk
   		bindPickerChange(e, pos) {
   			if (pos == 'yf') {
   				this.ydssyqk.timeUnit = this.Yfarray[e.detail.value]
   			} else if (pos == 'yldw') {
   				this.ydssyqk.medicineUnit = this.ylggList[e.detail.value]
   			}
   		},
   		checkboxChange(val) {
   			console.log(val)
   			if (this.ydssyqk.yybz.indexOf(val) == -1) {
   				this.ydssyqk.yybz += val
   			} else {
   				this.ydssyqk.yybz = this.ydssyqk.yybz.replace(val, '')
   			}
   		},
   		voiceInputStart() {
   			voiceInput(res => {
   				if (res) {
   					this.ydssyqk.medicineName = res
   				}
   			})
   		},
   		save() {
   			if (!this.ydssyqk.medicineName) {
   				return this.$showToast('用药名称必填')
   			}
   			this.ydssyqk.eatCount = this.ydssyqk.eatCount.toString()
   			// 区分高血压还是糖尿病
   			if (this.index || this.index == 0) {
   				// 更新
   				if (this.type == 'TNB') {
   					uni.$emit("TNBYWXG", {
   						data: this.ydssyqk,
   						index: this.index,
   						from: this.from
   					})
  				} else if (this.type == 'GXY') {
   					console.log('修改高血压用药')
   					uni.$emit("GXYYWXG", {
   						data: this.ydssyqk,
   						index: this.index,
   						from: this.from
   					})
  				} else if (this.type == 'JSB') {
   					uni.$emit("JSBYWXG", {
   						data: this.ydssyqk,
   						index: this.index,
   						from: this.from
   					})
  				} else if (this.type == 'JSBZD') {
   					uni.$emit("JSBZDYWXG", {
   						data: this.ydssyqk,
   						index: this.index,
   						from: this.from
   					})
  				}
   			} else if (this.type == 'TNB') {
  					uni.$emit("TNBYPMC", {
  						data: this.ydssyqk,
  						from: this.from
  					})
  			} else if (this.type == 'GXY') {
  					uni.$emit("GXYYPMC", {
  						data: this.ydssyqk,
  						from: this.from
  					})
  			} else if (this.type == 'JSB') {
  					uni.$emit("JSBYPMC", {
  						data: this.ydssyqk,
  						from: this.from
  					})
  			} else if (this.type == 'JSBYYZD') {
  					uni.$emit("JSBYPMCZD", {
  						data: this.ydssyqk,
  						from: this.from
  					})
  			}
   			uni.navigateBack({
   				delta: 1
   			})
   		},
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

  	.btnArea {
  		margin-top: 20rpx;
  	}

  	.card {
  		box-sizing: border-box;
  		width: 100%;
  		background: rgba(255, 255, 255, 1);
  		border-radius: 10rpx;
  		padding: 30rpx;

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
  				font-size: 26rpx;
  				font-weight: 400;
  				line-height: 28rpx;
  				color: #313131;
  			}

  			.plac {
  				font-size: 28rpx;
  				font-weight: 400;
  				color: #313131;
  				flex: 1;
  			}

  			.icon-to {
  				color: #A2A4B9;
  			}

  		}

  		.ypName {
  			.title {
  				font-size: 30rpx;
  				font-weight: bold;
  				line-height: 30rpx;
  				color: #000234;
  				opacity: 1;
  				margin-bottom: 10rpx;
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

  .ypPicker .placeholder {
  	flex-grow: 1;
  }
</style>
