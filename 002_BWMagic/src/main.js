let shape = null,
    threshold = 50,
    lineTest = [
        [50, 300],
        [100, 350],
        [250, 300],
        [100, 100]
    ],
    boundingBoxes = spellRecognition.createRectangleBoundingBoxes(threshold, lineTest),
    engine = createEngine({
        touchEnd : function (touches) {
            shape = touches;
            shape.name = "Spell";
            shape.isInShapeTest =
                spellRecognition.isInBoundingBox(shape, boundingBoxes) &&
                spellRecognition.nearAllPoints(shape, lineTest, threshold);
        },
        step: function (context, width, height, stepTimeElapsed, touches) {
            ogt_graphics.drawCircles(lineTest, threshold, context, width, height, "#00FFFF");
            ogt_graphics.drawLine(touches, context, width, height, "#000000")
            if (shape != null && shape.name) {
                context.font = "12px Arial";
                context.fillText(shape.name + " : " + shape.isInShapeTest, 10, 12);

                if (Array.isArray(shape)) {
                    ogt_graphics.drawLine(shape, context, width, height, "#000000")
                }
            }
        }
    });

engine.start()
