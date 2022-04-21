<template>
	<view class="serv_detail">
		<view class="serve_pack_detail">
			<view class="left_menu">
				<view class="item" v-for="(item, index) in menuConfig" :key="index" :class="index == cur ? 'cur' : ''" @tap="changeCur(index)">{{ item.text }}</view>
			</view>
			<view class="right_menu">
				<view class="right_content">
					<uni-collapse >
					    <uni-collapse-item class="fa_item" v-for="(ite, inde) in menuConfig[cur].children" :key="inde" :title="ite.text">
					       <view class="son_item" v-for="(it,ind) in ite.children" :key="ind" :title="ite" >
								<p class="content_item">{{ind+1}}.{{it}}</p>
					        </view>
					    </uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getServePack } from '@/request/jyqy.js'
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
export default {
	methods:{
		changeCur(index){
			this.cur = index
		}
	},
	created() {
		// 获取详情 
		getServePack().then((res)=>{
			console.log('服务包详情',res)
			if(res.ret){
				this.menuConfig = res.data;
			}
		},(err)=>{
			console.log('服务包详情获取失败:',err)
		})
	},
	data() {
		return {
			menuConfig: [
				{
					text: '',
					children: [
						{ text: '', children: [] }
					]
				}
				
			],
			cur: 0
		};
	}
};
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.serv_detail{
		height: 100%;
		.serve_pack_detail{
			display: flex;
			height: 100%;
			.left_menu{
				width: 38%;
				height: 100%;
				background-color: rgba(237, 237, 237, 1);
				.item{
					font-size: 28upx;
					position: relative;
					padding: 22upx;
					text-align: center;
				}
				.cur{
					background-color: #FFFFFF;
					color: rgba(0, 0, 0, 1);
					font-weight:bold;
				}
				.cur:before{
					content: '';
					width:6upx;
					height:28upx;
					margin-top: -18upx;
					background-color: rgba(53, 168, 255, 1);
					position: absolute;
					left: 0;
					top: 50%;
				}
			}
			.right_menu{
				width: 62%;
				padding: 20upx;
				.guide{
					color: rgba(153, 153, 153, 1);
					margin-bottom: 20upx;
				}
				.content_item{
					padding: 20upx;
					font-size:24upx;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
			}
		}
	}
</style>
