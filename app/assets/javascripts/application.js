// ------------------------------------------------- Requirments ---------------------------------------------

//= require jquery
//= require jquery_ujs
//= require jquery.ui.all
//= require turbolinks
//= require ulogin
//= require ang-devise/angular/angular.min.js
//= require angular-route.min
//= require angular-resource.min
//= require angular-sanitize.min
//= require angular-animate.min
//= require angular/angular_setup
//= require ckeditor-jquery
//= require blockui
//= require ang-devise/angular-devise/lib/devise
//= require ang-paginate/dirPagination.js
//= require ang-dialog/ngDialog.min
// = require_tree .

// -------------------------------------------------- System -------------------------------------------------

window.$a = {}; //custom app helper


$(document).ready(function(){
    tooltipInit();
    //applyCss();
});

function tooltipInit(){
    $(function () {
//        $(document).tooltip({
//            content: function () {
//                return '<div class="jq_tooltip">'+$(this).prop('title')+'</div>';
//            },
//            position: { my: "center top-65", at: "center top" },
//            show: { effect: "fade", duration: 0 },
//            hide: { effect: "fade", duration: 0 }
//        });
    });
}

function cl(text){
    console.log(text);
}

function rand(min,max)
{
    if(max == null){
        max = min;
        min = 0;
    } else if (min == null && max == null) return 0;
    return Math.floor(Math.random()*(max-min+1)+min);
}

function uLoginOauth(token){
    angular.element('[x-ng-controller="MainController"]').scope().uLogin(token);
}

//------------------------------------------------ CSS -----------------------------------------------------

function applyCss(){
    var cat_link = angular.element('.cat_link');
    cat_link.mouseover(function(){
        console.log('mouseover');
        var el = angular.element(this);
        if(el.hasClass('play_unhover')) el.removeClass('play_unhover');
        el.addClass('play_hover');
        setTimeout(function(){
            if(el.hasClass('play_hover')) el.removeClass('play_hover');
        },1000);
    });
    cat_link.mouseout(function(){
        console.log('mouseout');
        var el = angular.element(this);
        if(el.hasClass('play_hover')) el.removeClass('play_hover');
        el.addClass('play_unhover');
        setTimeout(function(){
            if(el.hasClass('play_unhover')) el.removeClass('play_unhover');
        },1000);
    });
}

//------------------------------------------------ Prototypes ----------------------------------------------
Array.prototype.sample = function(){
    rand = function(min,max)
    {
        if(max == null){
            max = min;
            min = 0;
        } else if (min == null && max == null) return 0;
        return Math.floor(Math.random()*(max-min+1)+min);
    };
    return this[rand(0,this.length-1)];
};

Array.prototype.each = function(callback){
    if(typeof callback != 'function') return;
    for(var i=0; i < this.length; i++){
        callback(this[i], i);
    }
};

Array.prototype.countWhere = function(name,val){
    var total = 0;
    this.each(function(el){
        total += el[name] == val ? 1 : 0;
    });
    return total;
};

Array.prototype.where = function(name,val){
    var res = 0;
    this.each(function(el){
        if(el[name] == val) {
            res = el;
        }
    });
    return res;
};

Array.prototype.whereId = function(id, getIndex){
    var target = null;
    if(Object.prototype.toString.call(id) === '[object Array]'){
        target = [];
        for(var i=0; i < id.length; i++){
            for(var j=0; j < this.length; j++){
                if(this[j].id == id[i]){
                    target.push(this[j]);
                }
            }
        }
    } else {
        for(var n=0; n < this.length; n++){
            if(this[n].id == id){
                target = getIndex ? n : this[n];
                break;
            }
        }
    }
    return target;
};

//Object.prototype.each = function(callback){
//    if(typeof Array.prototype.each != 'function'){
//        console.log('please define Array.prototype.each');
//    } else {
//        var self = this;
//        if(typeof callback == 'function'){
//            var keys = Object.keys(self);
//            keys.each(function(key){
//                callback(self[key]);
//            });
//        }
//    }
//};

