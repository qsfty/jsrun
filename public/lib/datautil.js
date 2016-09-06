define(function(){

	var debug = true;

	function ps(a){
		if(debug){
			console.log(a);
		}
	}

	var alphe = "abcdefghijklmnopqrstuvwxyz123456789";
	var Util = {
		//判断一个元素是否在数组中
		inArray : function(arr,i){
			arr = arr || [];
			if(arr.indexOf(i) >= 0){
				return 1;
			}
			return 0;
		},
		//判断一个key是否在对象数组中
		keyInArray : function(arr,key,value){
			arr = arr || [];
			for(var i in arr){
				var item = arr[i];
				if(item[key] == value){
					return 1;
				}
			}
			return 0;
		},
		//往一个数组中push值，如果存在则忽略
		pushItem : function(arr, item){
			arr = arr || [];
			if(!this.inArray(arr, item)){
				arr.push(item);
			}
		},
		pushAll : function(arr, data){
			arr = arr || [];
			for(var i in data){
				arr.push(data[i]);
			}
		},
		//往一个数组中push对象，如果已经存在则忽略
		pushObjectToArray : function(arr, item, key){
			arr = arr || [];
			if(!this.keyInArray(arr, key, item[key])){
				arr.push(item);
			}
		},
		//删除某个数组中的某个值，如果不存在则忽略
		removeFromArray : function(arr, item){
			if(this.inArray(arr, item)){
				var index = arr.indexOf(item);
				arr.splice(index,1);
			}
		},
		//删除某个数组中的某个值，如果不存在则忽略
		removeFromArrayByKey : function(arr, key, value){
			arr = arr || [];
			for(var i in arr){
				var item = arr[i];
				if(item[key] == value){
					this.removeArrayByIndex(arr, i);
					break;
				}
			}
		},
		//删除某个数组中的某个值，如果不存在则添加
		addOrReplaceItem : function(arr, mitem, key){
			arr = arr || [];
			var exists = false;
			for(var i in arr){
				var item = arr[i];
				if(item[key] == mitem[key]){
					arr[i] = mitem;
					exists = true;
					ps('replace one ...');
					break;
				}
			}
			if(!exists){
				ps('new one ...')
				arr.push(mitem);
			}
		},
		//根据索引删除值
		removeArrayByIndex : function(arr, index){
			arr = arr || [];
			if(arr.length > index){
				arr.splice(index, 1);
			}
		},
		getItemByKey : function(arr, key, value){
			arr = arr || [];
			for(var i in arr){
				var item = arr[i];
				if(item[key] == value){
					return item;
				}
			}
		},
		sortArray : function(arr, key, order){
			arr = arr || [];
			arr.sort(function(val1,val2){
				if(val1[key] && val2[key]){
					if(order == "asc"){
						return val1[key] > val2[key];
					}
					else{
						return val1[key] < val2[key];
					}
				}
				return 2 > 1;
			});
		},
		//排序对象key,并升序
		sortKeyAndMakeArray : function(obj){
			var keys = [];
			for(var key in obj){
				keys.push(key);
			};
			keys.sort();
			var nn = [];
			for(var i in keys){
				nn.push(obj[keys[i]]);
			}
			return nn;
		},
		//从数组中抽离一个父对象来
		pullParentFromArray : function(arr,key){
			var keys = [],
				rst = {},
				finalRst = [];
            for(var i in arr){
            	var mkey = arr[i][key];
                var old = rst[mkey];
                if(old){
                    old.push(arr[i]);
                }
                else{
                	keys.push(mkey);
                    rst[mkey] = [arr[i]];
                }
            }
            keys.sort();
            for(var i in keys){
            	finalRst.push({
            		'key' : keys[i],
            		'val' : rst[keys[i]]
            	})
            }
            return finalRst
		},
		nowTime : function(){
			var k = new Date().getTime();
			return k;
		},
		gapTime : function(t1){
			return Math.floor((this.nowTime() - t1) / 1000);
		},
		randomStr : function(len){
			len = len || 8;
			var s = "";
			for(var i=0;i<len;i++){
				s += alphe.charAt(this.randomNumber(0, alphe.length));
			}
			return s;
		},
		randomNumber : function(min,max){
			min = min || 0;
			max = max || 100;
			return min + Math.floor(Math.random() * (max-min));
		},
		autoId : function(){
			var t = new Date().getTime();
			var k = Math.floor(t / 1000) - 1464418748;
			return k;
		}
	}

	return Util;
});