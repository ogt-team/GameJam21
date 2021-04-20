let touches = [],
    shape = null,
  engine = cEngine.create({
    autoClear: false,
    height: 512,
    plugins: {
        input: cEngine.input.create(),
        activityTracker: cEngine.activityTracker.create({
            stopOnUserLeave: true
        }),
        stats: cEngine.stats.create(),
        fill: cEngine.fill.create({
            mode: 'stretch',
            aspectRetion: true
        }),
        frameRate: cEngine.frameRate.create({
            fps: 60
        })
    },
    step: (context, width, height, stepTimeElapsed, plugins) => {

        engine.clear();

        let threshold = 50;

        let lineTest = [
            [50, 300],
            [100, 350],
            [250, 300],
            [100, 100]
        ];

        for (var j = 0; j < lineTest.length;j += 1) {
            context.beginPath();
            context.strokeStyle = "#00FFFF";
            context.arc(
                (lineTest[j][0]  / document.body.offsetWidth) * width,
                (lineTest[j][1]  / document.body.offsetHeight) * height,
                threshold * (width/ document.body.offsetWidth),
                0, 2 * Math.PI);
            context.stroke();
        }

        let shapeTest = createShapeForLineTest(threshold, lineTest, context, width, height, stepTimeElapsed, plugins);


        if (plugins.input.touches.length == 0 && touches.length > 0) {
            try {
                shape = touches;
                shape.name = "Spell";
                shape.isInShapeTest = true;

                var nearTestPoins = [];

                for (var j = 0; j < lineTest.length;j += 1) {
                    nearTestPoins[j] = false;
                }

                for (var i = 0; i < shape.length - 1;i += 1) {
                    var p = shape[i];
                    var p2 = shape[i+1]

                    if (!inside(p, shapeTest)){
                        shape.isInShapeTest = false;
                        break;
                    }

                    for (var j = 0; j < lineTest.length;j += 1) {
                        var pt = lineTest[j];
                        var r = threshold;
                        var isInside=Math.pow(p[0] - pt[0], 2) + Math.pow(p[1] - pt[1], 2) < (r*r);
                        if (isInside){
                           nearTestPoins[j] = true;
                        }
                    }
                }
                for (var j = 0; j < nearTestPoins.length;j += 1) {
                    if (nearTestPoins[j] == false ) {
                       shape.isInShapeTest = false;
                       break;
                    }
               }

            } catch (error) {
                console.log(error)
            }

            touches = [];
        }

        plugins.input.touches.forEach(function(touch){
            touches.push([
                touch.x,
                touch.y
            ])
        })

        touches.forEach(t => {
            context.fillRect(
                (t[0] / document.body.offsetWidth) * width,
                (t[1] / document.body.offsetHeight) * height
                , 1
                , 1
            )
        });

        if (shape != null && shape.name) {
            context.font = "12px Arial";
            context.fillText(shape.name + " : " + shape.isInShapeTest, 10, 12);


            if (Array.isArray(shape)) {
                context.beginPath();
                context.moveTo (
                    (shape[0][0] / document.body.offsetWidth) * width,
                    (shape[0][1] / document.body.offsetHeight) * height
                );

                for (var i = 1; i < shape.length;i += 1) {

                    context.lineTo (
                        (shape[i][0] / document.body.offsetWidth) * width,
                        (shape[i][1] / document.body.offsetHeight) * height
                    );
                }

                context.strokeStyle = "#000000";
                context.lineWidth = 1;
                context.stroke();

            }
        }

    }
  })

engine.start()

// https://stackoverflow.com/a/29915728
function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};


