/**
 * 此脚本是主要的游戏逻辑脚本，用于Screeps的游戏逻辑
 */

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var roleRepairer = require('role.repairer');
var roleTower = require('role.tower');
var roleTransferer = require('role.transferer');
require('mount')(); // 挂载所有的额外属性和方法

// 用于存放一些工具函数
var CreepTools = {
    // 清理内存
    clearMemory: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },
    // 获取指定角色的creep列表
    getRoleList: function (role) {
        return _.filter(Game.creeps, (creep) => {
            return creep.memory.role == role;
        })
    },
    // 获取剩余寿命最长的指定role的creep
    getOldestCreep: function (role) {
        var creepList = this.getRoleList(role);
        if (creepList.length > 0) {
            return creepList.sort((a, b) => {
                return b.ticksToLive - a.ticksToLive;
            })[0];
        }
        return null;
    },
    // 获取场景内工地数量
    getConstructionSitesCount: function () {
        return Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length;
    }
}

module.exports.loop = function () {
    CreepTools.clearMemory();

    var builderList = CreepTools.getRoleList('builder');
    var upgraderList = CreepTools.getRoleList('upgrader');
    var harvesterList = CreepTools.getRoleList('harvester');
    var carrierList = CreepTools.getRoleList('carrier');
    var repairerList = CreepTools.getRoleList('repairer');
    var transfererList = CreepTools.getRoleList('transferer');

    var towerList = _.filter(Game.structures, (structure) => {
        return structure.structureType == STRUCTURE_TOWER;
    });

    // 生成upgrader
    if (harvesterList.length > Memory.minHarvester && upgraderList.length < 3) {
        var newName = 'upgrader' + Game.time.toString();
        if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'upgrader'
            }
        }) == 0);
        else if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], newName, {
            memory: {
                role: 'upgrader'
            }
        }) == 0);
    }

    // 生成builder
    if (harvesterList.length > Memory.minHarvester && builderList.length < 2) {
        var newName = 'builder' + Game.time.toString();
        if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'builder'
            }
        }) == 0);
        else if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], newName, {
            memory: {
                role: 'builder'
            }
        }) == 0);
    }

    if(transfererList.length < 4 && harvesterList.length > Memory.minHarvester){
        var newName = 'transferer' + Game.time.toString();
        if(Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'transferer'
            }
        }) == 0);
        else if(Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, MOVE], newName, {
            memory: {
                role: 'transferer'
            }
        }) == 0);
    }

    // 生成carrier
    if (carrierList.length < 2 && harvesterList.length > Memory.minHarvester) {
        var newName = 'carrier' + Game.time.toString();
        if(Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'carrier'
            }
        }) == 0);
        else if(Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, MOVE], newName, {
            memory: {
                role: 'carrier'
            }
        }) == 0);
    }

    // 生成repairer
    if (harvesterList.length > Memory.minHarvester && repairerList.length < 2) {
        var newName = 'repairer' + Game.time.toString();
        if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'repairer'
            }
        }) == 0);
        else if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], newName, {
            memory: {
                role: 'repairer'
            }
        }) == 0);
    }

    // 生成harvester
    if (harvesterList.length < Memory.maxHarvester) {
        var newName = 'harvester' + Game.time.toString();
        var sourceId = harvesterList.length ? 1 - CreepTools.getOldestCreep('harvester').memory.sourceId : 0;
        if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'harvester',
                sourceId: sourceId
            }
        }) == 0);
        else if(Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName, {
            memory: {
                role: 'harvester',
                sourceId: sourceId
            }
        }) == 0);
        else if(Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: {
                role: 'harvester',
                sourceId: sourceId
            }
        }) == 0);
    }

    if (Game.spawns['Spawn1'].spawning) { // 孵化过程可视化
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y, {
                align: 'left',
                opacity: 0.8
            });
    }

    // 运行creep
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        } else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        } else if (creep.memory.role == 'transferer') {
            roleTransferer.run(creep);
        }
    }

    // 运行tower
    for (var name in towerList) {
        roleTower.run(towerList[name]);
    }
}