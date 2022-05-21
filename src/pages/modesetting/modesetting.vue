<template>
  <view class="page_wrapper">
    <c-nav left-icon="left" left-text="系统设置" right-type="btn" right="保存" />
    <uni-collapse ref="collapse" class="collapse" @change="change">
      <uni-collapse-item title="软件设置" :show-animation="true">
        <uni-forms :model-value="formData" class="software">
          <uni-forms-item label-width="263" label="主机ip地址" name="idAddress">
            <uni-easyinput
              v-model="formData.idAddress"
              type="text"
              placeholder="请输入主机id地址"
            />
          </uni-forms-item>
          <uni-forms-item label-width="263" label="同步主机数据" name="asyncHostData">
            <!--           <c-test></c-test> -->
            <picker
              :value="hostIndex"
              :range="hostList"
              range-key="name"
              @change="hostPickerChange"
            >
              <view class="uni-input">{{hostIndex}}</view>
            </picker>
          </uni-forms-item>
          <uni-forms-item label-width="440" label="数据自动上传" name="importAuto">
            <switch click="binddata('importAuto',$event.detail.value)" />
          </uni-forms-item>
        </uni-forms>
      </uni-collapse-item>
      <uni-collapse-item title="模块设置" :show-animation="true">
        <uni-forms :model-value="formData" class="software">
          <uni-forms-item label-width="263" label="同步主机数据">
            <picker
              mode="selector"
              :value="versionIndex"
              :range="versionList"
              @change="versionPickerChange"
            >
              <view class="uni-input">{{versionList[versionIndex]}}</view>
            </picker>
          </uni-forms-item>
        </uni-forms>
        <!-- 基础设置 -->
        <view class="module_title">开启开关可启用模块;点击齿轮进入模块功能</view>
        <div class="module_switch">
          <div v-for="(item, i) in settingList" :key="i" class="switch_box">
            <span class="left">{{ item.lable }}</span>
            <div class="right">
              <uni-icons :color="iconColor" type="gear-filled" :size="settingBtnSize"></uni-icons>
              <switch class="switch" @change="switchChange" />
            </div>
          </div>
        </div>
        <!-- 体检类 -->
        <view class="module_title">体检类</view>
        <div class="module_switch">
          <div v-for="(item, i) in physicalList" :key="i" class="switch_box">
            <span class="left">{{ item.lable }}</span>
            <div class="right">
              <uni-icons :color="iconColor" type="gear-filled" :size="settingBtnSize"></uni-icons>
              <switch class="switch" @change="switchChange" />
            </div>
          </div>
        </div>
        <!-- 其他类 -->
        <view class="module_title">其他类</view>
        <div class="module_switch">
          <div v-for="(item, i) in otherList" :key="i" class="switch_box">
            <span class="left">{{ item.lable }}</span>
            <div class="right">
              <uni-icons :color="iconColor" type="gear-filled" :size="settingBtnSize"></uni-icons>
              <switch class="switch" @change="switchChange" />
            </div>
          </div>
        </div>
        <!-- 个性化 -->
        <view class="module_title">个性化</view>
        <div class="module_switch">
          <div v-for="(item, i) in individuationList" :key="i" class="switch_box">
            <span class="left">{{ item.lable }}</span>
            <div class="right">
              <uni-icons :color="iconColor" type="gear-filled" :size="settingBtnSize"></uni-icons>
              <switch class="switch" @change="switchChange" />
            </div>
          </div>
        </div>
      </uni-collapse-item>
    </uni-collapse>
  </view>
</template>

<script setup lang="ts">
  import {ref, reactive} from 'vue'
  const formData = reactive({
    idAddress: '',
    asyncHostData: '',
    importAuto: false
  })

  const hostIndex = ref(0)
  const hostList = reactive([{ name: '中国' }, { name: '美国' }, { name: '巴西' }, { name: '日本' }])
  const hostPickerChange = e => {
     // hostIndex.value = e.target.value
  }
  const versionIndex = ref(0)
  const versionList = reactive([{ name: '中国' }, { name: '美国' }, { name: '巴西' }, { name: '日本' }])
  // 齿轮按钮大小
  const settingBtnSize = ref(23)
  const iconColor = ref('#909399')
  // 模块设置
  const settingList = reactive([{
   lable: '基础设置',
   value: 'setting'
  },{
   lable: '自理能力',
   value: 'setting'
  },{
   lable: '中医体质辨识',
   value: 'setting'
  }])
  // 模块设置--体检
  const physicalList = reactive([{
   lable: '身高体重',
   value: 'setting'
  },{
   lable: '血压',
   value: 'setting'
  },{
   lable: '血压(双设备)',
   value: 'setting'
  },{
   lable: '生活方式',
   value: 'setting'
  },{
   lable: '口腔',
   value: 'setting'
  },{
   lable: '视力',
   value: 'setting'
  },{
   lable: '内科',
   value: 'setting'
  },{
   lable: '外科',
   value: 'setting'
  },{
   lable: '妇科',
   value: 'setting'
  },{
   lable: '住院和用药',
   value: 'setting'
  }])
  // 模块设置--其他
  const otherList = reactive([{
  	  lable: '家庭膳食',
  	  value: 'setting'
  },{
  	  lable: '血型',
  	  value: 'setting'
  },{
  	  lable: '血糖',
  	  value: 'setting'
  },{
  	  lable: '糖化血红蛋白',
  	  value: 'setting'
  },{
  	  lable: '血检条码录入',
  	  value: 'setting'
  },{
  	  lable: '联系地址',
  	  value: 'setting'
  },{
  	  lable: '封面拍照',
  	  value: 'setting'
  }])
  // 模块设置--个性化
  const individuationList = reactive([{
  	  lable: '肺结核筛查',
  	  value: 'setting'
  },{
  	  lable: '扩展信息',
  	  value: 'setting'
  },{
  	  lable: '中医拍照',
  	  value: 'setting'
  },{
  	  lable: '慢性病耳穴压豆',
  	  value: 'setting'
  },{
  	  lable: '慢性病手指点穴',
  	  value: 'setting'
  },{
  	  lable: '慢病中医干预记录',
  	  value: 'setting'
  },{
  	  lable: '老年人中医随访',
  	  value: 'setting'
  }])
  const versionPickerChange = e => {
     versionIndex.value = e.target.value
  }
  const collapse = ref<InstanceType<typeof collapse>>()
  const change = p => {
     collapse.value.resize()
  }
</script>
<style lang="scss">
  .collapse {
  	.software {
  		padding: 0 20.5rpx 0 36rpx;
  	}
  	.module_title {
  		margin-top: 15.69rpx;
  		margin-bottom: 5.88rpx;
  		padding: 0 20.5rpx 0 36rpx;
  		color: $foot-color;
  	}
  	.module_switch {
  		padding: 0 20.5rpx 0 36rpx;
  		@include flex(row,space-between,center,wrap);
  		.switch_box {
  			width: 320rpx;
  			border-radius: 8px;
  			margin-top: 5.88rpx;
  			margin-bottom: 5.88rpx;
  			padding: 17.65rpx 15.69rpx;
  			border: 1px solid #DCDCDC;
  			@include flex-two(row,space-between,center,wrap);
  			.left {
  				align-self:center;
  			}
  			.right {
  		@include flex-two(row,space-between,center,wrap);
  				.switch {
  					transform: scale(0.7);
  				}
  			}
  		}
  	}
  }
</style>
