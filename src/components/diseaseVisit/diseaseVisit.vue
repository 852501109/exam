<template>
  <view class="doctor_appoint">
    <view class="nav_title">查询到{{total}}人</view>
    <view class="content">
      <mescroll-body ref="mescrollRef" :down="{use:false}" :up="upOption" @up="upCallback">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="content_item"
          @tap="linkTo(item.id,item.imgurl,item.idCard,item.orgId,item.orgName,item.diabetesId,item.hypertensionId,item.name)"
        >
          <view class="item_left">
            <img v-show="item.imgurl" :src="$IMGURL + item.imgurl" alt="" />
          </view>
          <view class="item_right">
            <view class="baseInfor">
              <span>{{item.name}}</span>
              <span>{{item.gender}}</span>
              <span>{{idToInfor(item.idCard)}}岁</span>
              <view v-show="item.emigrationFlag==1" class="out">迁出</view>
            </view>
            <view class="id_card">
              <i class="iconfont icon-Id"></i>
              <text class="inforCon">{{item.idCard|IdcardEncry}}</text>
            </view>
            <view class="yl_org">
              <i class="iconfont icon-yiliaojigou"></i>
              <span>{{item.orgName}}&nbsp;{{item.group}}</span>
            </view>
            <view class="ry_type">
              <view
                v-for="(ite, inde) in item.ryType"
                :key="inde"
                class="ry_item"
                :class="{org:ite=='糖尿病'}"
              >
                {{ite}}
              </view>
            </view>
            <view class="yl_org">
              <span>上次随访：{{item.lastSf}}</span>
            </view>
          </view>
        </view>
      </mescroll-body>
    </view>
    <!-- search-pop -->
    <selfSearchPop v-model="popShow" @resert="resert" @ok="search">
      <view slot="content">
        <selfSearchInput
          v-model="post.nameOrIdno"
          placeholder="输入姓名或身份证号搜索"
          @cancel="popShow=false"
          @confirm="search"
        ></selfSearchInput>
        <view class="pop-content">
          <view class="search-title">按机构筛选</view>
          <my-picker
            :picker-key="{value: 'id', label: 'name', }"
            :picker-list="orgList"
            @confirm="chooseJg($event)"
          >
            <view class="select">
              <view class="orgname">{{jgText}}</view>
              <span class="iconfont icon-to"></span>
            </view>
          </my-picker>
          <view class="search-title">人员类型</view>
          <self-ry-checkbox
            v-model="post.ryType"
            :huchi="true"
            :list="ryList"
            col="3"
          ></self-ry-checkbox>
          <view class="search-title">根据组筛选</view>
          <view class="groups">
            <input v-model="post.groups" type="text" value="" />
          </view>
          <view class="notice">多个组之间用【,】分割(示例：0,9,23)或一组,二组</view>
          <view class="search-title">根据时间范围筛选</view>
          <view
            class="select"
            style="justify-content: flex-start;"
            @click="onShowDatePicker('rangetime')"
          >
            <view v-show="post.startTime" class="orgname">{{post.startTime}}——</view>
            <view class="orgname">
              {{post.endTime}}
            </view>
          </view>
          <view class="search-title">状态</view>
          <view class="chose_rytype">
            <self-radio-checkbox
              v-model="post.emigrationFlag"
              :list="statusList"
            ></self-radio-checkbox>
          </view>
        </view>
        <!-- 时间间隔选择 -->
        <mx-date-picker
          :show-holiday="false"
          :show-tips="false"
          :show-seconds="false"
          :show="showPicker"
          type="rangetime"
          format="yyyy-mm-dd"
          :value="rangeTime"
          :show-tips="true"
          :show-seconds="true"
          @confirm="onSelected"
          @cancel="showPicker = false"
        />
      </view>
    </selfSearchPop>
  </view>
</template>

