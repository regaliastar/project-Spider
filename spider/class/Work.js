'use strict';

class Work{
    constructor(workName,tags,pageView,praise,pixiver,small_address,big_address){
        this.workName = workName;   //作品名
        this.tags = tags;           //TAG
        this.pageView = pageView;   //浏览量
        this.praise = praise;       //点赞数
        this.pixiver = pixiver;     //作者
        this.small_address = small_address; //小图地址
        this.big_address = big_address;     //大图地址
    }
}

Work.prototype.print = function(){
    console.log(this.workName,this.tags.join(','),this.pageView,this.praise,
                this.pixiver,this.small_address,this.big_address);
}

/**
 *box_address：数组变量，用于存放每一张漫画的地址
 */
class MutilWork extends Work {
    constructor(workName,tags,pageView,praise,pixiver,small_address,big_address,box_address) {
        super(workName,tags,pageView,praise,pixiver,small_address,big_address);
        this.box_address = box_address;
    }
}

MutilWork.prototype.print = function(){
    console.log(this.workName,this.tags.join(','),this.pageView,this.praise,
                this.pixiver,this.small_address,this.big_address,this.box_address.join(','));
}

exports.Work = Work;
exports.MutilWork = MutilWork;
