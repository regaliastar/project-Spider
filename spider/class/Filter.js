'use strict';

/**
 * @author regaliastar
 *
 * 过滤类，用于对作品进行过滤操作
 */
class Filter{
    constructor(config){
         /**
          * 每次过滤后得到的累计的作品集合
          *
          */
         this.passWorks =[];
         /**
          * 传入过滤配置，将其合并给默认配置
          */
         this.config = Object.assign(Filter.defaultConfig(),config);
         //console.log('this.config: '+JSON.stringify(this.config));
    }

    /**
     * 打印信息，用于调试
     */
     print(){
        console.log('passWorks: '+JSON.stringify(this.passWorks));
     }
}

/**
 * 对作品进行过滤
 * 先利用TAG过滤，再利用赞的数量、点赞率、浏览数过滤
 * @param {Work[]} worksList - 要过滤的作品数组
 * @return {Work[]} - 过滤后的结果
 */
Filter.prototype.filter = function(worksList){
    if(Object.prototype.toString.call(worksList) !== '[object Array]'){
        var p =[];
        p.push(worksList);
        var result =Filter.filterInfo(Filter.filterTag(p,this.config) ,this.config);
        return result;
    }
    var resultSet =Filter.filterInfo(Filter.filterTag(worksList,this.config) ,this.config);
    //this.passWorks.push(...resultSet);
    return resultSet;
}

/**
 * 对用户进行过滤
 * 根据作品数，订阅数，评论数(bookmarket,follow,comment)进行过滤
 * @param {Pixiver[]} pixiverList
 * @return {Pixiver[]}
 */
 Filter.prototype.filterPixiver = function(pixiverList){
     if(Object.prototype.toString.call(pixiverList) !== '[object Array]'){
         var p =[];
         p.push(pixiverList);
         var result =Filter.filterPixiverInfo(p,this.config);
         return result;
     }
     var resultSet =Filter.filterPixiverInfo(pixiverList,this.config);
     //this.passWorks.push(...resultSet);
     return resultSet;
 }

Filter.filterPixiverInfo =function(pixiverList,{bookmarket=0,follow=0,comment=0}){
    return pixiverList.filter(function(pixiver){
        return pixiver.bookmarket >= bookmarket
        && pixiver.follow >= follow
        && pixiver.comment >= comment;
    });
};

/**
 * 返回Filter的默认配置参数
 * @see Filter.filterInfo
 * @see Filter.filterTag
 */
Filter.defaultConfig =function(){
    return{
        "praise"     :0,//赞的数量
        "praise_pro" :0,//点赞率
        "pageView"      :0,//浏览数
        "has_tag_every" :[],
        "has_tag_some"  :[],
        "no_tag_any"    :[],
        "no_tag_every"  :[],
        "bookmarket"    :0,
        "follow"        :0,
        "comment"       :0
    };
};

/**
 * 根据标签作品信息过滤作品
 * @param {Works[]} worksList
 * @param {number} praise      - 作品不小于的赞的数量
 * @param {number} praise_pro  - 作品不小于的点赞率，小于0的数字
 * @param {number} pageView       - 作品不小于的浏览数
 * @return {Works[]}
 */
Filter.filterInfo =function(worksList ,{praise=0,praise_pro=0,pageView=0}){
    return worksList.filter(function(works){
        return works.praise >= praise
        && works.pageView >= pageView
        && (works.praise/works.pageView) >= praise_pro;
    });
};

/**
 * 根据标签过滤作品
 * @param {Works[]} worksList
 * @param {string[]} no_tag_any    - 作品中不能含有里面的任意一个标签
 * @param {string[]} no_tag_every  - 作品中不能同时含有里面的所有标签
 * @param {string[]} has_tag_some  - 作品中必须含有有里面的任意一个标签
 * @param {string[]} has_tag_every - 作品中必须同时含有里面的所有标签
 * @return {Works[]}
 */
Filter.filterTag =function(worksList ,{has_tag_every,has_tag_some,no_tag_any,no_tag_every}){
    var passWorks = worksList;
    if(has_tag_every && has_tag_every.length !==0){
        passWorks =passWorks.filter(function(works){
            return has_tag_every.every(item => works.tags.indexOf(item)!==-1);
        });
    };

    if(has_tag_some && has_tag_some.length !==0){
        passWorks =passWorks.filter(function(works){
            return has_tag_some.some(item => works.tags.indexOf(item)!==-1);
        });
    };

    if(no_tag_any && no_tag_any.length !==0){
        passWorks =passWorks.filter(function(works){
            return !no_tag_any.some(item => works.tags.indexOf(item)!==-1);
        });
    };

    if(no_tag_every && no_tag_every.length !==0){
        passWorks =passWorks.filter(function(works){
            return !no_tag_every.every(item => works.tags.indexOf(item)!==-1);
        });
    };

    return passWorks;
};

module.exports = Filter;
