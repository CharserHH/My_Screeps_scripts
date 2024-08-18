/*
 * 此脚本负责升级creep的控制
 */
var roleUpgrader = {// 细化升级者的行为
    run: function(creep){
        var container = creep.getNearestEnergyContainer();
        var target = creep.room.controller;
        // 状态机 只负责状态的切换 不负责具体的行为
        switch(creep.memory.state){// state包括 'harvest' 'upgrade' 'withdraw' 'break' 四种状态
            case 'harvest':
                if(creep.store.getFreeCapacity() == 0){
                    creep.memory.state = 'upgrade';
                    creep.say('⚡ upgrade');
                }
                break;
            case 'upgrade':
                if(!target){
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                }else if(creep.store[RESOURCE_ENERGY] == 0){
                    if(container){
                        creep.memory.state = 'withdraw';
                        creep.say('⚡ withdraw');
                    } else {
                        creep.memory.state = 'harvest';
                        creep.say('🔄 harvest');
                    }
                }
                break;
            case 'withdraw':
                if(creep.store.getFreeCapacity() == 0){
                    creep.memory.state = 'upgrade';
                    creep.say('⚡ upgrade');
                } else if(!container){
                    creep.memory.state = 'harvest';
                    creep.say('🔄 harvest');
                }
                break;
            case 'break':
                if(target){
                    creep.memory.state = 'upgrade';
                    creep.say('⚡ upgrade');
                }
                break;
            default:
                creep.memory.state = 'upgrade';
                break;
        }
        // 根据状态执行相应的行为
        switch(creep.memory.state){
            case 'harvest':
                var source = Game.getObjectById(Memory.energyId);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                break;
            case 'upgrade':
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    
                }
                break;
            case 'withdraw':
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                    
                }
                break;
            case 'break':
                // 若身上有多余的能量 则将其转移到container中
                if(creep.store[RESOURCE_ENERGY] > 0){
                    var freeContainer = creep.getNearestContainer();
                    if(freeContainer){
                        if(creep.transfer(freeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(freeContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
                break;
            default:
                break;
        }
    }
}

module.exports = roleUpgrader;