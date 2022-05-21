const PPOCR = uni.requireNativePlugin('PP-BaiduOCR');

const startProcess = (success, failure) => {
	PPOCR.IDFront({"auto": false },result => {
		if(parseInt(result.code) === 200) {  
			success(result)
		}  else {
			failure(result)
		}
	 })
}

export default startProcess