<script>
      import { idToInfor } from '@/common/tool.js'
      import { getType } from '@/request/jyqy.js'
      import { getOrgList,gxyGetManageInfo } from '@/request/user.js'
      import { getSfList } from '@/request/jmsf.js'
      import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
      import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
      import selfSearchPop from '@/components/self-search-pop/self-search-pop.vue'
      import selfSearchInput from '@/components/self-search-input/self-search-input.vue'
      import selfRyCheckbox from '@/components/self-ry-checkbox/self-ry-checkbox.vue'
      import myPicker from '@/components/my-picker/Picker.vue'
      import selfRadioCheckbox from '@/components/self-radio-checkbox/index.vue'
      export default { // 使用mixin
      components:{ MxDatePicker, myPicker,selfRadioCheckbox,selfSearchPop, selfSearchInput,selfRyCheckbox },
             filters: {
               IdcardEncry: function(val) {
                 return val && val.substr(0, 6) + '********' + val.substr(val.length - 4, 4)
               }
             },
    		mixins: [MescrollMixin],
      	data() {
      		return {
      			// 时间间隔选择器
      			rangeTime:'',
      			showPicker:false,
      			total:'',
      			jgText:'全部机构',
      			defAvator: 'this.src="../../static/image/err.png"',
      			upOption: {
      				page: {
      					size: 10 // 每页数据的数量,默认10
      				},
      				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
      				empty: {
      					tip: '暂无相关数据'
      				}
      			},
      			// 查询条件
      			post:{
      				ryType:['全部'],
      				orgId:'',
      				nameOrIdno:'',
      				time:'',
      				startRow:'',
      				size: 10,
      				groups:'',
      				startTime:'',
      				endTime:'',
      				emigrationFlag:''
      			},
      			statusList:[
      				{value:'',name:'全部'},
      				{value:'1',name:'迁出'},
      				{value:'2',name:'活动'}
      			],
      			// 查询机构列表
      			orgList:[],
      			popShow:false,
      			searchValue:'',
      			signConfig:[
      				{className:'continuSign'},
      				{className:'overdue'}
      			],
      			ryList:[
      				{id:'全部',name:'全部'},
      				{id:'高血压',name:'高血压'},
      				{id:'糖尿病',name:'糖尿病'}
      			],
      			rylx:['高血压'],
      			list:[
      				// {
      					//idCard点击新增传 //点击卡片传id
      				// 	imgurl:'static/image/head.jpg',
      				// 	name:'布罗斯李',
      				// 	gender:'男',
      				// 	age:20,
      				// 	idCard:'',
      				//  orgId:'',
      				// 	orgName:'某某卫生室',
      				// 	ryType:['高血压','糖尿病'],
      				// 	lastSf:'2012-12-25'
      				//  糖尿病管理卡id
      				//  diabetesId:'',
      				//  高血压管理卡id
      				//  hypertensionId:'',
      				// }
      			]
      		}
      	},
      computed:{
      },
      created() {
      	// getType().then(res=>{
      	// 	console.log('人员类型',res)
      	// 	if(res.ret){
      	// 		this.ryList = res.data
      	// 		this.ryList.unshift({id:'',name:'全部'})
      	// 	}
      	// })
      	getOrgList().then(res => {
      		console.log('获取机构列表',res)
      		if(res.ret) {
      			this.orgList = res.data
      		}
      	})
      },
      onNavigationBarButtonTap(e) {
      	if (e.index === 0) {
      		this.popShow = true
      	}
      },
      onBackPress(event) {
      	if(this.popShow) {
      	    this.changePop()
      	    return true
      	}
      },
      onLoad() {
      },
      onReady() {
      	const that = this
      	uni.getStorage({
      		key: 'group',
      	    success: function (res) {
      			console.log(res.data)
      			that.$set(that.post,'groups',res.data)
      	    },
      		fail:() => {

      		}
      	})
    		},
      	methods: {
      		// 时间间隔选择器
      		onShowDatePicker(type) {
      			this.showPicker = true;console.log(1)
      		},
      		onSelected(result) {
      			this.rangeTime = result.value
      			this.showPicker = false
      	    console.log(this.rangeTime)
      			this.post.startTime = this.rangeTime[0]
      			this.post.endTime = this.rangeTime[1]
      		},
      		changePop () {
      		    if (this.popShow) {
      		        uni.showTabBar({animation:true})
      		    } else {
      		        uni.hideTabBar({animation:true})
      		    }
      			this.popShow = !this.popShow
      		},
      		idToInfor(str) {
      			return idToInfor(str).age
      		},
      		// 选择机构
      		chooseJg(e) {
      			this.post.orgId = e.value
      		this.jgText = e.label
      		},
      		// 重置
      		resert() {
      			this.post.nameOrIdno = ''
      			this.$set(this.post,'ryType',['全部'])
      			this.$set(this.post,'orgId','')
      			this.jgText = '全部机构'
      			this.$set(this.post,'startTime','')
      			this.$set(this.post,'endTime','')
      			this.$set(this.post,'groups','')
      			this.$set(this.post,'emigrationFlag','')
      		},
      		search(post) {
      			this.list = []
      		this.mescroll.resetUpScroll()
      		},
      		// 获取高糖随访列表
      		getSfList(page) {
      			let post = {}
      			// post = JSON.parse(JSON.stringify(this.post))
      			post = Object.assign({}, this.post)
      			console.log("post:" + JSON.stringify(post))
      			post.groups = post.groups.replace(new RegExp("，","gm"),",")
      			post.groups = post.groups.split(',')
      			post.startRow = this.list.length
      		console.log('查询条件',post)
      			getSfList(post).then(res => {
      				console.log('高糖随访列表获取',res)
      				if(res.ret) {
      					this.total = res.size
      			        if(page.num == 1) {
    this.list = []
  } //如果是第一页需手动置空列表
      			        this.list = this.list.concat(res.data.sfList) //追加新数据
      		        this.mescroll.endByPage(res.data.sfList.length, Math.ceil(res.size / 10))
      			} else {
      					this.mescroll.endErr()
      				}
      			},(err) => {
      				console.log('请求错误原因',err)
      				this.mescroll.endErr()
      			})
      		},
      		upCallback(page) {
      		    this.getSfList(page)
      	},
      		linkTo(ehrId,url,idCard,orgId,orgName,diabetesId,hypertensionId,name) {
      			const gourl = '/pages/home/diseaseVisit/sfRecord/sfRecord'
      			uni.navigateTo({
      				url:gourl + '?ehrId=' + ehrId + '&url=' + url + '&idCard=' + idCard + '&orgId=' + orgId + '&orgName=' + orgName + '&diabetesId=' + diabetesId + '&hypertensionId=' + hypertensionId + '&name=' + name
      			})
      		},
      		classJudge(val) {
      			return this.signConfig[val - 1].className
      		}
      	}
      }
