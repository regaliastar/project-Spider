'use strict';

/**
 * @author regaliastar
 *
 * @param {string} workName      作品名
 * @param {string[]} tags          TAG
 * @param {string} pageView      浏览量
 * @param {string} praise        点赞数
 * @param {string} pixiver       作者
 * @param {string} small_address 小图地址
 * @param {string} big_address   大图地址
 */
class Work{
    constructor(workName,tags,pageView,praise,pixiver,small_address,big_address){
        this.workName = workName;
        this.tags = tags;
        this.pageView = pageView;
        this.praise = praise;
        this.pixiver = pixiver;
        this.small_address = small_address;
        this.big_address = big_address;
    }
}

Work.prototype.print = function(){
    console.log(JSON.stringify(this));
}

/**
 * @param {string[]} box_address：数组变量，用于存放每一张漫画的地址
 * @see Work
 */
class MutilWork extends Work {
    constructor(workName,tags,pageView,praise,pixiver,small_address,big_address,box_address) {
        /**
         * @see Work 继承属性
         */
        super(workName,tags,pageView,praise,pixiver,small_address,big_address);

        /**
         * @param box_address   专门存放每张漫画的地址
         */
        this.box_address = box_address;
    }
}

MutilWork.prototype.print = function(){
    console.log(JSON.stringify(this));
}

exports.Work = Work;
exports.MutilWork = MutilWork;
