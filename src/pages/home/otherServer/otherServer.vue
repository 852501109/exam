<template>
	<view class="toallFun">
		<view class="status_bar">
		<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar fixed="true" :isBack="true" title="全部应用" height="40rpx" background-color="rgb(53, 168, 255)" color="#FFF">
			<view slot="right">
				<view class="finsh" v-show="finshStatus" @tap="finshStatus = false">完成</view>
			</view>
		</uni-nav-bar>
		<!-- 启用的功能模块 -->
		<view class="content">
			<!-- <button @click="delAll">删除</button> -->
			<view class="isUes card">
				<view class="card-nav">
					<view class="col"></view>
					<view class="card-title">展示在首页的应用</view>
				</view>
				<view class="card-content">
					<!-- 首页展示 -->
					<view class="flex-item" v-for="(item,index) in isUse" :key="index" @tap="handleRemove(item)" >
						<view class="iconBox" :style="{backgroundColor:item.bac}">
							<i class="icon" :class="item.icon"></i>
							<i class="iconfont icon-tianjia" v-show="finshStatus"></i>
						</view>
						<p v-text="item.text"></p>
					</view>
					<view class="flex-item" @tap="finshStatus = true">
						<view class="add">+</view>
						<p>添加</p>
					</view>
				</view>
			</view>
			<!-- 家医签约 -->
			<view class="isUes card" v-show="jyqyModel.length>0">
				<view class="card-nav">
					<view class="col"></view>
					<view class="card-title">家医签约</view>
				</view>
				<view class="card-content">
					<view class="flex-item" v-for="(item,index) in jyqyModel" :key="index" @tap="handleAdd(item)" >
						<view class="iconBox" :style="{backgroundColor:item.bac}">
							<i class="icon" :class="item.icon"></i>
							<i class="iconfont icon-add-fill" v-show="finshStatus"></i>
						</view>
						<p v-text="item.text"></p>
					</view>
				</view>				
			</view>
			<!-- 慢病管理 -->
			<view class="isUes card" v-show="mbglModel.length>0">
				<view class="card-nav">
					<view class="col"></view>
					<view class="card-title">慢病管理</view>
				</view>
				<view class="card-content">
					<view class="flex-item" v-for="(item,index) in mbglModel" :key="index" @tap="handleAdd(item)" >
						<view class="iconBox" :style="{backgroundColor:item.bac}">
							<i class="icon" :class="item.icon"></i>
							<i class="iconfont icon-add-fill" v-show="finshStatus"></i>
						</view>
						<p v-text="item.text"></p>
					</view>				
				</view>			
			</view>
			<!-- 体检服务 -->
			<view class="isUes card" v-show="tjfwModel.length>0">
				<view class="card-nav">
					<view class="col"></view>
					<view class="card-title">体检服务</view>
				</view>
				<view class="card-content">
					<view class="flex-item" v-for="(item,index) in tjfwModel" :key="index" @tap="handleAdd(item)" >
						<view class="iconBox" :style="{backgroundColor:item.bac}">
							<i class="icon" :class="item.icon"></i>
							<i class="iconfont icon-add-fill" v-show="finshStatus"></i>
						</view>
						<p v-text="item.text"></p>
					</view>			
				</view>			
			</view>
			<!-- 慢病筛查（暂未开放） -->
			<view class="isUes card" v-show="mbscModel.length>0">
				<view class="card-nav">
					<view class="col"></view>
					<view class="card-title"> 慢病筛查（暂未开放） </view>
				</view>
				<view class="card-content">
					<view class="flex-item" v-for="(item,index) in mbscModel" :key="index" @tap="handleAdd(item)" >
						<view class="iconBox" :style="{backgroundColor:item.bac}">
							<i class="icon" :class="item.icon"></i>
							<i class="iconfont icon-add-fill" v-show="finshStatus"></i>
						</view>
						<p v-text="item.text"></p>
					</view>		
				</view>			
			</view>
			<!-- 健康评估（暂未开放） -->
			<view class="isUes card" v-show="jkpgModel.length>0">
				<view class="card-nav">
					<view class="col"></view>
					<view class="card-title"> 健康评估（暂未开放）  </view>
				</view>
				<view class="card-content">
					<view class="flex-item" v-for="(item,index) in jkpgModel" :key="index" @tap="handleAdd(item)" >
						<view class="iconBox" :style="{backgroundColor:item.bac}">
							<i class="icon" :class="item.icon"></i>
							<i class="iconfont icon-add-fill" v-show="finshStatus"></i>
						</view>
						<p v-text="item.text"></p>
					</view>			
				</view>			
			</view>
		</view>
	</view>
</template>

