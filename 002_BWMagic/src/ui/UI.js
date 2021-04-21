let UI = {

    draw: function (context, width, height) {

        SpellBar.draw(context, width, height);

        context.font = Settings.uiFont;
        context.fillStyle = Settings.uiTextColor;
        context.fillText("Try to cast a spell.", 10, 12);

        if (SpellEngine.userCastSpell() && !GestureEngine.isDrawing) {
            context.fillText("Yeah! Cast spell: " + SpellEngine.castSpell.name, 10, 26);
        }
    }
}