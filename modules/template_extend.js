module.exports = function(template){



    template.helper('string', function(obj){
        if(obj == null){
            return "";
        }
        return JSON.stringify(obj);
    });

}