<script>
	import { isOpenComDB,selectSQL,executeSQL } from '../../../sqlite/sqlite.js'
	export default {
		data() {
			return {
				/**
				 * id：唯一标识
				 * used：启用在首页展示
				 * */
				finshStatus:false,
				appList:[
					{id:10,used:1,icon:'iconfont icon-qianyue', bac:'#35A8FF', url:'./doctorSign/doctorSign', text:'家医签约'},
					{id:11,used:1,icon:'iconfont icon-xingxing', bac:'#14DB6D', url:'./doctorAppoint/doctorAppoint', text:'家医履约'},
					{id:20,used:1,icon:'iconfont icon-iconxt', bac:'#FFCC2F', url:'./diseaseVisit/diseaseVisit', text:'高糖管理'},
					{id:21,used:0,icon:'iconfont icon-shenjingneike', bac:'#8691FF', url:'./jsbVisit/jsbVisit', text:'精神病管理'},
					{id:30,used:0,icon:'iconfont icon-tijianliucheng', bac:'#35DFA1', url:'./healthyCheck/healthyCheck', text:'健康体检'},
					{id:40,used:0,icon:'iconfont icon-fei', bac:'#6ED8FF', url:'', text:'慢阻肺'},
					{id:41,used:0,icon:'iconfont icon-gaoweirenyuan', bac:'#FF7200',url:'', text:'高危人群'},
					{id:50,used:0,icon:'iconfont icon-zhongyi', bac:'#35DFA1', url:'',text:'中医体质评估'},
					{id:51,used:0,icon:'iconfont icon-xinzang', bac:'#35A8FF', url:'',text:'心血管评估'},
					{id:52,used:0,icon:'iconfont icon-lishi', bac:'#FF9600', url:'',text:'评估记录'}
				],
				isUse:[
					{id:10,used:1,icon:'iconfont icon-qianyue', bac:'#35A8FF', url:'./doctorSign/doctorSign', text:'家医签约'},
					{id:11,used:1,icon:'iconfont icon-xingxing', bac:'#14DB6D', url:'./doctorAppoint/doctorAppoint', text:'家医履约'},
					{id:20,used:1,icon:'iconfont icon-iconxt', bac:'#FFCC2F', url:'./diseaseVisit/diseaseVisit', text:'高糖管理'},
					{id:30,used:0,icon:'iconfont icon-tijianliucheng', bac:'#35DFA1', url:'./healthyCheck/healthyCheck', text:'健康体检'}
					
				],
				//家医签约可启用模块
				jyqyModel:[
				],
				// 慢病管理可启用模块
				mbglModel:[
					{id:21,used:1,icon:'iconfont icon-shenjingneike', bac:'#8691FF', url:'/use', text:'精神病管理'}
				],
				// 体检服务可启用模块
				tjfwModel:[
				
				],
				// 慢病筛查可启用模块
				mbscModel:[
					{id:40,used:0,icon:'iconfont icon-fei', bac:'#6ED8FF', url:'', text:'慢阻肺'},
					{id:41,used:0,icon:'iconfont icon-gaoweirenyuan', bac:'#FF7200',url:'', text:'高危人群'}
				],
				// 健康评估可启用模块
				jkpgModel:[
					{id:50,used:0,icon:'iconfont icon-zhongyi', bac:'#35DFA1', url:'',text:'中医体质评估'},
					{id:51,used:0,icon:'iconfont icon-xinzang', bac:'#35A8FF', url:'',text:'心血管评估'},
					{id:52,used:0,icon:'iconfont icon-lishi', bac:'#FF9600', url:'',text:'评估记录'}
				]
			};
		},
		methods:{
			// 点击移除
			handleRemove(item){
				if(this.isUse.length<4){
					uni.showToast({
						title:'首页展示不能少于3个',
						icon:'none'
					})
				} else {
					var sqlUpdat = "update isUse set used = " + "0"
					sqlUpdat += " where id = " +  item.id
					executeSQL('mbsf', sqlUpdat, res => {
						this.initTable()
					})
				}
			},
			// 点击增加功能
			handleAdd(item){
				if(this.finshStatus){
					console.log(item)
					// var sqlSelect = "SELECT * FROM isUse WHERE id='" 
					// sqlSelect += item.id + "'"
					var sqlUpdat = "update isUse set used = " + "1"
					sqlUpdat += " where id = " +  item.id
					executeSQL('mbsf', sqlUpdat, res => {
						this.initTable()
					})
				}	
			},
			// 手机第一次同步数据库与本地json
			initDB(){
				// 插入展示在首页应用			
				for (var i = 0; i < this.appList.length; i++) {
					var sqlInsert = "insert into isUse values('";
					sqlInsert += this.appList[i].id + "','";
					sqlInsert += this.appList[i].used + "','";
					sqlInsert += this.appList[i].icon + "','";  
					sqlInsert += this.appList[i].bac + "','";  
					sqlInsert += this.appList[i].url + "','";
					sqlInsert += this.appList[i].text + "'";
					sqlInsert += ')'; 
					executeSQL('mbsf', sqlInsert, res => {
						selectSQL('mbsf', 'select * from isUse', res => {
							console.log("*查询结果",JSON.stringify(res));
						}) 
					})
				}
			},
			// 得到表内数据进行分组
			initTable(res){
				selectSQL('mbsf', 'select * from isUse', res => {
					const isUse = [];
					const jyqyModel = [];
					const mbglModel = [];
					const tjfwModel = [];
					const mbscModel = [];
					const jkpgModel = [];
					for (var i = 0; i < res.length; i++) {
						if(res[i].used == 1){
							isUse.push(res[i])
						}
						if(res[i].used == 0 && 10<=res[i].id && res[i].id<20 ){
							jyqyModel.push(res[i])
						}
						if(res[i].used == 0 && 20<=res[i].id && res[i].id<30 ){
							mbglModel.push(res[i])
						}
						if(res[i].used == 0 && 30<=res[i].id && res[i].id<40 ){
							tjfwModel.push(res[i])
						}
						if(res[i].used == 0 && 40<=res[i].id && res[i].id<50 ){
							mbscModel.push(res[i])
						}
						if(res[i].used == 0 && 50<=res[i].id && res[i].id<60 ){
							jkpgModel.push(res[i])
						}	
					}
					this.isUse = isUse
					this.jyqyModel = jyqyModel
					this.mbglModel = mbglModel
					this.tjfwModel = tjfwModel
					this.mbscModel = mbscModel
					this.jkpgModel = jkpgModel	
				}) 
			},
			// 查询表数据
			search(){
				selectSQL('mbsf', 'select * from isUse', res => {
					console.log("建筑物查询结果",JSON.stringify(res));
				}) 
			},
			// 删除表内所有信息
			delAll(){
				console.log('删除所有表')
				var sqlInsert = 'DELETE FROM isUse'
				executeSQL('mbsf', sqlInsert, res => {
					console.log(res)
				})
			}
		},
		onReady: function() {
			
		},
		onShow: function() {
			//判断数据库是否打开
			const isOpen = isOpenComDB('mbsf', '_doc/nfcList.db')
			if (isOpen){
				// 打开表验证里面有没有数据
				var sqlTable = 'create table if not exists isUse("id" INT(10) NOT NULL UNIQUE,"used" CHAR,"icon" CHAR,"bac" CHAR,"url" CHAR,"text" CHAR)'
				selectSQL('mbsf', sqlTable, res => {
					//console.log(JSON.stringify(res))
					// 查询isuse表有没有数据
					selectSQL('mbsf', 'select * from isUse', res => {
						if (res.length>0){
							console.log("isUes表数据",JSON.stringify(res));
							this.initTable()
						} else {
							console.log("初始化表isUes")
							this.initDB()
						}		
					}) 
				})  
			}
		},
	}
