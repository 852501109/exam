<template>
  <view class="changePhone">
    <input v-model="req.tel" class="inp" type="number" value="" />
    <view type="primary" class="finsh" @tap="finsh()">修改完成</view>
  </view>
</template>

<script>
  import { telText } from '@/common/tool.js'
  import { updatePhone } from '@/request/jmsf.js'
  import { updateEtPhone } from '@/request/etsf.js'
  export default {
  	data() {
  		return {
  			req:{
  				ehrId:'',
  				tel:'',
  				cardId:'',
  			}
  		}
  	},
  	onLoad: function(option) {
  		console.log('获取电话号码', option)
  		this.req = option
  		this.req.lx = option.lx
  	},
  	methods:{
  		finsh() {
  			if(!this.req.tel) {
  				this.$showToast('手机号不能为空')
  			} else if(!telText(this.req.tel)) {
  				this.$showToast('手机号格式错误')
  			} else if(this.req.lx == 'et') {
  				updateEtPhone(this.req).then(res => {
  					if(res.ret) {
  						this.$showToast('修改电话成功')
  						this.$backIndex()
  					}
  				},err => {})
  			}else{
  				updatePhone(this.req).then(res => {
  					if(res.ret) {
  						this.$showToast('修改电话成功')
  						this.$backIndex()
  					}
  				},err => {})
  			}
  		}
  	}
  }
</script>

<style lang="scss">
  page{
  	background-color: #F5F9FF;
  }
  .changePhone{
  	padding: 20rpx;
  	display: flex;
  	align-items: center;
  	.inp{
  		background-color: #FFFFFF;
  		flex: 1;
  		margin-right: 20rpx;
  		border-radius: 10rpx;
  		text-indent: 32rpx;
  		height: 88rpx;
  	}
  	.finsh{
  		font-size: 30rpx;
  		color: #fff;
  		border-radius: 8rpx;
  		height: 70rpx;
  		line-height: 70rpx;
  		text-align: center;
  		background-color: #35A8FF;
  		width: 160rpx;
  	}
  }
</style>