Number.prototype.toPhrase=function(c)
// сумма прописью для чисел от 0 до 999 триллионов
// можно передать параметр "валюта": RUB,USD,EUR (по умолчанию RUB)
{
    var x=this.roundTo(2);
    if (x<0 || x>999999999999999.99) return false;
    var currency='RUB';
    if (typeof(c)=='string')
        currency=c.trimAll().toUpperCase();
    if (currency=='RUR') currency='RUB';
    if (currency!='RUB' && currency!='USD' && currency!='EUR')
        return false;
    var groups=new Array();
    groups[0]=new Array();
    groups[1]=new Array();
    groups[2]=new Array();
    groups[3]=new Array();
    groups[4]=new Array();
    groups[9]=new Array();
// рубли
// по умолчанию
    groups[0][-1]={'RUB': 'рублей', 'USD': 'долларов США', 'EUR': 'евро'};
//исключения
    groups[0][1]={'RUB': 'рубль', 'USD': 'доллар США', 'EUR': 'евро'};
    groups[0][2]={'RUB': 'рубля', 'USD': 'доллара США', 'EUR': 'евро'};
    groups[0][3]={'RUB': 'рубля', 'USD': 'доллара США', 'EUR': 'евро'};
    groups[0][4]={'RUB': 'рубля', 'USD': 'доллара США', 'EUR': 'евро'};
// тысячи
// по умолчанию
    groups[1][-1]='тысяч';
//исключения
    groups[1][1]='тысяча';
    groups[1][2]='тысячи';
    groups[1][3]='тысячи';
    groups[1][4]='тысячи';
// миллионы
// по умолчанию
    groups[2][-1]='миллионов';
//исключения
    groups[2][1]='миллион';
    groups[2][2]='миллиона';
    groups[2][3]='миллиона';
    groups[2][4]='миллиона';
// миллиарды
// по умолчанию
    groups[3][-1]='миллиардов';
//исключения
    groups[3][1]='миллиард';
    groups[3][2]='миллиарда';
    groups[3][3]='миллиарда';
    groups[3][4]='миллиарда';
// триллионы
// по умолчанию
    groups[4][-1]='триллионов';
//исключения
    groups[4][1]='триллион';
    groups[4][2]='триллиона';
    groups[4][3]='триллиона';
    groups[4][4]='триллиона';
// копейки
// по умолчанию
    groups[9][-1]={'RUB': 'копеек', 'USD': 'центов', 'EUR': 'центов'};
//исключения
    groups[9][1]={'RUB': 'копейка', 'USD': 'цент', 'EUR': 'цент'};
    groups[9][2]={'RUB': 'копейки', 'USD': 'цента', 'EUR': 'цента'};
    groups[9][3]={'RUB': 'копейки', 'USD': 'цента', 'EUR': 'цента'};
    groups[9][4]={'RUB': 'копейки', 'USD': 'цента', 'EUR': 'цента'};
// цифры и числа
// либо просто строка, либо 4 строки в хэше
    var names=new Array();
    names[1]={0: 'один', 1: 'одна', 2: 'один', 3: 'один', 4: 'один'};
    names[2]={0: 'два', 1: 'две', 2: 'два', 3: 'два', 4: 'два'};
    names[3]='три';
    names[4]='четыре';
    names[5]='пять';
    names[6]='шесть';
    names[7]='семь';
    names[8]='восемь';
    names[9]='девять';
    names[10]='десять';
    names[11]='одиннадцать';
    names[12]='двенадцать';
    names[13]='тринадцать';
    names[14]='четырнадцать';
    names[15]='пятнадцать';
    names[16]='шестнадцать';
    names[17]='семнадцать';
    names[18]='восемнадцать';
    names[19]='девятнадцать';
    names[20]='двадцать';
    names[30]='тридцать';
    names[40]='сорок';
    names[50]='пятьдесят';
    names[60]='шестьдесят';
    names[70]='семьдесят';
    names[80]='восемьдесят';
    names[90]='девяносто';
    names[100]='сто';
    names[200]='двести';
    names[300]='триста';
    names[400]='четыреста';
    names[500]='пятьсот';
    names[600]='шестьсот';
    names[700]='семьсот';
    names[800]='восемьсот';
    names[900]='девятьсот';
    var r='';
    var i,j;
    var y=Math.floor(x);
// если НЕ ноль рублей
    if (y>0)
    {
        // выделим тройки с руб., тыс., миллионами, миллиардами и триллионами
        var t=new Array();
        for (i=0;i<=4;i++)
        {
            t[i]=y%1000;
            y=Math.floor(y/1000);
        }
        var d=new Array();
        // выделим в каждой тройке сотни, десятки и единицы
        for (i=0;i<=4;i++)
        {
            d[i]=new Array();
            d[i][0]=t[i]%10; // единицы
            d[i][10]=t[i]%100-d[i][0]; // десятки
            d[i][100]=t[i]-d[i][10]-d[i][0]; // сотни
            d[i][11]=t[i]%100; // две правых цифры в виде числа
        }
        for (i=4; i>=0; i--)
        {
            if (t[i]>0)
            {
                if (names[d[i][100]])
                    r+=' '+ ((typeof(names[d[i][100]])=='object')?(names[d[i][100]][i]):(names[d[i][100]]));

                if (names[d[i][11]])
                    r+=' '+ ((typeof(names[d[i][11]])=='object')?(names[d[i][11]][i]):(names[d[i][11]]));
                else
                {
                    if (names[d[i][10]]) r+=' '+ ((typeof(names[d[i][10]])=='object')?(names[d[i][10]][i]):(names[d[i][10]]));
                    if (names[d[i][0]]) r+=' '+ ((typeof(names[d[i][0]])=='object')?(names[d[i][0]][i]):(names[d[i][0]]));
                }

                if (names[d[i][11]])  // если существует числительное
                    j=d[i][11];
                else
                    j=d[i][0];

                if (groups[i][j])
                {
                    if (i==0)
                        r+=' '+groups[i][j][currency];
                    else
                        r+=' '+groups[i][j];
                }
                else
                {
                    if (i==0)
                        r+=' '+groups[i][-1][currency];
                    else
                        r+=' '+groups[i][-1];
                }
            }
        }
        if (t[0]==0)
            r+=' '+groups[0][-1][currency];
    }
    else
        r='Ноль '+groups[0][-1][currency];
    y=((x-Math.floor(x))*100).roundTo();
    if (y<10) y='0'+y;
    r=r.trimMiddle();
    r=r.substr(0,1).toUpperCase()+r.substr(1);
    r+=' '+y;
    y=y*1;
    if (names[y])  // если существует числительное
        j=y;
    else
        j=y%10;
    if (groups[9][j])
        r+=' '+groups[9][j][currency];
    else
        r+=' '+groups[9][-1][currency];
    return r;
};

