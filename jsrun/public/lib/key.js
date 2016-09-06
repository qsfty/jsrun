define(function() {
    var KeyNames = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    var KeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]


    function getKeyCode(m) {
        var i = KeyNames.indexOf(m.toLowerCase().trim());
        if (i == -1) {
            return 0;
        }
        return KeyCodes[i];
    }
    return {
        bindKey: function(allkey, cb, preventDefault) {
            var segment = allkey.split(",");

            var ctrl = false,
                shift = false,
                alt = false,
                command = false;
            var maps = [];
            for (var i in segment) {
                var key = segment[i];
                var keys = key.split("+");

                if (keys[0] == "ctrl") {
                    ctrl = true;
                } else if (keys[0] == "shift") {
                    shift = true;
                } else if (keys[0] == "alt") {
                    alt = true;
                } else if (keys[0] == "command" || keys[0] == '⌘') {
                    command = true
                }
                var keyCode = keys.length == 1 ? getKeyCode(keys[0]) : getKeyCode(keys[1]);
                maps.push({
                    "ctrl": ctrl,
                    "shift": shift,
                    "alt": alt,
                    "command": command,
                    "keyCode": keyCode
                })
            }

            var isHappened = false;
            $("body").keydown(function(event) {
                for (var i in maps) {
                    var item = maps[i];
                    if (event.keyCode == item.keyCode && (item.ctrl && event.ctrlKey || item.shift && event.shiftKey || item.alt && event.altKey || item.command && event.metaKey)) {
                        mcb(event);
                    }
                }
            });

            function mcb(event) {
                if (preventDefault) {
                    event.preventDefault();
                }
                if (!isHappened) {
                    isHappened = true;
                    cb && cb(event);
                }
                else{
                	isHappened = false;
                }
            }
        },
        longClick : function(ele){
            var dt = 0;
            $(ele).on('mousedown',function(){
                dt = new Date().getTime();
            }).on('mouseup',function(){
                var nw = new Date().getTime();
                console.log(nw - nt);
            });
        }
    }
});
