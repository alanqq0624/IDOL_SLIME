var slime; // slime like daggable thing

var values = {
    minPoints: 3,
    maxPoints: 3,
    minRadius: Math.min(view.size.height, view.size.width) / 2 - 50,
    maxRadius: Math.min(view.size.height, view.size.width) / 2 - 50
};

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

createPaths(slime);

function recreatePaths() {
    slime.remove();
    createPaths(slime);
}

function createPaths(path) {
    console.log("view size: \n" + view.size);

    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    var radius = values.minRadius + Math.random() * radiusDelta;
    var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
    //view.size: Read only, The size of the visible area in project coordinates.
    //Point.random(): Static function, Returns a point object with random x and y values between 0 and 1.
    //var path = createBlob(view.size * Point.random(), radius, points);
    path = createBlob(view.center, radius, points);
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
        lightness: lightness - 0.1
    };
    path.strokeWidth = 10;
}

function createBlob(center, maxRadius, points) {
    var path = new Path();
    path.closed = true;
    for (var i = 0; i < points; i++) {
        var delta = new Point({
            length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0.5),
            angle: (360 / points) * i
        });
        path.add(center + delta);
    }
    path.smooth();
    return path;
}

var segment, path;
var movePath = false;

function onMouseDown(event) {
    segment = path = null;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult)
        return;

    if (event.modifiers.shift) {
        if (hitResult.type == 'segment') {
            hitResult.segment.remove();
        };
        return;
    }

    if (hitResult) {
        path = hitResult.item;
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
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
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
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

function onResize(event) {
    // Whenever the window is resized, recenter the path:
    path.position = view.center;
}
*/