//----------------------------------------------------Alerts------------------------------------------------
$a.alert = function(text, title, delay){
    delay = delay || 100;
    setTimeout(function(){
        var alertElement = $('<div><p class="dialog_msg">'+text+'</p><div>');
        var onClose = function(){alertElement.dialog('destroy').remove();};
        alertElement.dialog({ modal: true, position: 'top',
            buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ], title: title,
            beforeClose: onClose});
    },delay);
};

$a.infoDurationMs = 450;
$a.infoDurationHideRelation = 1.5;
$a.infoBeforeCloseMs = 1200;

$a.info = function(text, isError){
    setTimeout(function(){
        var cls = isError ? 'dialogError' : '';
        var durationMs = 300;
        var beforeCloseMs = 1500;
        var element = $('<div class="'+cls+'"><p class="dialog_msg">'+text+'</p><div>');
        element.dialog({ dialogClass: 'autoClose', modal: false, position: 'left top', width: 275,
            minHeight: 20, resizable: false,
            show: { effect: "drop", easing: 'easeOutCubic',duration: $a.infoDurationMs},
            hide: {effect: "drop", easing: 'easeInSine', duration: $a.infoDurationMs * $a.infoDurationHideRelation},
            beforeClose: function(){
                setTimeout(function(){  element.dialog("destroy");  },
                        $a.infoBeforeCloseMs + $a.infoDurationMs * $a.infoDurationHideRelation);
            }
        });
        setTimeout(function(){  element.dialog('close');  },beforeCloseMs+durationMs*2);
    },200);
};

$a.err = function(text){
    if(!text) text = 'Неизвестная ошибка';
    $a.info(text, true);
};

$a.show_errors = function(errs){
    var list = '<ul>';
    errs.each(function(e){
        list+='<li>'+e+'</li>'
    });
    list+='</ul>';
    $a.alert(list,'Ошибка');
};

