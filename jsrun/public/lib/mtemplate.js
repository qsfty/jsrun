define(['template'], function(template) {

    template.helper('dateFormat', function(val, pattern) {
        if (val == null || val == '') {
            return '-'
        }
        if (val.indexOf('0000-00-00') == 0) {
            return '-';
        }
        pattern = pattern || 'datetime';
        switch (pattern) {
            case 'datetime':
                return val;
            case 'date':
                return val.slice(0, 10);
            case 'spectial':
                return showTime(val);
            default:
                return val;
        }
    });




    template.helper('mvalue', function(item) {
        if (/^\d+$/.test(item.value)) {
            return item.value;
        }
        return '"' + item.value + '"';
    });

    template.helper('comma', function(items, index, tag) {
        tag = tag || ",";
        return items.length - 1 > index ? tag : '';
    });

    function htmlEscape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function htmlUnEscape(str) {
        return String(str)
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    function compress(str) {
        return String(str)
            .replace(/\s\s*/g, ' ')
            .replace(/ \"/g, '"')
            .replace(/\" /g, '"')
    }

    template.config('openTag', '[[');
    template.config('closeTag', ']]');

    return {
        render: function(id, data) {
            return template(id, data);
        },
        renderAndAssign: function(id, data, container) {
            console.log(data);
            container.html(template(id, data));
        },
        htmlEscape: function(source) {
            return htmlEscape(source);
        },
        removeBlankLine: function(source) {
            return source.replace(/\n\s*\n/g, '\n');
        },
        removeWhitespace: function(source) {
            var a = source.split('\n');
            for (var i = a.length - 1; i >= 0; i--) {
                var b = a[i].trim();
                if (b == "") {
                    a.splice(i, 1);
                } else {
                    a[i] = b;
                }
            }
            return a.join('\n');
        },
        makeNewLine: function(source, tag, rep) {
            var regexp = new RegExp(tag, "gm");
            rep = rep || (tag + "\n");
            return source.replace(regexp, rep);
        },
        compile: function(source, data) {
            return template.compile(source)(data);
        },
        htmlUnEscape: function(source) {
            return htmlUnEscape(source);
        }
    }




});
