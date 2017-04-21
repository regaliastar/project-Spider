/**
 * 管理者，与其他类是强耦合关系
 * 用于实现具体的功能
 */
class Manager{
    constructor(config){
        this.config = Object.assign(Manager.defaultConfig(),config);
    }
}

Manager.defaultConfig = function(){
    return{
        'async': 5
    }
}

Manager.createPixiverTasks = function(){
    var HTMLParser =require('./HTMLParser');
}
