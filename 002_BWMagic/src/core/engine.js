
function createEngine (config) {
    let touches = [],
    engine = cEngine.create({
        autoClear: false,
        height: 512,
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
                fps: 60
            })
        },
        step: (context, width, height, stepTimeElapsed, plugins) => {

            engine.clear();

            if (plugins.input.touches.length == 0 && touches.length > 0) {
                try {
                    config.touchEnd(touches);
                } catch (error) {
                    console.log(error)
                }
                touches = [];
            }

            plugins.input.touches.forEach(function(touch){
                touches.push([
                    touch.x,
                    touch.y
                ])
            })
            try {
                config.step(context, width, height, stepTimeElapsed, touches);
            } catch (error) {
                console.log(error)
            }
        }
    })
    return engine;
}