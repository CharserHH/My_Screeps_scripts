/**
 * 此脚本用于定义 tower 角色的行为
 */
var roleTower = {
    run: function (tower) {
        // 获取范围内血量最低的敌人
        var closestHostile = tower.pos.findInRange(FIND_HOSTILE_CREEPS).sort((a, b) => a.hits - b.hits)[0];
        if (closestHostile) {
            tower.attack(closestHostile);
        } else if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * 0.5) {
            // 获取受损的建筑
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax * 0.02) ||
                    (structure.hits < structure.hitsMax * 0.5 && structure.structureType != STRUCTURE_WALL)
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
}

module.exports = roleTower;