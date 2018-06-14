$(document).ready(function () {
    console.log("load file event.js success");

    var $box = $('#colorPicker');
    $box.tinycolorpicker();
    var box = $box.data("plugin_tinycolorpicker");

    $box.bind("change", function () {
        console.log("Color change to "+box.colorHex);
    });

    $("#download").click(function (e) {
        console.log("clicked!");
        e.preventDefault(); //取消reload
        var canvas = document.getElementById("myCanvas");
        var dataUrl = canvas.toDataURL();
        console.log(dataUrl);
    });
})