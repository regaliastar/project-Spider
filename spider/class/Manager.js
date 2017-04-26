/**
 * 管理者，与其他类是强耦合关系
 * 用于实现具体的功能，通过设置爬虫的生命周期来执行具体的任务
 */
class Manager{
    constructor(config){
        this.config = Object.assign(Manager.defaultConfig(),config);
    }
}

Manager.defaultConfig = function(){
    return{
        'async': 5,                 //并发量
        'tasksNumber': 1000         //任务数量
    }
}

Manager.createPixiverTasks = function(){
    var HTMLParser =require('./HTMLParser');

}
