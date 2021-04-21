
function CanvasEngineFactory (config) {

    let engine = cEngine.create({
        autoClear: false,
        height: Settings.canvasHeight,
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
                fps: Settings.fps
            })
        },
        step: (context, width, height, stepTimeElapsed, plugins) => {

            engine.clear();

            try {
                config.update(context, width, height, stepTimeElapsed, plugins);
                config.draw(context, width, height, stepTimeElapsed, plugins);
            } catch (error) {
                console.log(error)
            }
        }
    })
    return engine;
}