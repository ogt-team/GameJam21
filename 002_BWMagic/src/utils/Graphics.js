let Graphics = {

    //https://stackoverflow.com/a/1484514
    getRandomColor: function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    drawRectangles: function (line, context, width, height, color) {
        for (var i = 0; i < line.length; i+=1) {
            context.fillStyle = color
            context.fillRect(
                (line[i][0] / document.body.offsetWidth) * width,
                (line[i][1] / document.body.offsetHeight) * height,
                1,
                1
            )
        }
    },

    drawGrowingRectangles: function (line, context, width, height, color) {
        for (var i = 0; i < line.length; i+=1) {
            context.fillStyle = color
            context.fillRect(
                (line[i][0] / document.body.offsetWidth) * width,
                (line[i][1] / document.body.offsetHeight) * height,
                1 * (i+1),
                1 * (i+1)
            )
        }
    },

    drawLine: function (line, context, width, height, color) {

        if(line.length==0) { return; }

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
    },

    drawCircles: function (centers, radius, context, width, height, color) {
        for (var j = 0; j < centers.length;j += 1) {
            context.beginPath();
            context.strokeStyle = color;
            context.arc(
                (centers[j][0]  / document.body.offsetWidth) * width,
                (centers[j][1]  / document.body.offsetHeight) * height,
                radius * (width/ document.body.offsetWidth),
                0, 2 * Math.PI);
            context.stroke();
        }
    },


};