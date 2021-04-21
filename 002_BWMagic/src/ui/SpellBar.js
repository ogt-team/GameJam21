let SpellBar = {

    draw: function (context, width, height) {

        var squareSize = Settings.spellBarBoxHeight;
        var spellBarWith = spells.length * squareSize;
        var spellBarOffsetX = (document.body.offsetWidth - spellBarWith) / 2;

        for (let i = 0; i < spells.length; i++) {

            let color = Settings.spellBarColorWrong;

            if (SpellEngine.castSpell == spells[i]) {
                color = Settings.spellBarColorRight;
            }

            spellBarBoundingBoxe = [[
                spellBarOffsetX + (i * squareSize),
                document.body.offsetHeight - squareSize
            ], [
                (spellBarOffsetX + (i * squareSize)) + squareSize,
                document.body.offsetHeight - squareSize
            ],[
                (spellBarOffsetX + (i * squareSize)) + squareSize,
                document.body.offsetHeight
            ],[
                spellBarOffsetX + (i * squareSize),
                document.body.offsetHeight
            ],[
                spellBarOffsetX + (i * squareSize),
                document.body.offsetHeight - squareSize
            ]];

            var padding = Settings.spellBarBoxPadding;

            spellsIcon = Geometry.moveAndSkalePath(
                spells[i].gesture.normalisePath,
                spellBarOffsetX + (i * squareSize) +padding,
                document.body.offsetHeight - squareSize  + padding,
                squareSize - (2 * padding)
            );

            Graphics.drawLine(spellBarBoundingBoxe, context, width, height, color);
            Graphics.drawLine(spellsIcon, context, width, height, color);

            if (SpellEngine.lastGesture != null) {
                userGesturePreview = Geometry.moveAndSkalePath(
                    SpellEngine.lastGesture.normalisePath,
                    spellBarOffsetX + (i * squareSize) +padding,
                    document.body.offsetHeight - squareSize  + padding,
                    squareSize - (2 * padding)
                );
                Graphics.drawLine(
                    userGesturePreview,
                    context,
                    width,
                    height,
                    Settings.gestureUserColor
                );
            }
        }

    }
};