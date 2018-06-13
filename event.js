$(document).ready(function(){
    console.log("load file event.js success");
})

$("#download").click(function(e){
    console.log("clicked!");
    e.preventDefault(); //取消reload
    var canvas = document.getElementById("myCanvas");
    var dataUrl = canvas.toDataURL();
    console.log(dataUrl);
});