/**
 * 此角色用于维修建筑
 */

var roleRepairer = {
    run: function (creep) {
        if (creep.memory.scanWallticker > 100) {
            creep.memory.scanWallticker = 0;
            var target = creep.getLowestWall();
            if (target) {
                creep.memory.targetWallId = target.id;
            } else {
                creep.memory.targetWallId = null;
            }
        } else {
            creep.memory.scanWallticker++;
        }
        var targetRam = creep.getLowestRampart();
        var targetSim = creep.getNearestRepairStructure();
        var container = creep.getNearestEnergyContainer();
        // 状态机
        switch (creep.memory.state) { // state包括 'repair_sim' 'repair_ram' 'repair_wall' 'withdraw' 'harvest' 'break'
            case 'repair_sim':
                if (targetRam) {
                    creep.memory.state = 'repair_ram';
                    creep.say('🔧 ram');
                } else if (!targetSim) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    if (container) {
                        creep.memory.state = 'withdraw';
                        creep.say('⚡ withdraw');
                    } else {
                        creep.memory.state = 'harvest';
                        creep.say('🔄 harvest');
                    }
                }
                break;
            case 'repair_ram':
                if (!targetRam) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    if (container) {
                        creep.memory.state = 'withdraw';
                        creep.say('⚡ withdraw');
                    } else {
                        creep.memory.state = 'harvest';
                        creep.say('🔄 harvest');
                    }
                }
                break;
            case 'repair_wall':
                if (targetRam) {
                    creep.memory.state = 'repair_ram';
                    creep.say('🔧 ram');
                } else if (targetSim) {
                    creep.memory.state = 'repair_sim';
                    creep.say('🔧 sim');
                } else if (!creep.memory.targetWallId) {
                    creep.memory.state = 'break';
                    creep.say('😴 break');
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    if (container) {
                        creep.memory.state = 'withdraw';
                        creep.say('⚡ withdraw');
                    } else {
                        creep.memory.state = 'harvest';
                        creep.say('🔄 harvest');
                    }
                }
                break;
            case 'withdraw':
                if (!container) {
                    creep.memory.state = 'hatvest';
                    creep.say('🔄 harvest');
                } else if (creep.store.getFreeCapacity() == 0) {
                    if (targetRam) {
                        creep.memory.state = 'repair_ram';
                        creep.say('🔧 ram');
                    } else if (targetSim) {
                        creep.memory.state = 'repair_sim';
                        creep.say('🔧 sim');
                    } else if (creep.memory.targetWallId) {
                        creep.memory.state = 'repair_wall';
                        creep.say('🔧 wall');
                    } else {
                        creep.memory.state = 'break';
                        creep.say('😴 break');
                    }
                }
                break;
            case 'harvest':
                if (creep.store.getFreeCapacity() == 0) {
                    if (targetRam) {
                        creep.memory.state = 'repair_ram';
                        creep.say('🔧 ram');
                    } else if (targetSim) {
                        creep.memory.state = 'repair_sim';
                        creep.say('🔧 sim');
                    } else if (creep.memory.targetWallId) {
                        creep.memory.state = 'repair_wall';
                        creep.say('🔧 wall');
                    } else {
                        creep.memory.state = 'break';
                        creep.say('😴 break');
                    }
                }
                break;
            case 'break':
                if (targetRam) {
                    creep.memory.state = 'repair_ram';
                    creep.say('🔧 ram');
                } else if (targetSim) {
                    creep.memory.state = 'repair_sim';
                    creep.say('🔧 sim');
                } else if (creep.memory.targetWallId) {
                    creep.memory.state = 'repair_wall';
                    creep.say('🔧 wall');
                }
                break;
            default:
                creep.memory.state = 'break';
                creep.memory.scanWallticker = 0;
                creep.memory.targetWallId = null;
                break;
        }
        // 根据状态执行操作
        switch (creep.memory.state) {
            case 'repair_sim':
                if (creep.repair(targetSim) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSim, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
                break;
            case 'repair_ram':
                if (creep.repair(targetRam) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetRam, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
                break;
            case 'repair_wall':
                var targetWall = Game.getObjectById(creep.memory.targetWallId);
                if (creep.repair(targetWall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetWall, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
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
            case 'harvest':
                var source = Game.getObjectById(Memory.energyId);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                break;
            case 'break':
                if (creep.store[RESOURCE_ENERGY] > 0) {
                    var freeContainer = creep.getNearestContainer();
                    if(freeContainer){
                        if (creep.transfer(freeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(freeContainer, {
                                visualizePathStyle: {
                                    stroke: '#ffffff'
                                }
                            });
                        }
                    }
                }
                break;
        }
    }
}

module.exports = roleRepairer;