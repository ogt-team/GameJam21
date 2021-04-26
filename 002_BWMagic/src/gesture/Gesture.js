
class Gesture {

    path          = [];
    normalisePath = [];

    //bounding box
    width  = 0;
    height = 0;
    minX   = 0;
    minY   = 0;
    maxX   = 0;
    maxY   = 0;

    //analyse
    segments = [];
    isClosed = false;
    numLinieIntersects = 0;

    constructor (path = null) {
        if (path != null) {
            this.path = path;
            this.update();
        }
    }

    add (touch) {
        this.path.push([
            touch.x,
            touch.y
        ])
        this.path = Geometry.simplifyPath(this.path);
        this.update();
    }

    update () {
        this.normalisePath = Geometry.normalisePath(
            this.path,
            Settings.normaliseLength
        );
        this.createBoundingBox();
        this.createSegments();
        this.anaylsePath();
    }


    hasPath () {
        return this.path.length > 0;
    }

    draw (context, width, height) {

        if (this.hasPath()) {

            Graphics.drawLine(this.path, context, width, height, Settings.gestureUserColor);

            for (let i = 0; i < this.segments.length; i++) {
                this.segments[i].draw(context, width, height);
            }

            context.fillStyle = "#FF000040"
            context.fillRect(
                (this.minX / document.body.offsetWidth) * width,
                (this.minY / document.body.offsetHeight) * height,
                (this.width / document.body.offsetWidth) * width,
                (this.height / document.body.offsetHeight) * height
            )

            context.font = Settings.uiFontSmall;
            context.fillStyle = Settings.uiTextColor;
            context.fillText(
                "numLinieIntersects:" + this.numLinieIntersects,
                (this.minX / document.body.offsetWidth) * width,
                (this.maxY / document.body.offsetHeight) * height
            );

            context.font = Settings.uiFontSmall;
            context.fillStyle = Settings.uiTextColor;
            context.fillText(
                "isClosed:" + this.isClosed,
                (this.minX / document.body.offsetWidth) * width,
                ((this.maxY / document.body.offsetHeight) * height) + 10
            );

            //draw closed circle
            context.beginPath();
            context.strokeStyle = "#00FF00";
            context.arc(
                (this.path[0][0]  / document.body.offsetWidth) * width,
                (this.path[0][1]  / document.body.offsetHeight) * height,
                (this.getLargerSite() * Settings.gestureClosedLoopThreshold) * (width/ document.body.offsetWidth),
                0, 2 * Math.PI);
            context.stroke();

        }
    }

    drawNormalised (context, width, height) {
        Graphics.drawLine(this.normalisePath, context, width, height, Settings.gestureUserColor)
    }

    anaylsePath () {
        this.numLinieIntersects = this.countLinieIntersects();

        this.isClosed = Geometry.isInCircle(
            this.path[0],
            this.path[this.path.length-1],
            this.getLargerSite() * Settings.gestureClosedLoopThreshold
        );

        //if first segment intersects with last line
        if (Geometry.intersects(
            this.segments[0].points[0][0],
            this.segments[0].points[0][1],
            this.segments[0].points[this.segments[0].points.length-1][0],
            this.segments[0].points[this.segments[0].points.length-1][1],
            this.segments[this.segments.length - 1].points[0][0],
            this.segments[this.segments.length - 1].points[0][1],
            this.segments[this.segments.length - 1].points[this.segments[this.segments.length - 1].points.length-1][0],
            this.segments[this.segments.length - 1].points[this.segments[this.segments.length - 1].points.length-1][1])
        ) {
            this.numLinieIntersects--;
            this.isClosed = true;
        }
    }

    createSegments () {
        this.segments = [];
        let currentSegment = new Segment(this.path[0]);
        for (let i = 1; i < this.path.length - 1; i++) {
            let p = this.path[i];
            if (!currentSegment.add(p)) {
                let previousPoint = currentSegment.points[currentSegment.points.length - 1];

                if (this.segments.length > 0 && currentSegment.distance < this.getLargerSite() * Settings.gestureMinSegmentLength) {
                    this.segments[this.segments.length -1].mergeToEnd(currentSegment);
                } else {

                    if (this.segments.length > 0) {
                        this.segments[this.segments.length - 1].setNextSegment(currentSegment);
                    }
                    this.segments.push(currentSegment);

                }
                currentSegment = new Segment(previousPoint, p);
            }
        }
        currentSegment.add(this.path[this.path.length - 1]);
        if (this.segments.length > 0) {
            this.segments[this.segments.length - 1].setNextSegment(currentSegment);
        }
        this.segments.push(currentSegment);

        //merge
        for (let i = 1; i < this.segments.length; i++) {

            //if innerAngle is small and direxrtion of previous or next is same -> merge
            if (Math.abs(this.segments[i].innerAngle) < 90) {
                this.mergeSegment(i);
            }

            //length
            if (this.segments[i].distance <= this.getLargerSite() * Settings.gestureMinSegmentLength) {
                //ToDo: Merge with previous or next, check direction vector, closes angle wins
                this.mergeSegment(i);
            }
        }
    }

    countLinieIntersects () {
        let count = 0;

        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];

            for (let y = i+1; y < this.segments.length; y++) {
                const s2 = this.segments[y];

                if (Geometry.intersects(
                    s1.points[0][0],
                    s1.points[0][1],
                    s1.points[s1.points.length-1][0],
                    s1.points[s1.points.length-1][1],
                    s2.points[0][0],
                    s2.points[0][1],
                    s2.points[s2.points.length-1][0],
                    s2.points[s2.points.length-1][1])
                ) {
                    count++;
                }
            }
        }

        return count;
    }

    createBoundingBox () {
        this.minX = Number.MAX_SAFE_INTEGER,
        this.maxX = Number.MIN_SAFE_INTEGER,
        this.minY = Number.MAX_SAFE_INTEGER,
        this.maxY = Number.MIN_SAFE_INTEGER;

        for (let i = 0; i < this.path.length; i++) {
            let p = this.path[i];
            if (p[0] < this.minX) { this.minX = p[0]; }
            if (p[0] > this.maxX) { this.maxX = p[0]; }
            if (p[1] < this.minY) { this.minY = p[1]; }
            if (p[1] > this.maxY) { this.maxY = p[1]; }
        }

        this.width  = this.maxX - this.minX;
        this.height = this.maxY - this.minY;
    }

    mergeSegment (i) {
        if (i>0 && i <this.segments.length-1) {
            let angleBefore = Geometry.getAngleBetweenVectors(
                this.segments[i].direction,
                this.segments[i-1].direction
            );
            let angleNext = Geometry.getAngleBetweenVectors(
                this.segments[i].direction,
                this.segments[i+1].direction
            );
            if (angleBefore < 45) {
                this.segments[i-1].mergeToEnd(this.segments[i]);
                this.segments.splice(i, 1);
            } else if (angleNext < 45){
                this.segments[i+1].mergeToFront(this.segments[i]);
                this.segments.splice(i, 1);
            }
        }
    }

    getLargerSite () {
        return this.width > this.height ? this.width : this.height;
    }
}