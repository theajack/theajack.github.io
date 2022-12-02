(function(){
var height=60;
function MyDate(opt){
    if(typeof $==='undefined'){
        console.error('该插件依赖于jQuery,请先引入jQuery')
        return null
    }
    this.ele=_id(opt.ele);
    this.date=new _date();
    this.defMax=this.date.toString();
    this.defMin='1970-01-01';
    this.maxDate=new _date(this.defMax);
    this.minDate=new _date(this.defMin);
    this.applys=opt.applys;
    this.defaultIndex=-1;
    this.bind=null;
    this.bindIndex=-1;
    this.infoTimer=null;
    this.init();
    if(opt.mounted){
        opt.mounted.call(this);
    }
};MyDate.prototype.init=function(){
    var _this=this;
    this.ele.html("<div class='mydate-line'><div></div><div></div><div></div></div>");
    var $w=$('<div>').addClass('mydate-w-w');
    this.$year=$('<div>').addClass('mydate-s-w').scroll(function(){
        _renderDay.call(_this);
        _onscroll.call(_this,this,'y')
    })
    this.$month=$('<div>').addClass('mydate-s-w').scroll(function(){
        _renderDay.call(_this);
        _onscroll.call(_this,this,'m')
    })
    this.$day=$('<div>').addClass('mydate-s-w').scroll(function(){
        _onscroll.call(_this,this,'d')
    })
    $w.append(this.$year,this.$month,this.$day)
    this.$info=$('<div>').addClass('mydate-info');
    this.ele.append($w,this.$info);
    this.onchange=function(attr,v){
        _this.date[attr]=v;
        var apply=_this.applys[_this.bindIndex];
        if(_this.date.bigThen(_this.maxDate)){
            _this.set(_this.maxDate.toString())
            _this.info('不能大于最大限制日期：'+_this.maxDate.toString())
        }else if(_this.date.smallThen(_this.minDate)){
            _this.set(_this.minDate.toString())
            _this.info('不能小于最小限制日期：'+_this.minDate.toString())
        }
        var s=_this.date.toString();
        _this.bind.val(s)
        .value=s;
        if(apply&&apply.onchange){
            apply.onchange(s);
        }
        if(_this.bind[0].inter==null){
            _this.bind[0].inter=setInterval(function(){
                if(_this.bind[0].top!=_this.bind[0].scrollTop){
                    _this.bind[0].top=_this.bind[0].scrollTop;
                }else{
                    if(apply&&apply.onstop){
                        apply.onstop(_this.date.toString());
                    }
                    clearInterval(_this.bind[0].inter);
                    _this.bind[0].inter=null;
                }
            },1000)
        }
    }
    var _index=-1;
    this.applys.forEach(function(apply,index){
        var ele=_id(apply.ele).attr('readonly','true');
        if(apply.value){
            ele.val(apply.value);
        }
        if(apply.default===true){
            _this.defaultIndex=index;
        }
        if(!apply.min)apply.min=_this.defMin;
        if(!apply.max)apply.max=_this.defMax;
        ele.click(function(){
            _this.ele.show();
            _this.render(this,index);
        })
        if(apply.default==true){
            _index=index;
            ele[0].click();
            ele[0].focus();
        }
    });
    if(_index!=-1){
        var ele=_id(this.applys[_index].ele)[0];
        ele.click();
        ele.focus();
    }else{
        _this.ele.hide();
    }
};MyDate.prototype.render=function(ele,index){
    var apply=this.applys[index];
    if(!apply)
        return
    this.$info.removeClass('active');
    this.bind=$(ele);
    this.bindIndex=index;
    this.minDate.set(apply.min);
    this.maxDate.set(apply.max);
    this.date.set(apply.value);
    if(ele.value==''){
        ele.value=this.date.toString();
    }
    _renderYears.call(this);
    _renderMonth.call(this);
    _renderDay.call(this);
};MyDate.prototype.set=function(s){
    this.date.set(s);
    _renderYears.call(this);
    _renderMonth.call(this);
    _renderDay.call(this);
};MyDate.prototype.info=function(s){
    if(this.infoTimer==null){
        var _this=this;
        _this.$info.text(s).addClass('active');
        this.infoTimer=setTimeout(function(){
            _this.$info.removeClass('active');
            _this.infoTimer=null;
        },2000)
    }else{
        clearTimeout(this.infoTimer);
        this.infoTimer=null;
        this.info(s);
    }
};
function _renderYears(){
    var str='',top=0,index=0;
    for(var i=this.minDate.y;i<=this.maxDate.y;i++){
        if(i==this.date.y){
            top=index*height;
            str+='<div class="active">'+i+'</div>';
        }else{
            str+='<div>'+i+'</div>';
        }
        index++;
    }
    this.$year.html(str);
    this.$year[0].scrollTop=top;
}
function _renderMonth(){
    var str='',top=0;
    for(var i=1;i<=12;i++){
        if(i==this.date.m){
            top=(i-1)*height;
            str+='<div class="active">'+i+'</div>';
        }else{
            str+='<div>'+i+'</div>';
        }
    }
    this.$month.html(str);
    this.$month[0].scrollTop=top;
}
function _renderDay(){
    var str='',top=0;
    var days=_getDays.call(this);
    for(var i=1;i<=days;i++){
        if(i==this.date.d){
            top=(i-1)*height;
            str+='<div class="active">'+i+'</div>';
        }else{
            str+='<div>'+i+'</div>';
        }
    }
    this.$day.html(str);
    this.$day[0].scrollTop=top;
}
var days=[0,31,28,31,30,31,30,31,31,30,31,30,31];
function _getDays(){
    var day=days[this.date.m];
    if(day==28 && this.date.y%4==0){
        day=29;
    }
    return day;
}
function _onscroll(obj,attr){
    var _this=this;
    var $ele=$(obj);
    if(obj._timer == null){
        obj._timer = setInterval(function(){
            if(obj.scrollTop == obj._topVal){
                var sh=height;
                clearInterval(obj._timer);  
                obj._timer = null;  
                var top=obj.scrollTop;
                var a=top%sh;
                if(a>=sh/2){
                    top+=(sh-a);
                }else{
                    top-=a;
                }
                obj.scrollTop = top;
                var i=Math.round(top/sh);
                _this.onchange(attr,parseInt($ele.children().eq(i).text()))
                _active($ele,i);
            }
        }, 100);  
    }
    obj._topVal = obj.scrollTop;  
}
function _active(ele,index){
    ele.find('.active').removeClass('active');
    ele.children().eq(index).addClass('active');
}
function _id(id){
    return $('#'+id)
}
function _fixNum(num){
    if(num<10)
        return '0'+num;
    return num;
}
function _date(y,m,d){
    if(arguments.length===0){
        y=new Date();
    }
    if(typeof y==='object'){
        m=y.getMonth()+1;
        d=y.getDate();
        y=y.getFullYear();
    }else if(arguments.length===1){
        var arr=y.split('-');
        y=arr[0];
        m=arr[1];
        d=arr[2];
    }
    this.set(y,m,d);
};_date.prototype.toDate=function(){
    return new Date(this.y,this.m-1,this.d);
};_date.prototype.toString=function(){
    return this.y+'-'+_fixNum(this.m)+'-'+_fixNum(this.d);
};_date.prototype.set=function(y,m,d){
    if(y!==undefined){
        if(arguments.length===1){
            var arr=y.split('-');
            y=arr[0];
            m=arr[1];
            d=arr[2];
        }
        this.y=parseInt(y);
        this.m=parseInt(m);
        this.d=parseInt(d);
    }
};_date.prototype.bigThen=function(date){
    return this.toDate()>date.toDate();
};_date.prototype.smallThen=function(date){
    return this.toDate()<date.toDate();
}
window.MyDate=MyDate;
})()
