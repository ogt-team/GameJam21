
class Segment {

    points     = [];
    innerAngle = 0;
    distance   = 0;
    direction  = [];

    nextSegment = null;
    nextSegmentAngle = 0;

    color = "";

    constructor (point, point2) {
        this.points.push(point);

        if (point2) {
            this.points.push(point2);
        }

        this.color = Graphics.getRandomColor();
    }

    add (point) {
        let shouldAdd = true;

        if (this.points.length > 1) {

            let angle = Geometry.getAngleBetweenLines(
                this.points[this.points.length - 2],
                this.points[this.points.length - 1],
                point
            ) ;

            if (Math.abs(angle) >= Settings.gestureMinAngleForCorner) {
                shouldAdd = false;
            } else if (angle < 0 && this.innerAngle > 0 || angle > 0 && this.innerAngle < 0)  {
                shouldAdd = false
            }

            if (shouldAdd) {
                this.innerAngle += angle;
            }
        }

        if (shouldAdd) {
            this.direction = [
                this.points[0][0] - point[0],
                this.points[0][1] - point[1]
            ];
            this.points.push(point);

            this.distance = 0;
            for (let i = 1; i < this.points.length; i++) {
                this.distance += Geometry.getDistance(this.points[i-1], this.points[i])
            }
        }

        return shouldAdd;
    }

    setNextSegment (segment) {
        this.nextSegment = segment;
        let angle = Geometry.getAngleBetweenLines(
            this.points[0],
            this.points[this.points.length - 1],
            segment.points[segment.points.length - 1]
        ) + 180;

        this.nextSegmentAngle = angle > 180 ? 360 - angle : angle;
    }

    draw (context, width, height) {
        Graphics.drawLine(
            [
                this.points[0],
                this.points[this.points.length - 1]
            ],
            context,
            width,
            height,
            this.color
        );

        context.font = Settings.uiFontSmall;
        context.fillStyle = Settings.uiTextColor;
        context.fillText(
            "innerAngle:" + this.innerAngle,
            (this.points[0][0] / document.body.offsetWidth) * width,
            (this.points[0][1] / document.body.offsetHeight) * height
        );

        if (this.nextSegmentAngle !==undefined) {
            context.fillText(
                "nextSegmentAngle:" + this.nextSegmentAngle,
                (this.points[0][0] / document.body.offsetWidth) * width,
                ((this.points[0][1] / document.body.offsetHeight) * height ) + 10
            );
        }

        if (this.distance !==undefined) {
            context.fillText(
                "distance:" + this.distance,
                (this.points[0][0] / document.body.offsetWidth) * width,
                ((this.points[0][1] / document.body.offsetHeight) * height ) + 20
            );
        }
    }

    mergeToEnd (segment) {
        for (let i = 0; i < segment.points.length; i++) {
            this.points.push(segment.points[i]);
        }
        this.distance += segment.distance;
        this.innerAngle += segment.innerAngle;

        this.direction = [
            this.points[0][0] - this.points[this.points.length-1][0],
            this.points[0][1] - this.points[this.points.length-1][1]
        ];

        if (segment.nextSegment) {
            this.setNextSegment(segment.nextSegment);
        }
    }

    mergeToFront (segment) {
        var tmp = this.points;
        this.points = segment.points;
        for (let i = 0; i < tmp.length; i++) {
            this.points.push(tmp[i]);
        }
        this.distance += segment.distance;
        this.innerAngle += segment.innerAngle;

        this.direction = [
            this.points[0][0] - this.points[this.points.length-1][0],
            this.points[0][1] - this.points[this.points.length-1][1]
        ];
    }
}