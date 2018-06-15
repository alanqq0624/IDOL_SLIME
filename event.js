$(document).ready(function () {
    console.log("load file event.js success");

    var $box = $('#colorPicker');
    $box.tinycolorpicker();
    var box = $box.data("plugin_tinycolorpicker");

    $box.change(function () {
        console.log("Color change to " + box.colorHex);
    });

    $("#download").click(function (e) {
        console.log("download clicked!");
        e.preventDefault(); //取消reload
        var canvas = document.getElementById("myCanvas");
        var dataUrl = canvas.toDataURL();
        console.log(dataUrl);
    });
    $("#regenerate").click(function (e) {
        console.log("regenerate click");
        e.preventDefault(); //取消reload
        recreatePaths();
    });
})