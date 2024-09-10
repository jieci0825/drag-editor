const randomNums = []

/**
 * 生成置顶长度的随机数字字符串
 */
export function randomNum(len = 4) {
	function deep() {
		let num = ''
		for (let i = 0; i < len; i++) {
			num += Math.floor(Math.random() * 10)
		}
		if (randomNums.includes(num)) {
			return deep()
		}
		return num
	}
	return deep()
}
