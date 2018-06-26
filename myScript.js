var slime; // slime like daggable thing

var values = {
    minPoints: 6,
    maxPoints: 6,
    minRadius: Math.min(view.size.height, view.size.width) / 2 - 50,
    maxRadius: Math.min(view.size.height, view.size.width) / 2 - 50
};

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

function recreatePaths() {
    slime.remove();
    slime = createPaths();
}

function createPaths() {
    console.log("view size: \n" + view.size);

    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    var radius = values.minRadius + Math.random() * radiusDelta;
    var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
    //view.size: Read only, The size of the visible area in project coordinates.
    //Point.random(): Static function, Returns a point object with random x and y values between 0 and 1.
    //var path = createBlob(view.size * Point.random(), radius, points);
    path = createBlob(view.center, radius, points);

    //random a color
    var lightness = (Math.random() - 0.5) * 0.4 + 0.4;
    var hue = Math.random() * 360;
    path.fillColor = {
        hue: hue,
        saturation: 1,
        lightness: lightness
    };
    path.strokeColor = {
        hue: hue,
        saturation: 1,
        lightness: lightness - 0.18
    };
    path.strokeWidth = 10;

    return path
}

function createBlob(center, maxRadius, points) {
    var path = new Path();
    path.closed = true;
    path.selected = true;
    for (var i = 0; i < points; i++) {
        var delta = new Point({
            length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0.5),
            angle: (360 / points) * i,
            selected: true
        });
        path.add(center + delta);
    }
    path.smooth();
    return path;
}

// indicate the current select element(like segment ...)
var segment, path;
var movePath = false;

function onMouseDown(event) {
    segment = path = null;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult){
        //let all element be not selected
        slime.selected = false
        return;
    }

    if (event.modifiers.shift) {
        if (hitResult.type == 'segment') {
            hitResult.segment.remove();
        };
        return;
    }

    if (hitResult) {
        path = hitResult.item;
        path.selected = true
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
            slime.selected = true;
            var location = hitResult.location;
            segment = path.insert(location.index + 1, event.point);
            path.smooth();
        }
    }
    movePath = hitResult.type == 'fill';
    if (movePath)
        project.activeLayer.addChild(hitResult.item);
}

function onMouseMove(event) {
    project.activeLayer.selected = false;
    if (event.item)
        event.item.selected = true;
}

function onMouseDrag(event) {
    if (segment) {
        path.selected = true;
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        path.selected = true;
        path.position += event.delta;
    }
}



//for resize
/*
// Create a circle shaped path with its center at the center
// of the view and a radius of 30:
var path = new Path.Circle({
    center: view.center,
    radius: 30,
    strokeColor: 'black'
});
*/
// function onResize(event) {
//     // Whenever the window is resized, recenter the path:
//     path.position = view.center;
// }


//JQuery event
$(document).ready(function () {
    console.log("load file myScript.js success");

    //create slime
    slime = createPaths();

    var $box = $('#colorPicker');
    $box.tinycolorpicker();
    var box = $box.data("plugin_tinycolorpicker");

    $box.change(function () {
        console.log("Color change to " + box.colorHex);
        slime.fillColor = box.colorHex;
        slime.strokeColor = box.colorHex;
        slime.strokeColor.lightness -= 0.18
        slime.selected = true;
    });

    $("#submit").click(function (e) {
        slime.selected = false;//let selected segment can't sein image
        e.preventDefault(); //取消reload
        console.log("submit clicked!");
        var canvas = document.getElementById("myCanvas");
        var headImage = canvas.toDataURL();
        console.log("Image: \n  " + headImage.substr(0, 100) + "  ...");
        $.ajax({
            url: "./sendHeadImage", //put url hear , change hear!!!!!!!!!!!!
            method: "POST",
            data: {
                headImage: headImage,
            },
            success: function (receive) {
                console.log("send image success");
            },
            error: function (code) {
                console.log("send Image fail");
                console.log(code);
            }
        })
    });
    $("#reset").click(function (e) {
        console.log("reset click");
        recreatePaths();
    });
})