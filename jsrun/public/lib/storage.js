define(function() {
    var storage = {
        check: function() {
            return window.localStorage;
        },
        set: function(key, value) {
            localStorage.setItem(key, value);
        },
        get: function(key) {
            return localStorage.getItem(key);
        },
        remove: function(key) {
            localStorage.removeItem(key);
        },
        clear: function() {
            return localStorage.clear();
        },
        setJson: function(key, jsonValue,exp) {
            if(exp){
                exp = new Date().getTime() + 1000 * 3600 * 24 * exp;
                storage.set(key+"_exp", exp);
            }
            var jsonStringValue = JSON.stringify(jsonValue);
            storage.set(key, jsonStringValue);
        },
        getJson: function(key) {
            var exp = storage.get(key+"_exp");
            if(exp){
                console.log(exp);
                var now = new Date().getTime();
                if(exp < now){
                    return null;
                }
                else{
                    return JSON.parse(storage.get(key));
                }
            }
            return JSON.parse(storage.get(key));
        }
    };

    return storage;
});
