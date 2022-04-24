<template>
  <view>
    <view class="forms">
      <view class="items">
        <view class="items_left">
          <text>真实姓名</text>
        </view>
        <view class="items_content">
          <input v-model="userCers.name" placeholder="请输入您的姓名" type="text" />
        </view>
      </view>

      <view class="items">
        <view class="items_left">
          <text>身份证号</text>
        </view>
        <view class="items_content">
          <input v-model="userCers.id_number" placeholder="请输入身份证号" type="text" />
        </view>
      </view>

      <view class="identity">身份证正反面照片</view>

      <view class="picture">
        <view @click="editPhonePicture(1)">
          <!-- <image v-if="!userCers.id_front" src="@/static/zhengmian.png" mode=""></image>
					<image v-else :src="userCers.id_front" mode=""></image> -->
          <text>点击上传</text>
        </view>
        <view @click="editPhonePicture(2)">
          <!-- <image v-if="!userCers.id_back" src="@/static/beimian1.png" mode=""></image>
					<image v-else :src="userCers.id_back" mode=""></image> -->
          <text>点击上传</text>
        </view>
      </view>
      <view class="identity">手持身份证照片</view>

      <view class="picture">
        <view @click="editPhonePicture(3)">
          <!-- <image v-if="!userCers.id_handhold" src="@/static/shouci.png" mode=""></image>
					<image v-else :src="userCers.id_handhold" mode=""></image> -->
          <text>点击上传</text>
        </view>
      </view>

      <view class="save_btn" @click="goResults">提交审核</view>
    </view>
  </view>
</template>
<script setup>
   import { GlobalStore } from '@/store/modules/global'
   import { onBeforeMount, onMounted, nextTick, ref, reactive } from 'vue'
   const icons = reactive({
   	CLOSE: ''
   })
   const userCers = ({
   	name: '',
   	id_number: '', // 身份证号
   	id_front: '', // 身份证正面
   	id_back: '', // 身份证反面
   	id_handhold: '' // 手持身份证
   })
   const serVX = ref('')
   const goHome = () => {
   	uni.switchTab({
   	})
   }
   const uploadPictrue = (file, filePath, typeId) => { // 上传图片
   	uni.uploadFile({
   		url: 'https://xykdev.qdfqxx.com/api/user/upload',
   		filePath: filePath,
   		name: 'file',
   		formData: {
   			'id_front ': file
   		},
   		success: function(uploadFileRes) {
   			console.log(uploadFileRes)
   		}
   	})
   }
   const toast = (msg) => {
   	uni.showToast({
   		title: msg,
   		icon: 'none'
   	})
   }
   const ver = () => {
  	if(!userCers.name) {
  		toast('请您填写姓名')
  		return false
  	} else if(!userCers.id_number) {
  		toast('请您填写身份证号')
  		return false
  	} else if(!this.userCers.id_front) {
  		toast('请您上传身份证正面照片')
  		return false
  	} else if(!this.userCers.id_back) {
  		toast('请您上传身份证背面照片')
  		return false
  	} else if(!this.userCers.id_handhold) {
  		toast('请您上传手持身份证照片')
  		return false
  	}
  		return true

  }
   const goResults = () => {
   	if(ver) {
   		uni.showLoading({
   			title: '实名认证中, 请稍后...'
   		})
   	}
   }
   const editPhonePicture = (type) => {
   	const typeId = type
   	uni.chooseImage({
   		count: 1, //默认9
   		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
   		sourceType: ['album'], //从相册选择
   		success: function(res) {
   			uploadPictrue(res.tempFiles[0], res.tempFilePaths[0], typeId)
  		}
   	})
   }
</script>

<style lang="scss" scoped>
  .forms {
  	padding: 40rpx 32rpx 0 32rpx;

  	.items {
  		height: 80rpx;
  		border-bottom: 1rpx solid #e9e9e9;
  		display: flex;
  		align-items: center;
  		justify-content: space-between;
  		margin-bottom: 40rpx;

  		.items_left {
  			width: 180rpx;
  			font-size: 28rpx;
  			color: #333333;

  			image {
  				width: 100%;
  				height: 100%;
  			}
  		}

  		.items_content {
  			flex: 1;

  			input {

  				font-size: 24rpx;
  			}
  		}

  		.items_right {
  			display: flex;
  			justify-content: flex-end;
  			align-items: center;

  			image {
  				height: 48rpx;
  				width: 48rpx;
  			}

  			text {
  				padding: 10rpx 14rpx;
  				font-size: 20rpx;
  				border-radius: 4rpx;
  				border: 1rpx solid #333330;
  			}

  		}

  	}

  	.identity {
  		font-size: 28rpx;
  		color: #333333;
  		margin-bottom: 40rpx;
  	}

  	.picture {
  		display: flex;
  		flex-wrap: wrap;
  		justify-content: space-between;

  		view {
  			display: flex;
  			flex-direction: column;
  			align-items: center;
  			margin-bottom: 40rpx;

  			image {
  				width: 283.68rpx;
  				height: 162.11rpx;
  				margin-bottom: 40rpx;
  			}

  			text {
  				font-size: 20rpx;
  				color: rgba(0, 0, 0, 0.87);
  			}
  		}
  	}

  	.save_btn {
  		margin-top: 50rpx;
  		height: 96rpx;
  		background: #F98038;
  		border-radius: 8rpx;
  		display: flex;
  		justify-content: center;
  		align-items: center;
  		color: #FFF;
  		font-size: 28rpx;
  	}
  }
</style>
