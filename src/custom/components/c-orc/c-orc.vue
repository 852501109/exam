<!-- <template>
	<view class="content">
		<view>
			<button @tap="inter(1)">身份证识别正面（手动）</button>
			<button @click="inter(2)">身份证识别正面（自动）</button>
			<button @click="inter(3)">身份证识别反面（手动）</button>
			<button @click="inter(4)">身份证识别反面（自动）</button>
			<button @click="inter(5)">通用文字识别</button>
			<button @click="inter(6)">通用文字识别（高精度）</button>
			<button @click="inter(7)">车牌识别</button>
			<button @click="inter(8)">驾驶证识别</button>
		</view>
		<image class="logo" :src="logoSrcs"></image>
		<scroll-view scroll-y="true">
			<view class="msg" v-html="msg">
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import startProcess from '@/common/baidu-idcard.js'
	export default {
		data() {
			return {
				title: 'Hello',
				msg: '',
				logoSrcs: '/static/logo.png',
			}
		},
		onLoad() {

		},
		methods: {
			IDCardScan() {
			  startProcess((result) => {
			    console.log(result)
			
			    // this.nationIndex = this.nationList.indexOf(result.data.ethnic + "族")
			    if (result.idNumber === "") {
			      console.log('身份证识别失败')
			    }
			  }, (result) => {
			    console.log('身份证识别失败')
			  })
			},
			inter(inx) {
				const _self = this;
				const PPOCR = uni.requireNativePlugin('PP-BaiduOCR');
				if (inx == 1) {
					// this.IDCardScan()
					PPOCR.IDFront({ "auto": false }, result => {
						_self.sendmsg(result);
					});
				} else if (inx == 2) {
					PPOCR.IDFront({ "auto": true }, result => {
						_self.sendmsg(result);
					});
				} else if (inx == 3) {
					PPOCR.IDBack({ "auto": false }, result => {
						_self.sendmsg(result);
					});
				} else if (inx == 4) {
					PPOCR.IDBack({ "auto": true }, result => {
						_self.sendmsg(result);
					});
				} else if (inx == 5) {
					PPOCR.Text({ "exact": false }, result => {
						_self.sendmsg(result);
					});
				} else if (inx == 6) {
					PPOCR.Text({ "exact": true }, result => {
						_self.sendmsg(result);
					});
				} else if (inx == 7) {
					PPOCR.CustomOrder({ "order": 122 }, result => {
						_self.sendmsg(result);
					});
				}
				else if (inx == 8) {
					PPOCR.CustomOrder({ "order": 121 }, result => {
						_self.sendmsg(result);
					});
				}
			},
			sendmsg(result) {
				console.log(result.code)
				let _self = this;
				_self.msg = JSON.stringify(result);
				if (result.imgbase64)
					_self.bitmapsave(result.imgbase64)
			},
			bitmapsave(basedata) {
				let _self = this;
				var bitmap = new plus.nativeObj.Bitmap("test");
				console.log(_self.logoSrcs)
				bitmap.loadBase64Data(basedata, function(e) {
					bitmap.save('_doc/_tmp/ocr' + new Date().getTime() + '.png', {}, function(e) {
						_self.logoSrcs = e.target;
					});
				}, function() {
					console.log('加载Base64图片数据失败：' + JSON.stringify(e));
				});
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 50upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.msg {
		text-align: left;
		padding: 40rpx;
		font-size: 25rpx;
		color: #F0AD4E;
	}
</style>
 -->