function createShapeForLineTest (threshold, line, context, width, height, stepTimeElapsed, plugins) {

    // Create Polygon
    let shapeOutlineleft = [];
    let shapeOutlineRight = [];
    for (var i = 0; i < line.length;i += 1) {

        if (i == 0) {
            let dir = [
                line[i][0] - line[i+1][0],
                line[i][1] - line[i+1][1]
            ];
            dir = resizeVector(dir, threshold);

            shapeOutlineleft.push([
                line[i][0] + dir[0],
                line[i][1] + dir[1]
            ])

            shapeOutlineRight.push([
                line[i][0] + dir[0],
                line[i][1] + dir[1]
            ])
            let leftDir = rotateVector(dir, 90);

            shapeOutlineleft.push([
                line[i][0] - leftDir[0],
                line[i][1] - leftDir[1]
            ])

            let rightDir = rotateVector(dir, -90);

            shapeOutlineRight.push([
                line[i][0] - rightDir[0],
                line[i][1] - rightDir[1]
            ])

        }

        if (i > 0 && i < line.length-1) {

            let dir = [
                line[i][0] - line[i+1][0],
                line[i][1] - line[i+1][1]
            ];
            dir = resizeVector(dir, threshold);

            var angel = (getAngle(line[i-1], line[i], line[i+1])/2);

            let leftDir = rotateVector(dir, angel + 90);

            shapeOutlineleft.push([
                line[i][0] - leftDir[0],
                line[i][1] - leftDir[1]
            ])

            let rightDir = rotateVector(dir, angel - 90);

            shapeOutlineRight.push([
                line[i][0] - rightDir[0],
                line[i][1] - rightDir[1]
            ])
        }

        if (i == line.length -1) {
            let dir = [
                line[i][0] - line[i-1][0],
                line[i][1] - line[i-1][1]
            ];
            dir = resizeVector(dir, threshold);

            let leftDir = rotateVector(dir, -90);

            shapeOutlineleft.push([
                line[i][0] - leftDir[0],
                line[i][1] - leftDir[1]
            ])

            let rightDir = rotateVector(dir, 90);

            shapeOutlineRight.push([
                line[i][0] - rightDir[0],
                line[i][1] - rightDir[1]
            ])


            shapeOutlineRight.push([
                line[i][0] + dir[0],
                line[i][1] + dir[1]
            ])
        }
    }

    var shape = [];
    shapeOutlineRight.forEach(v => shape.push(v))
    shapeOutlineleft.reverse().forEach(v => shape.push(v))


    // Draw
    drawLine2(context,width, height, line, "#FF0000");
    drawLine(context, width, height,line, "#FF0000");
    drawLine(context, width, height,shape, "#00FF00");

    return shape;
}

//https://stackoverflow.com/a/42159152
function getAngle (v1, v2, v3) {
    var dAx = v2[0] - v1[0] ;
    var dAy = v2[1] - v1[1] ;
    var dBx = v3[0] - v2[0];
    var dBy = v3[1] - v2[1];
    var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    return degree_angle = angle * (180 / Math.PI);
}

function resizeVector (v, newLength) {
    let length = Math.sqrt(v[0]*v[0]+v[1]*v[1]);
    return [
        (v[0] / length) * newLength,
        (v[1] / length) * newLength
    ];
}

function drawLine2 (context, width, height,line, color) {

    for (var i = 0; i < line.length;i += 1) {

        context.fillStyle = color
        context.fillRect((line[i][0] / document.body.offsetWidth) * width,
        (line[i][1] / document.body.offsetHeight) * height, 1 * (i+1),  1 * (i+1))

    }

}


function drawLine (context, width, height,line, color) {
    context.beginPath();
    context.moveTo (
        (line[0][0] / document.body.offsetWidth) * width,
        (line[0][1] / document.body.offsetHeight) * height
    );

    for (var i = 1; i < line.length;i += 1) {

        context.lineTo (
            (line[i][0] / document.body.offsetWidth) * width,
            (line[i][1] / document.body.offsetHeight) * height
        );
    }

    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
}

// https://stackoverflow.com/a/28112459
function rotateVector(vec, ang)
{
    ang = -ang * (Math.PI/180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
};