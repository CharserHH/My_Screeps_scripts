/**
 * 此角色负责将能量从Container中转移到Storage中
 */
var roleTransferer = {
    run: function (creep) {
        var container = creep.getContainersByEnergy();// 获取最近的有能量的Container
        var storage = creep.getFreeStorage(); // 获取Storage
        // 状态机只用于改变状态 不进行具体操作
        switch (creep.memory.state) { // state包括 withdraw transfer break
            case 'withdraw':
                if (!container) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.state = 'transfer';
                    creep.say('🚚 transfer');
                }
                break;
            case 'transfer':
                if (!storage) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.state = 'withdraw';
                    creep.say('⚡ withdraw');
                }
                break;
            case 'break':
                if (storage) {
                    creep.memory.state = 'transfer';
                    creep.say('🚚 transfer');
                }
                break;
            default:
                creep.memory.state = 'transfer';
                break;
        }
        // 根据状态执行操作
        switch (creep.memory.state) {
            case 'withdraw':
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                break;
            case 'transfer':
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
                break;
            case 'break':
                // 若身上还有能量 则存入最近的空余Container
                if (creep.store[RESOURCE_ENERGY] > 0) {
                    var freeContainer = creep.getNearestContainer();
                    if (creep.transfer(freeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(freeContainer, {
                            visualizePathStyle: {
                                stroke: '#ffffff'
                            }
                        });
                    }
                }
                break;
        }
    }
}

module.exports = roleTransferer;