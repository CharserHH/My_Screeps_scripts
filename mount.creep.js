/**
 * 此脚本用于挂载creep的方法
 */
// 将拓展签入 Creep 原型
module.exports = function () {
    _.assign(Creep.prototype, creepExtension)
}

// 自定义的 Creep 的拓展
const creepExtension = {
    // 检测自身是否健康 若不健康则返回false
    isHealthy: function () {
        return this.ticksToLive > 100
    },
    // 检测自身不健康后向Spawn1请求孵化 孵化对象和自身角色相同
    sendRespawn: function () {
        if (!this.isHealthy()) {
            Game.spawns['Spawn1'].spawnCreep(this.body, this.memory.role + Game.time, {
                memory: {
                    role: this.memory.role
                }
            })
            return true
        }
        return false
    },
    // 获取距离自身最近的需要补充能量的建筑 优先级为extension > spawn > tower
    getNearestEnergyNeeder: function () {
        var anotherTarget = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })
        if (anotherTarget) {
            return anotherTarget
        }
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_TOWER) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > s.store.getCapacity(RESOURCE_ENERGY) * 0.4
        })
        
    },
    // 获取距离自身最近的需要repair的建筑
    getNearestRepairStructure: function () {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.hits < (2 * s.hitsMax / 3) && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
        })
    },
    // 获取room中血量最低的墙 且血量低于50000
    getLowestWall: function () {
        return this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.hits < 50000 && s.structureType == STRUCTURE_WALL
        }).sort((a, b) => a.hits - b.hits)[0]
    },
    // 获取room中血量最低的rampart 且血量低于20000
    getLowestRampart: function () {
        return this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.hits < 20000 && s.structureType == STRUCTURE_RAMPART
        }).sort((a, b) => a.hits - b.hits)[0]
    },
    // 获取距离自身最近的有能量的container Upgrader Reapirer Builder使用
    getContainersByEnergy: function () {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER) &&
                s.store[RESOURCE_ENERGY] > 0
        })
    },
    // 获取距离自身最近的有空余的container或storage Harvesters使用
    getNearestContainer: function () {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })
    },
    // 获取距离自身最近的有能量的container 或 storage
    getNearestEnergyContainer: function () {
        var storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > this.store.getFreeCapacity(RESOURCE_ENERGY)
        })
        if (storage) {
            return storage
        }
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER &&
                s.store[RESOURCE_ENERGY] > 0
        })
    },
    // 获取距离自身最近的工地
    getNearestConstructionSite: function () {
        return this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
    },
    // 获取距离自身最近的能量资源
    getNearestDroppedResource: function () {
        return this.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
    },
    // 获取地图中有空余的storage
    getFreeStorage: function () {
        return this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_STORAGE &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })[0]
    },

}