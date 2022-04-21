// import 'vue' // 必须要引入vue,否则就成了覆盖
import { InjectionKey } from 'vue'
import { Store } from 'pinia'

/**
 * 这里为什么用vue，而不用@vue/runtime-core，是因为使用pnpm安装依赖是，node_modules中没有@vue/runtime-core，
 * 会导致找不到模块而类型声明失败。
 */

// 扩展mock
declare module 'mockjs' {
  /** 所有已注册的mock规则  */
  const _mocked: Record<string, any>
}

// 这个导出一个东西也可以，或者上面引入vue
export {}
