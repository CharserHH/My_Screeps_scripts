/**
 * 此角色用于采矿
 */
var roleMiner = {
    run: function(creep) {
        // 状态机 只负责状态转换 不负责具体操作
        switch(creep.memory.state) {// mining, transfer, break
            case 'mining':
                if(getObjectById(creep.memory.sourceId).amount == 0) {
                    creep.memory.state = '💤 break';
                } else if(creep.store.getFreeCapacity() == 0) {
                    creep.memory.state = '🚚 transfer';
                }
                break;
            case 'transfer':
                if(creep.store.getUsedCapacity() == 0) {
                    creep.memory.state = 'mining';
                    creep.say('⛏️ mining');
                }
                break;
            case 'break':
                if(getObjectById(creep.memory.sourceId).amount > 0) {
                    creep.memory.state = 'mining';
                    creep.say('💤 break');
                }
                break;
        }
        // 执行操作
        switch(creep.memory.state) {
            case 'mining':
                var source = getObjectById(creep.memory.sourceId);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source,{
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                break;
            case 'transfer':
                var container = getObjectById(creep.memory.containerId);
                if(creep.transfer(container, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container,{
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
                break;
            case 'break':
                break;
        }
    }
}