var rows=0;
var num=150;
var arr=[];
J.ready(function(){
  appendImages();
});
window.onresize=appendImages;
function appendImages(){
  var w=J.width();
  if(w>=950){
    n=5;
  }else if(w<550){
    n=2;
  }else{
    n=3;
  }
  if(rows!=n){
    for(i=1;i<=150;i++){
      arr.append(i);
    }
    rows=n;
    J.id("bigWrapper").empty();
    var k=149;
    for(var i=0;i<n;i++){
      var w=J.new("div.image-wrapper");
      var s=num/n;
      for(var j=0;j<s;j++){
        var index=J.random(0,k)
        w.append(J.new("img").attr("src","https://cdn.jsdelivr.net/gh/theajack/theajack.github.com/assets/images/my_images/"+arr[index]+".jpg").clk(function(){
          changeUrl(this.attr("src"));
        }));
        arr.removeByIndex(index,false);
        k--;
      }
      J.id("bigWrapper").append(w);
    }
  }
}
function changeUrl(url){
  J.class("zoom-img").css("background-image","url('"+url+"')").parent().fadeIn();
}







