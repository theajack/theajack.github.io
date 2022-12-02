function Planet(name,index){
  this.name=name;
  this.element=J.id(name);
  this.index=index;
  this.track=S(".track."+name);
  this.deg=J.random(0,359);
  this.speed=J.random(1,6);
  this.len=J.random(80,100)*rate;
  this.a=this.track.offsetWidth/2;
  this.b=this.track.offsetHeight/2;
  this.r=this.len/2;
  this.isStop=false;
  this.isFront=false;
  this.x=0;
  this.y=0;
  this.init();
};Planet.prototype.t_deg=-16;
Planet.prototype.resize=function(){
  this.len=J.random(80,100)*rate;
  this.a=this.track.offsetWidth/2;
  this.b=this.track.offsetHeight/2;
  this.r=this.len/2;
  this.element.attr("index",this.index).css({
    width:this.len+"px",
    height:this.len+"px",
    "line-height":this.len+"px",
    "font-size":this.len/5+"px",
  })
};
;Planet.prototype.init=function(){
  var pos=this.getPos(this.deg);
  var z_index;
  if(this.deg>180){
    z_index=planetNum-this.index-1;
    this.isFront=false;
  }else{
    z_index=this.index+1+planetNum;
    this.isFront=true;
  }
  this.element.attr("index",this.index).css({
    width:this.len+"px",
    height:this.len+"px",
    "font-size":this.len/5+"px",
    "line-height":this.len+"px",
    "background-image":"url('https://cdn.jsdelivr.net/gh/theajack/theajack.github.com/assets/images/p"+this.index+".png')",
    "z-index":""+z_index
  }).event({
    onmouseover:function(){
      planets[this.attr("index")].stop();
    },onmouseleave:function(){
      planets[this.attr("index")].start();
    },
  })
  this.x=pos.x;
  this.y=pos.y;
};Planet.prototype.checkZIndex=function(){
  if(this.isFront&&this.deg>=180){
    this.element.css("z-index",""+(planetNum-this.index-1));
    this.isFront=false;
  }else if(this.deg==0){
    this.element.css("z-index",""+(this.index+1+planetNum));
    this.isFront=true;
  }
};Planet.prototype.act=function(){
  if(!this.isStop){
    this.deg+=this.speed;
    if(this.deg>=360){
      this.deg=0;
    }
    var pos=this.getPos(this.deg);
    this.moveTo(pos.x,pos.y);
    this.checkZIndex();
  }
};Planet.prototype.stop=function(){
  this.isStop=true;
};Planet.prototype.start=function(){
  this.isStop=false;
};Planet.prototype.getPos=function(d){
  var l=this.a*this.b/(Math.sqrt( Math.pow(this.b*Math.cos(d*Math.PI/180),2) + Math.pow(this.a*Math.sin(d*Math.PI/180),2) ));
  return {
    x:l*Math.cos((d+this.t_deg)*Math.PI/180)-this.r,
    y:l*Math.sin((d+this.t_deg)*Math.PI/180)-this.r
  };
};Planet.prototype.move=function(dx,dy){
  /*this.element.css({
    left:"+="+(dx)+"px",
    top:"+="+(dy)+"px"
  });
  this.x+=dx;
  this.y+=dy;*/
};Planet.prototype.moveTo=function(x,y){
  this.element.css({
    transform: 'translate('+x+'px,'+y+'px)',
    '-webkit-transform': '-webkit-translate('+x+'px,'+y+'px)'
  });
  this.x=x;
  this.y=y;
};