</script>

<style lang="scss">
	page{
		background-color: #FFFFFF;
		/*占位导航栏样式*/
		.status_bar {
		      height: var(--status-bar-height);
		      width: 100%;
			  background-color: rgb(53, 168, 255);
		 }
		.toallFun{
			.finsh{
				width: 120upx;
				color: #FFFFFF;
				background-color: #35A8FF;
				text-align: center;
				line-height: 60upx;
				border-radius: 10upx;
			}
			.content{
				padding: 30upx;
				.card{
					.card-nav{
						display: flex;
						.col{
							width:6upx;
							height:30upx;
							border-radius: 3upx;
							margin-right: 14upx;
							background:linear-gradient(169deg,rgba(53,168,255,1) 0%,rgba(110,216,255,1) 100%);
						}
						.card-title{
							font-size:30upx;
							line-height: 30upx;
							font-weight:bold;
							color:rgba(51,51,51,1);				
						}
					}
					.card-content{
						min-height: 212upx;
						margin-top: 10upx;
						padding: 0px 0px;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						.iconBox{
							width: 50px;
							height: 50px;
							margin: 0 14upx;
							background-color: #fff;
							border-radius: 20px;
							margin-bottom: 7px;
							vertical-align: middle;
							position: relative;
							.icon{
								position: relative;
								left: 50%;
								top: 20%;
								margin-left: -30upx;
								margin-top: 20upx;
								font-size: 30px;
								color: rgba(255,255,255,1);
							}
						}
						p{
							font-size: 11px;
							color: #333333;
							font-weight:500;
							text-align: center;
						}
						.flex-item{
							width: 70px;
							height: 90px;
							margin: 8px 6px;					
							.icon-tianjia{
								position: absolute;
								color: #C0C0C0;
								top: -20upx;
								right: -20upx;
								font-size: 40upx;
							}
							.icon-add-fill{
								font-size: 40upx;
								position: absolute;
								color: #C0C0C0;
								top: -20upx;
								right: -20upx;
							}
							.add{
								margin-left: 14upx;
								margin-bottom: 14upx;
								width: 100upx;
								height: 100upx;
								border-radius: 50%;
								text-align: center;
								line-height: 100upx;
								font-size: 60upx;
								background-color:#C0C0C0;
								color: #FFFFFF;
							}
						}
					}	
				}
			}
			
		}
	}
</style>
