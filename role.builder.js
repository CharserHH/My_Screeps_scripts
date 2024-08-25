/*
 * 此角色负责建造工地上的建筑
 */
var roleBuilder = {// 重构后的roleBuilder 细化了状态机
    run: function(creep) {
        var target = creep.getNearestConstructionSite();// 获取最近的工地
        var container = creep.getNearestEnergyContainer();// 获取最近的有能量的Container
        // 状态机
        switch (creep.memory.state) {// state包括 harvest build withdraw break
            case 'harvest':
                if (!target) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                }else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.state = 'build';
                    creep.say('🚧 build');
                }
                break;
            case 'withdraw':
                if (!target) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                }else if(!container){
                    creep.memory.state = 'harvest';
                    creep.say('🔄 harvest');
                }else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.state = 'build';
                    creep.say('🚧 build');
                }
                break;
            case 'build':
                if (!target) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    if(container){
                        creep.memory.state = 'withdraw';
                        creep.say('⚡ withdraw');
                    } else {
                        creep.memory.state = 'harvest';
                        creep.say('🔄 harvest');
                    }
                }
                break;
            case 'break':
                if (target) {
                    creep.memory.state = 'build';
                    creep.say('🚧 build');
                }
                break;
            default:
                creep.memory.state = 'break';
                break;
        }
        // 根据状态执行操作
        switch (creep.memory.state) {
            case 'harvest':
                var source = Game.getObjectById(Memory.energyId);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                break;
            case 'withdraw':
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                break;
            case 'build':
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
                break;
            case 'break':
                // 休息时去修墙
                var targetRam = creep.getLowestRampart();
                if (creep.repair(targetRam) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetRam, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
                // // 若身上还有能量 则存入最近的空余Container
                // if (creep.store[RESOURCE_ENERGY] > 0) {
                //     var freeContainer = creep.getNearestContainer();
                //     if (creep.transfer(freeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(freeContainer, {
                //             visualizePathStyle: {
                //                 stroke: '#ffffff'
                //             }
                //         });
                //     }
                // }
                break;
        }
    }
}

module.exports = roleBuilder;