/**
 * 此脚本用于定义 tower 角色的行为
 */
var roleTower = {
    run: function (tower) {
        // 获取范围内的敌人
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * 0.5) {
            // 获取受损的建筑
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (structure.hits < structure.hitsMax * 0.5 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
}

module.exports = roleTower;