</script>

<style lang="scss">
  /*占位导航栏样式*/
  .doctor_appoint{
  	.nav_title{
  		z-index: 20;
  		position:fixed;
  		top: 0;
  		left: 0;
  		width: 100%;
  		height: 48rpx;
  		line-height: 48rpx;
  		font-size:24rpx;
  		font-weight:500;
  		color:rgba(102,102,102,1);
  		text-align: center;
  		background:#cfe6f8;
  	}
  	.content{
  		margin-top: 40rpx;
  		padding: 20rpx;
  		.content_item{
  			background-color: #FFFFFF;
  			display: flex;
  			border-radius: 10rpx;
  			margin-bottom: 20rpx;
  			padding: 20rpx;
  			height: 240rpx;
  			overflow: hidden;
  			border-bottom: 1rpx solid rgba(238,238,238,1);
  			.item_left{
  				width: 240rpx;
  				height: 250rpx;
  				border-radius:10px;
  				overflow: hidden;
  				background-image: url('/static/image/err.png');
  				background-size:cover;
  				background-repeat:no-repeat;
  				img{
  					width:240rpx;
  					border-radius:10px;
  				}
  			}
  			.item_right{
  				margin-left: 30rpx;
  				flex-grow: 1;
  				font-size:24rpx;
  				.baseInfor{
  					position: relative;
  					line-height: 50rpx;
  					font-size:30rpx;
  					font-weight:500;
  					color:rgba(51,51,51,1);
  					.out{
  						width: 50rpx;
  						height: 50rpx;
  						border-radius: 50%;
  						text-align: center;
  						line-height: 50rpx;
  						background-color: #d7eeff;
  						color: #0091FE;
  						font-size:20rpx;
  						position: absolute;
  						right: 0;
  					}
  					.continuSign{
  						background-color: #FF9600;
  					}
  					.overdue{
  						background-color: #FF0000;
  					}
  					span{
  						margin-right: 30rpx;
  					}
  				}
  				.id_card{
  					line-height: 40rpx;
  					.iconfont{
  						color: #35A8FF;
  						margin-right: 11rpx;
  					}
  				}
  				.yl_org{
  					line-height: 40rpx;
  					.iconfont{
  						color: #24BF00;
  						margin-right: 11rpx;
  					}
  				}
  				.ry_type{
  					display: flex;
  					.ry_item{
  						margin: 10rpx 8rpx 10rpx 0;
  						text-align: center;
  						width:95rpx;
  						height:40rpx;
  						font-size: 22rpx;
  						line-height: 40rpx;
  						background-color: #d7eeff;
  						border-radius:4rpx;
  						color: #0091FE;
  					}
  					.org{
  						background-color: #ffe3cc;
  						color: #FF7200;
  					}
  				}
  				.lastSf{
  					font-size:24rpx;
  					font-weight:400;
  					color:rgba(51,51,51,1);
  					line-height:36rpx;
  				}
  			}
  		}
  	}
  	// 搜索框
  	.pop-content{
  		padding: 20rpx;
  		.search-title{
  			margin-top: 20rpx;
  			margin-bottom: 30rpx;
  			font-size:30rpx;
  			font-weight:500;
  			color:rgba(153,153,153,1);
  		}
  		.groups{
  			font-size: 28rpx;
  			background-color: #f6f6f6;
  			height: 80rpx;
  			line-height: 80rpx;
  			border-radius: 8rpx;
  			margin-top: 20rpx;
  			input{
  				margin-left: 30rpx;
  				height: 80rpx;
  				line-height: 80rpx;
  			}
  		}
  		.notice{
  			color:#999999;
  			margin-top: 15rpx;
  			font-size: 26rpx;
  		}
  		.select{
  			width:100%;
  			height:88rpx;
  			background:rgba(246,246,246,1);
  			border-radius:4rpx;
  			display: flex;
  			align-items: center;
  			box-sizing: border-box;
  			padding: 0 30rpx;
  			justify-content: space-between;
  			.orgname{
  				font-size:30rpx;
  				font-weight:400;
  				color:rgba(51,51,51,1);
  			}
  			.iconfont{
  				color: #999999;
  			}
  		}
  		.selectRange{

  		}
  	}
  }
</style>
