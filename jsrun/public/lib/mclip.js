define(['clip'], function(Clipboard){

    return {
        setClip : function(id){
            var clipboard = new Clipboard(id);
            clipboard.on('success', function(e){
                $.success("复制成功");
                e.clearSelection();
            });

            clipboard.on('error', function(e){
                $.warn("请按快捷键复制");
            });
        }
    }

});