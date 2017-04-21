/**
 * 管理者，与其他类是强耦合关系
 */
class Manager{
    constructor(config){
        this.config = Object.assign(Manager.defaultConfig(),config);
    }
}

Manager.defaultConfig = function(){

}

Manager.createPixiverTasks = function(){

}
