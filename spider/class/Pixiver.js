'use strict';

/**
 * @author regaliastar
 *
 * @param {string}  id          id
 * @param {string}  avator      头像
 * @param {string}  bookmarket  作品数
 * @param {string}  follow      粉丝数
 * @param {string}  comment     评论数
 */
class Pixiver{
    constructor(id,avator,bookmarket,follow,comment){
        this.id =id;
        this.avator =avator;
        this.bookmarket =bookmarket;
        this.follow =follow;
        this.comment =comment;
    }

    print(){
        console.log(JSON.stringify(this));
    }
}

module.exports = Pixiver;
