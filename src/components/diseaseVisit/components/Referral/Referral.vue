<template>
	<view class="content">
		<view class="box">
			<view class="zzhenBox">
				<view class="title"><text class="redDot">*</text>主要现病史（转出原因）</view>
				<view class="card zzReason">
					<textarea v-model="formData.transferReason" auto-height="true" placeholder="请输入" cursorSpacing="10">
					</textarea>
					<picker
v-if="showMedicalHistoryPicker" mode="selector"
						:range="type=='GXY'?gxyReasonList:tnbReasonList" @change="reasonChoose($event)">
						<view class="iconfont icon-arrow-down"></view>
					</picker>
				</view>
				<view class="title"><text class="redDot">*</text>单位科室</view>
				<view class="card zzDepartment">
					<input v-model="formData.transferOrg" type="text" placeholder="请输入"></input>
					<view class="input-right-picker" @tap="linkageVisible=true">
						<view class="iconfont icon-arrow-down"></view>
						<w-picker
ref="linkage" v-model:visible="linkageVisible" mode="linkage" :options="orgList"
							:level="2" default-type="id" :default-props="defaultProps1"
							@confirm="onConfirm($event,'linkage')">
						</w-picker>
					</view>
				</view>
				<view class="title"><text class="redDot">*</text>接诊医生</view>
				<view class="card zzReason">
					<input v-model="formData.contractName" type="text" placeholder="请输入"></input>
					<my-picker
:options="orgList" :picker-list="doctorList" :picker-key="{value: 'value', label: 'name'}"
						:range="doctorList" @confirm="doctorChange($event,'phone')">
						<!-- <view class="docName" v-html="formData.contractName?formData.contractName:'请选择'"></view> -->
						<view class="iconfont icon-arrow-down"></view>
					</my-picker>
				</view>
				<view class="title">电话</view>
				<view class="card">
					<input v-model="formData.contractTel" type="number" style="width: 100%;" placeholder="请输入">
					</input>
				</view>
				<view class="title">转诊结果</view>
				<radio-group @change="radioChange">
					<label class="radio">
						<radio :checked="formData.transferResult == '0'" value="0" />
						<text>到位</text>
					</label>
					<label class="radio">
						<radio :checked="formData.transferResult == '1'" value="1" />
						<text>不到位</text>
					</label>
				</radio-group>
			</view>
		</view>
		<button type="primary" class="saveBtn" @tap="save">保存</button>
	</view>
</template>

