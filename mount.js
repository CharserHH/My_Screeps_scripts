/**
 * 此脚本用于挂载扩展函数
 */
const mountCreep = require('mount.creep')

// 挂载所有的额外属性和方法
module.exports = function () {
    console.log('[mount] 重新挂载拓展')

    mountCreep()
    // 其他拓展...
}