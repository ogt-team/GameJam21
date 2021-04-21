let GestureEngine = {

    lastGesture: new Gesture(),
    gesture: new Gesture(),
    isDrawing:false,

    userCreatedGesture: function () {
        return !GestureEngine.isDrawing && GestureEngine.lastGesture.hasPath();
    },

    update: function (touches){

        GestureEngine.isDrawing = touches.length != 0;

        if (!GestureEngine.isDrawing) {
            GestureEngine.lastGesture = GestureEngine.gesture;
            GestureEngine.gesture = new Gesture();
        }

        touches.forEach(function(touch){
            GestureEngine.gesture.add(touch);
        })
    },

    draw: function (context, width, height) {
        GestureEngine.gesture.draw(context, width, height);
    }
}