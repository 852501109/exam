import { reactive, onMounted, onBeforeUnmount } from 'vue'

export default function () {
  //展示的数据  可以通过App.vue 界面去隐藏
  const point = reactive({
    x: 10,
    y: 20,
  })

  //获取鼠标点击事件
  function savePonint(event) {
    point.x = event.pageX
    point.y = event.pageY
    console.log(event.pageX, event.pageY)
  }

  //现实之后调用 挂载完毕
  onMounted(() => {
    // window.addEventListener('click', savePonint)
  })

  //在隐藏之前调用 卸载之前
  onBeforeUnmount(() => {
    // window.removeEventListener('click', savePonint)
  })

  return point
}
