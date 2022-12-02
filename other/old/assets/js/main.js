var height,width,cx,cy;
var origin;
var planets=[];
var floats=[];
var t_height=180;
var t_d=90;
var rate;
var o_len=150;
//1200 700
var t;
var names=["resume","work","blog","music","image","video"];
var planetNum=names.length;
J.load(function(){
  setSize();
  
  names.each(function(item,i){
    planets.append(new Planet(item,i));
  });
  setInterval(function(){
    planets.each(function(item){
      item.act();
    });
  },200);
  //J.class('planet').removeClass('center-pos');
  setTimeout(function(){
    //J.id('planets').css('opacity','1');
    
  },500)
});
function setSize(){
  height=J.height(),width=J.width();
  rate=((height>width)?(width*2/3):height)/700;
  t_d=90*rate;
  t_height=180*rate;
  o_len=150*rate;
  cx=width/2,cy=height/2;
  J.class("track").each(function(item,i){
    var h=(t_height+i*t_d);
    item.css({
      width:2*h+"px",
      height:h+"px",
      left:(cx-h)+"px",
      top:(cy-h/2)+"px"
    });
  });
  origin=J.id("origin").css({
    width:o_len+"px",
    height:o_len+"px",
    "font-size":o_len/5+"px",
    "line-height":o_len+"px",
    "z-index":""+(planetNum)
  }).clk("J.open('https://github.com/theajack/')");
}
window.onresize=function(){
  setSize();
  planets.each(function(item){
    item.resize();
  })
}






