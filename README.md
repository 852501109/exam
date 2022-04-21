## 项目介绍

	体检采集项目pad端
	在pc体检采集阮软件的基础上增加了pad端，方便医生操作

## 技术架构
	uniapp+vue3+vite+pinia

## 快速上手
	1 uniApp目录下运行：npm install
	2 发行-原声App云打包，配置包名，勾选正式包
	3 运行到手机端-运行基座选择-自定义基座
	4 链接手机-文件传输-运行到手机端

## 开发流程

	代码上传到公司gitee，使用统一的git管理工具sourceTree

## 项目结构

 ├── .husky  // githook
│   ├── _
│   │   └── husky.sh
│   └── pre-commit
├── env 本地环境和开发环境配置
│   ├── .env.development
│   ├── .env.production
│   └── index.d.ts
├── mock mock配置，目前项目没有用到
│   └── index.ts
├── src	 主目录
│   ├── api
│   │   └── path.js
│   ├── assets 公共文件资源
│   │   └── scss
│   ├── common	集成其他vue2项目的文件夹
│   │   ├── baidu-idcard.js
│   │   ├── config.js
│   │   ├── idText.js
│   │   ├── imgUpload.js
│   │   ├── install.js
│   │   ├── permission.js
│   │   ├── request.js
│   │   ├── tool.js
│   │   └── upData.js
│   ├── components 公共组件
│   │   ├── childFourTest.vue
│   │   ├── childTest.vue
│   │   ├── childThreeTest.vue
│   │   └── childTwoTest.vue
│   ├── custom
│   │   └── components 自定义公共组件
│   ├── hook // hook文件
│   │   ├── bluetooth.js
│   │   ├── globalHool.js
│   │   └── usePoint.js
│   ├── nativeplugins	原生插件，调用蓝牙插件
│   │   ├── KunYuBluetooth
│   │   ├── PP-BaiduFaceV2
│   │   └── PP-BaiduOCR
│   ├── pages  页面级组件
│   │   ├── home vue2.0蓝牙插件页面
│   │   ├── tabber
│   │   └── test
│   ├── static  静态资源位置
│   │   └── logo.png
│   ├── store  pinia数据管理
│   │   ├── modules
│   │   └── index.js
│   ├── utils	公共方法
│   │   ├── bluetools 蓝牙配置文件
│   │   ├── request
│   ├── App.vue 
│   ├── env.d.ts
│   ├── main.ts
│   ├── manifest.json
│   ├── pages.json
│   └── shims-vue.d.ts
├── .eslintcache
├── .eslintignore
├── .eslintrc-auto-import.json
├── .eslintrc.js
├── .prettier.js
├── .prettierignore
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── prettier.config.js
├── stylelint.config.js
└── vite.config.ts