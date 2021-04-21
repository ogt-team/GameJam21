class Spell {

    name          = "";
    gesture       = null;
    boundingBoxes = null;

    constructor(config) {
        this.name          = config.name;
        this.gesture       = new Gesture(config.gesture);
        this.boundingBoxes = SpellRecognitionHelper.createRectangleBoundingBoxes(
            Settings.recognitionTreshold,
            this.gesture.normalisePath
        );
    }

    isValid (gesture) {
        return SpellRecognitionHelper.isInBoundingBox(
            gesture.normalisePath,
            this.boundingBoxes
        ) && SpellRecognitionHelper.nearAllPoints(
            gesture.normalisePath,
            this.gesture.normalisePath,
            Settings.recognitionTreshold
        );
    }

    draw (context, width, height){

        Graphics.drawCircles(
            this.gesture.normalisePath,
            Settings.recognitionTreshold,
            context,
            width,
            height,
            "#00FFFF"
        );

        for (var k = 0; k < this.boundingBoxes.length;k += 1) {
            Graphics.drawLine(this.boundingBoxes[k], context, width, height, "#FF0000")
        }

        this.gesture.drawNormalised(context, width, height);
    }
}
