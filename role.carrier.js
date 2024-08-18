/**
 * 此角色负责将能量从Container中转移到Spawn Extension或Tower中
 */
var roleCarrier = { // 有Storage版本的Carrier
    run: function (creep) {
        var target = creep.getNearestEnergyNeeder(); // 获取最近的需要能量的建筑
        var storage = creep.getFreeStorage(); // 获取最近的有能量的Container
        // 状态机只用于改变状态 不进行具体操作
        switch (creep.memory.state) { // state包括 withdraw transfer break
            case 'withdraw':
                if (!target || !storage) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.state = 'transfer';
                    creep.say('🚚 transfer');
                }
                break;
            case 'transfer':
                if (!target) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.state = 'withdraw';
                    creep.say('⚡ withdraw');
                }
                break;
            case 'break':
                if (target) {
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
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                break;
            case 'transfer':
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
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

module.exports = roleCarrier;