// slime like daggable thing
var slime, eye1, eye2;

var values = {
    points: 5,
    Radius: Math.min(view.size.height, view.size.width) / 2
};

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
};

var initP = [{
    length: 0.7,
    angle: 30,
}, {
    length: 0.6,
    angle: 140,
}, {
    length: 0.5,
    angle: 179,
}, {
    length: 0.5,
    angle: 235,
}, {
    length: 0.6,
    angle: 335,
}]

function recreatePaths() {
    slime.remove();
    eye1.remove();
    eye2.remove();
    slime = createPaths();
    eye1 = createEye(1);
    eye2 = createEye(2);
    eye1.insertAbove(slime);
    eye2.insertAbove(slime);
}

function createPaths() {
    console.log("view size: " + view.size);
    console.log("view center: " + view.center);

    var radius = values.Radius;
    var points = values.points;
    //view.size: Read only, The size of the visible area in project coordinates.
    //Point.random(): Static function, Returns a point object with random x and y values between 0 and 1.
    //var path = createBlob(view.size * Point.random(), radius, points);
    var path = createBlob(view.center, radius, points);

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
    path.strokeWidth = 5;

    return path
}

function createBlob(center, maxRadius, points) {
    var path = new Path();
    path.closed = true;
    path.selected = true;
    for (var i = 0; i < points; i++) {
        var delta = new Point({
            length: maxRadius * initP[i].length,
            angle: initP[i].angle,
            selected: true
        });
        path.add(center + delta);
    }
    path.smooth();
    return path;
}

//give position(1 or 2) to determine left(1) or right(2) eye
function createEye(position) {
    if (position == 1) {
        position = new Point(view.center + {
            length: values.Radius * 0.3,
            angle: 212,
            selected: false
        });
    } else if (position == 2) {
        position = new Point(view.center + {
            length: values.Radius * 0.4,
            angle: 0,
            selected: false
        });
    } else {
        position = view.center
    }
    var path = new Path();
    path.closed = true;
    path.selected = false;
    for (var i = 0; i < 6; i++) {
        var delta = new Point({
            length: 6,
            angle: (360 / 6) * i,
            selected: false
        });
        path.add(position + delta);
    }
    path.smooth();

    path.fillColor = 'white';
    path.strokeColor = {
        hue: 0,
        saturation: 0,
        lightness: 0.82
    };
    path.strokeWidth = 1;
    return path;
}

// indicate the current select element(like segment ...)
var segment, path;

function onMouseDown(event) {
    segment = path = null;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        //let all element be not selected
        slime.selected = false;
        eye1.selected = false;
        eye2.selected = false;
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

    //create slime and eyes
    slime = createPaths();
    eye1 = createEye(1);
    eye2 = createEye(2);
    eye1.insertAbove(slime);
    eye2.insertAbove(slime);

    var $box = $('#colorPicker');
    $box.tinycolorpicker();
    var box = $box.data("plugin_tinycolorpicker");

    $box.change(function () {
        console.log("Color change to " + box.colorHex);
        slime.fillColor = box.colorHex;
        slime.strokeColor = box.colorHex;
        slime.strokeColor.lightness -= 0.18
        slime.selected = true;
        eye1.insertAbove(slime);
        eye2.insertAbove(slime);

        slime.selected = false; 
        eye1.selected = false;
        eye2.selected = false;
    });

    $("#submit").click(function (e) {
        //let selected segment can't see in image, but fail
        slime.selected = false; 
        eye1.selected = false;
        eye2.selected = false;

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
        slime.selected = false; 
        eye1.selected = false;
        eye2.selected = false;
    });
})