<script>
	import {
		getTransferList,
		getTransferReasonList
	} from '@/request/jmsf.js'
	import selfFoldCard from '@/components/self-fold-card/self-fold-card.vue'
	import myPicker from '@/components/my-picker/Picker.vue'
	export default {
		components: {
			myPicker
		},
		data() {
			return {
				from: "",
				linkageVisible: false,
				defaultProps1: {
					label: "name",
					value: "id",
					children: "child"
				},
				gxyReasonList: [],
				tnbReasonList: [],
				// gxyReasonList:['连续2次血压控制不满意','连续3次控制不满意','收缩压≥180mmHg或舒张压≥110mmHg','长期控制不满意'],
				//tnbReasonList:['连续2次控制不满意','连续3次控制不满意','空腹血糖≥16.7mmol/L','空腹血糖≤3.9mmol/L','随机血糖>20mmol/L','长期控制不满意'],
				orgList: [{
					id: '',
					name: '',
					child: [{
						id: "",
						name: "",
					}]
				}],
				doctorList: [{
					id: '',
					name: '',
					phone:''
				}],
				type: '',
				highPressure: '',
				lowPressure: '',
				keName: '',
				formData: {
					transferOrg: '',
					contractName: '',
					//初步印象
					transferReason: '',
					// 既往史
					contractTel: "",
					transferResult: ""
				}
			}
		},
		computed: {
			showMedicalHistoryPicker() {
				return this.from !== "children" && this.from !== "pregant"
			}
		},
		onLoad: function(option) {
			console.log(option)
			this.type = option.type
			if (option.highPressure != 'null' && option.highPressure) {
				this.highPressure = Number(option.highPressure)
			} else {
				this.highPressure = 0
			}
			if (option.lowPressure != 'null' && option.lowPressure) {
				this.lowPressure = Number(option.lowPressure)
			} else {
				this.lowPressure = 0
			}
			this.from = option.from
			// 获取配置
			console.log('传过来的配置', {
				type: this.type,
				highPressure: this.highPressure,
				lowPressure: this.lowPressure
			})
			getTransferReasonList({
				type: this.type,
				highPressure: this.highPressure,
				lowPressure: this.lowPressure
			}).then((res) => {
				if (this.type == 'GXY') {
					this.gxyReasonList = res.data
					if (!this.formData.transferReason) {
						this.formData.transferReason = this.gxyReasonList[0]
						console.log('获取的转诊原因列表', this.gxyReasonList)
					}
				} else {
					this.tnbReasonList = res.data
					if (!this.formData.transferReason) {
						this.formData.transferReason = this.tnbReasonList[0]
						console.log('获取的转诊原因列表', this.tnbReasonList)
					}
				}
			})
			getTransferList().then(res => {
				console.log(res)
				if (res.ret && res.data) {
					this.orgList = res.data
					this.formData.transferOrg = res.data[0].name + ',' + res.data[0].child[0].name
					this.doctorList = res.data[0].child[0].child
					console.log('获取的科室列表', this.orgList)
					console.log('获取的医生列表', this.doctorList)
				}

			})

			if (!option.transferOrg || option.transferOrg == 'null') {
				this.formData.transferOrg = ''
			} else {
				this.formData.transferOrg = option.transferOrg
			}
			if (!option.transferOrg == 'null') {
this.formData.transferReason = option.transferReason
}
			if (option.contractName == 'null') {
				this.formData.contractName = ''
			} else {
				this.formData.contractName = option.contractName
			}
			if (option.contractTel == 'null') {
				this.formData.contractTel = ''
			} else {
				this.formData.contractTel = option.contractTel
			}
			if (option.transferResult == 'null') {
				this.formData.transferResult = ''
			} else {
				this.formData.transferResult = option.transferResult
			}
		},
		methods: {
			radioChange(res) {
				this.formData.transferResult = res.target.value
			},
			doctorChange(e) {
				this.formData.contractName = e.label
				this.formData.contractTel = this.doctorList[e.index].phone
			},
			onEditorReady() {
				// uni.createSelectorQuery().select('#editor').context((res) => {
				// 	this.editorCtx = res.context
				// }).exec()
			},
			reasonChoose(e) {
				const index = e.detail.value
				if (this.type == 'TNB') {
					if (this.formData.transferReason) {
						this.formData.transferReason = this.formData.transferReason + '，' + this.tnbReasonList[index]
					} else {
						this.formData.transferReason = this.tnbReasonList[index]
					}

				} else if (this.type == 'GXY') {
					console.log(this.gxyReasonList, this.gxyReasonList[index])
					if (this.formData.transferReason) {
						this.formData.transferReason = this.formData.transferReason + '，' + this.gxyReasonList[index]
					} else {
						this.formData.transferReason = this.gxyReasonList[index]
					}
				} else if (this.type == 'JSB') {
					this.formData.transferReason = this.gxyReasonList[index]
				} else if (this.type == 'YCF13') {
					this.formData.transferReason = this.gxyReasonList[index]
				} else if (this.type == 'YCF16') {
					this.formData.transferReason = this.gxyReasonList[index]
				} else if (this.type == 'YCF7') {
					this.formData.transferReason = this.gxyReasonList[index]
				} else if (this.type == 'XSE1') {
					this.formData.transferReason = this.gxyReasonList[index]
				} else if (this.type == 'XSE2') {
					this.formData.transferReason = this.gxyReasonList[index]
				} else if (this.type == 'XSE3') {
					this.formData.transferReason = this.gxyReasonList[index]
				} else if (this.type == 'XSE4') {
					this.formData.transferReason = this.gxyReasonList[index]
				}

			},
			onConfirm(e) {
				console.log(e)
				//this.formData.transferOrg = e.result
				this.formData.transferOrg = e.obj.col1.name + ',' + e.obj.col2.name
				this.doctorList = e.obj.col2.child
			},
			save() {
				if (!this.formData.transferOrg) {
					this.$showToast('转诊科室必填')
				} else if (!this.formData.transferReason) {
					this.$showToast('转诊原因必填')
				} else {
					this.formData.transferOrg = this.formData.transferOrg.replace('科', '')
					console.log('科室', this.formData.transferOrg)
					if (this.type == 'TNB') {
						console.log('send')
						uni.$emit("TNBZZ", {
							data: this.formData
						})
					} else if (this.type == 'GXY') {
						uni.$emit("GXYZZ", {
							data: this.formData
						})
					} else if (this.type == 'JSB') {
						uni.$emit("JSBZZ", {
							data: this.formData
						})
					} else if (this.type == 'YCF13') {
						uni.$emit("YCF13", {
							data: this.formData
						})
					} else if (this.type == 'YCF16') {
						uni.$emit("YCF16", {
							data: this.formData
						})
					} else if (this.type == 'YCF7') {
						uni.$emit("YCF7", {
							data: this.formData
						})
					} else if (this.type == 'XSE1') {
						uni.$emit("XSE1", {
							data: this.formData
						})
					} else if (this.type == 'XSE2') {
						uni.$emit("XSE2", {
							data: this.formData
						})
					} else if (this.type == 'XSE3') {
						uni.$emit("XSE3", {
							data: this.formData
						})
					} else if (this.type == 'XSE4') {
						uni.$emit("XSE4", {
							data: this.formData
						})
					}
					uni.navigateBack({
						delta: 1
					})
				}

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

	@mixin flexCss($direction) {
		@if $direction==row {
			display: flex;
			justify-content: space-between;
		}

		@else if $direction==column {
			display: flex;
			flex-direction: column;
		}
	}

	page {
		background-color: #F5F9FF;
		overflow: auto;

		.content {
			padding: 20rpx;

			.box {
				border-radius: 10rpx;
				padding: 20rpx;
				background-color: #fff;
				padding-bottom: 80rpx;
			}

			.title {
				font-size: 28rpx;
				font-weight: 400;
				color: #313131;
				margin: 40rpx 0 10rpx 0;
			}

			.zzhenBox {
				box-sizing: border-box;
				width: 100%;

				.redDot {
					color: red;
				}

				.zzReason {
					display: flex;
					font-size: 32rpx;
					align-items: center;

					.icon-arrow-down {
						width: 240rpx;
						height: 100%;
						text-align: right;
					}
				}

				.zzDepartment {
					display: flex;
					font-size: 32rpx;
					align-items: center;

					.input-right-picker {
						width: 240rpx;
						height: 100%;
						text-align: right;
					}
				}

				.card {
					.docName {
						font-size: 36rpx;
						color: #313131;
					}

					#editorBox {
						height: 20rpx;
					}

					@include flexCss(row);
					@include border;
				}
			}

			.saveBtn {
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
			}
		}
	}

	.radio {
		margin-right: 20rpx;
	}
</style>
