let engine = CanvasEngineFactory({
    update: function (context, width, height, stepTimeElapsed, plugins) {
        GestureEngine.update(plugins.input.touches);

        if (GestureEngine.userCreatedGesture()) {
            SpellEngine.checkSpell(GestureEngine.lastGesture);
        }
    },
    draw: function (context, width, height, stepTimeElapsed, plugins) {
        GestureEngine.draw(context, width, height);
        UI.draw(context, width, height);
    }
});

engine.start()
