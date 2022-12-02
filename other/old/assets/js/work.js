function Float(element,i){
  this.element=element;
  this.index=i;
  this.dirc=J.random(0,360);
  this.speed=J.random(2,5)*0.1;
  this.len=J.random(120,160)*rate;
  this.r=this.len/2;
  this.isStop=false;
  this.x=J.random(this.r,width-this.r);
  this.y=J.random(this.r,height-this.r);
  this.init();
};Float.prototype.resize=function(){
  this.len=J.random(120,160)*rate;
  this.r=this.len/2;
  this.element.css({
    width:this.len+"px",
    height:this.len+"px",
    left:(this.x-this.r)+"px",
    top:(this.y-this.r)+"px"
  });
};Float.prototype.init=function(){
  this.element.attr("index",this.index).css({
    width:this.len+"px",
    height:this.len+"px",
    left:(this.x-this.r)+"px",
    top:(this.y-this.r)+"px"
  }).event({
    onmouseover:function(){
      floats[this.attr("index")].stop();
    },onmouseleave:function(){
      floats[this.attr("index")].start();
    },
  });//.txt(this.index);
};Float.prototype.move=function(r,d){
  this.x+=r*Math.cos(d*Math.PI/180);
  this.y+=r*Math.sin(d*Math.PI/180);
  this.element.css({
    left:(this.x-this.r)+"px",
    top:(this.y-this.r)+"px"
  });
};Float.prototype.countDeg=function(obj){
  var d=Math.atan((this.y-obj.y)/(this.x-obj.x))*180/Math.PI;
  if(this.x<obj.x){
    d+=180;
  }
  return this.checkDeg(d);
};Float.prototype.checkDeg=function(d){
  if(d<0){
    if(d<-360){
      d=360+(d%360);
    }else{
      d+=360;
    }
  }else if(d>360){
    d=d%360;
  }
  return d;
};Float.prototype.countDirc=function(d){
  this.dirc=this.checkDeg(2*d-this.dirc-180);
};Float.prototype.countDis=function(obj){
  return Math.sqrt(Math.pow(this.x-obj.x,2)+Math.pow(this.y-obj.y,2));
};Float.prototype.act=function(){
  if(!this.isStop){
    this.testObj();
    this.move(this.speed,this.dirc);
  }
};Float.prototype.testObj=function(){
  this.checkBorder();
  for(var i=0;i<floats.length;i++){
    var obj=floats[i];
    if(this!=obj){
      if(this.checkCrash(obj)){
        var d=this.countDeg(obj);
        this.countDirc(d);
        obj.countDirc(this.checkDeg(d+180));
      }
    }
  }
};Float.prototype.checkCrash=function(obj){
  var rd=this.countDis(obj);
  if(rd<=this.r+obj.r){
    if(rd<this.r+obj.r){
      var dis=this.r+obj.r-rd;
      var d=this.countDeg(obj);
      this.move(dis+1,d);
    }
    return true;
  }
  return false;
};Float.prototype.checkBorder=function(){
  if(this.x<=this.r){
    if(this.dirc>90&&this.dirc<270)
      this.countDirc(0);
  }else if(this.x>=width-this.r){
    if(this.dirc<90||this.dirc>270)
      this.countDirc(180);
  }
  if(this.y<=this.r){
    if(this.dirc>180&&this.dirc<360)
      this.countDirc(90);
  }else if(this.y>=height-this.r){
    if(this.dirc>0&&this.dirc<180)
      this.countDirc(270);
  }
};Float.prototype.stop=function(){
  this.isStop=true;
};Float.prototype.start=function(){
  this.isStop=false;
};