$a.confirm = function(text, callback, opt){
    callback = callback || function(){};
    var dialogElement = $('<div><p class="dialog_msg">'+text+'</p><div>');
    var destrFunc = function(){dialogElement.dialog('destroy').remove()};
    var destroyAfterClose = function(){
        callback();
        setTimeout(destrFunc,500);
    };
    var defOpt = { modal: true, position: 'top', title: 'Поддтвердите действие',
        buttons: [
            { text: "Да",  click: function() { $( this ).dialog( "close" );
                destroyAfterClose();} },
            { text: "Нет", click: function() { $( this ).dialog( "close" ); destrFunc(); } }
        ]};
    var finalOpt = $a.merge(defOpt,opt);
    dialogElement.dialog(finalOpt);

};

// --------------------------------------------------localStorage-----------------------------------------
$a.custom_localstorage_prefix = '__c';

$a.cut = function(item){
    item = item+$a.custom_localstorage_prefix;
    var itemData = localStorage.getItem(item);
    if(typeof itemData != 'undefined' && itemData != null) {
        localStorage.removeItem(item);
        return  JSON.parse(itemData).obj;
    }
    return null;
};


$a.set = function(item, data){
    if(!item || !data) {console.log('$a.set - not all params to set'); return null;}
    var obj = {obj: data};
    localStorage.setItem(item+$a.custom_localstorage_prefix, JSON.stringify(obj));
};

// --------------------------------------------------Spiner-----------------------------------------
$a.wait = function(msg, msBeforeException){
    msBeforeException = msBeforeException || 15000;
    if(!this.blocked){
        this.blocked = true;
    } else {
        clearTimeout(this.exception);
    }
    this.exception = setTimeout(function(){
        $a.done();
        $a.alert('<b>Пожалуйста, попробуйте еще раз.</b><br/>В случае повтора ошибки обновите страницу, а так же проверьте подключение к интернету.','Неизвестная ошибка');
    },msBeforeException);

    msg = msg || 'Загрузка...';
    $.blockUI({
        message: msg,
        css: {
            border: '2px solid #bdf',
            padding: '15px',
            backgroundColor: '#846',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            'border-radius': '10px',
            opacity: .8,
            'font-size': 20,
            color: 'deepskyblue',
            'font-weight': 'bold'
        }
    });

};

$a.done = function(){
    this.blocked = false;
    clearTimeout(this.exception);
    $.unblockUI();
};

//---------------------------------------------- blank | any -----------------------------------------

$a.blank = function(obj){
    if(typeof(obj) == "undefined") return true;
    if(typeof(obj) == "object" && obj === null) return true;
    if(typeof(obj) == "string" && obj === '') return true;
    if(Object.prototype.toString.call(obj) === '[object Array]' && obj.length == 0) return true;
    return false; // not blank
};

$a.any = function(obj){
    return !$a.blank(obj);
};

//------------------------------------------------ Numbers | String ---------------------------------------------

$a.toFloat = function(val){
    val = String(val)|| '';
    var formatedPrice = val.replace(/,/g,'.').replace(/[^0-9,.]/g, '');
    var matches = formatedPrice.match(/\d+/g);
    matches = matches || [];
    return Number(String(matches[0] || '0') + '.' + String(matches[1] || '00').substring(0, 2));
};

$a.toInt = function(val){
    val = String(val)|| '';
    return Number(val.replace(/\D/g, ''));
};

//------------------------------------------------ Objects ---------------------------------------------

//$a.getMapData = function(sid, callback){
//    $.get('http://api-maps.yandex.ru/services/constructor/1.0/js/?sid='+(sid||'r7iJfgIosKiHK6_cCFl3MaHw3CtuPew2')
//        ,function(res){
//            var r = JSON.parse(res.match(/\{\"response.+\}\}\}/)).response.map;
//            if(typeof callback == 'function') callback(r);
//            else cl(['Callback is undefined... parsed response is: ',r]);
//        });
//};

$a.merge = function(a,b){
    var aKeys = Object.keys(a||{});
    var bKeys = Object.keys(b||{});
    var resObj = {};
    aKeys.each(function(ak){
        var exist = false;
        bKeys.each(function(bk){
            if(ak == bk) exist = true;
        });
        resObj[ak] = exist ? b[ak] : a[ak];
    });
    bKeys.each(function(bk){
        var exist = false;
        aKeys.each(function(ak){
            if(bk == ak) exist = true;
        });
        if(!exist) resObj[bk] = b[bk];
    });
    return resObj;
};