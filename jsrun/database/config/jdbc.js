module.exports = {
    prop : {
        local : {
            host : "127.0.0.1",
            user : "root",
            password : "123456",
            database : "jsrun",
            dateStrings : "DATETIME"
        },
        portal : {
            host : "sqld.duapp.com",
            port : 4050,
            user : "a2b0b6b656114636bd6fb53668b8767b",
            password : "3a4b116fe8ef4d018db57d43110c763d",
            database : "gmcyOmlNgVatvdSaXiEv",
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