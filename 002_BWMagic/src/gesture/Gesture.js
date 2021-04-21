
class Gesture {

    path = [];
    normalisePath = [];

    constructor (path = null) {
        if (path != null) {

            this.path = path;

            this.normalisePath = Geometry.normalisePath(
                this.path,
                Settings.normaliseLength
            );
        }
    }

    add (touch) {
        this.path.push([
            touch.x,
            touch.y
        ])

        this.path = Geometry.simplifyPath(this.path);

        this.normalisePath = Geometry.normalisePath(
            this.path,
            Settings.normaliseLength
        );
    }

    hasPath () {
        return this.path.length > 0;
    }

    draw (context, width, height) {
        Graphics.drawLine(this.path, context, width, height, Settings.gestureUserColor)
    }

    drawNormalised (context, width, height) {
        Graphics.drawLine(this.normalisePath, context, width, height, Settings.gestureUserColor)
    }
}