module.exports = {
    prop : {
        local : {
            host : "127.0.0.1",
            user : "root",
            password : "123456",
            database : "jsrun",
            dateStrings : "DATETIME"
        }
    },
    debug : true,
    develop : "local",
    uuid_len : 8,
    connection : function(){
        return (this.prop)[this.develop];
    }
}