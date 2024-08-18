/**
 * 此文件定义了一个名为 roleHarvester 的对象，该对象包含一个名为 run 的方法。
 */

var roleHarvester = {
    run: function (creep) {
        // 状态机
        var container = creep.getNearestContainer();
        if (creep.memory.isHarvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.isHarvesting = false;
            creep.say('🚧 transfer');
        } else if (!creep.memory.isHarvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.isHarvesting = true;
            creep.say('🔄 harvest');
        }
        if (creep.memory.isHarvesting) {
            var source = Game.getObjectById(Memory.energyIdList[creep.memory.sourceId]);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        } else {
            // 如果有最近的Container 则向其转移能量
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        }
        // if(!creep.memory.hasSendRespawn){
        //     hasSendRespawn = creep.sendRespawn();
        // }
    }
};

var newRoleHarvester = {// 细化状态机
    run: function(creep){
        // 状态机
        switch(creep.memory.state){// state包括 harvest transfer break
            
        }
    }
}

module.exports = roleHarvester;