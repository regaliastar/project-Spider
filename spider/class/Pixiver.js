'use strict';

/**
 * @author regaliastar
 *
 * @param {string}  id          id
 * @param {string}  bookmarket  作品数
 * @param {string}  follow      粉丝数
 * @param {string}  comment     评论数
 */
class Pixiver{
    constructor(id,bookmarket,follow,comment){
        this.id =id;
        this.bookmarket =bookmarket;
        this.follow =follow;
        this.comment =comment;
    }

    print(){
        console.log(JSON.stringify(this));
    }
}

module.exports = Pixiver;
