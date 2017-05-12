module.exports ={
    appName: 'project-Spider',

    /**
     * 端口号
     */
    port: 3000,

    /**
     * cookie加密随机字符串
     */
    cookieSecret: 'ngdlg265oepwblgbdgsabhyjhiure8861fgd1g56fd1',

    /**
     * session
     */
    sessionSecret:'rbrubgsuldnjblaf4894161safafhbuj',
    sessionMaxAge:1000*60*60*24*3,  //表示72小时的时间

    /**
     * 当前开发环境
     */
    ENV:'production',

    mongodb: 'mongodb://localhost/project-Spider'

}
