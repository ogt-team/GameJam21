var spellRecognition = {

    nearAllPoints: function (gesture, spell, threshold){
        var nearTestPoins = [];
        var check = true;

        for (var j = 0; j < spell.length;j += 1) {
            nearTestPoins[j] = false;
        }

        for (var i = 0; i < gesture.length - 1;i += 1) {
            var p = gesture[i];

            for (var j = 0; j < spell.length;j += 1) {
                var pt = spell[j];
                var r = threshold;
                var isInside=Math.pow(p[0] - pt[0], 2) + Math.pow(p[1] - pt[1], 2) < (r*r);
                if (isInside){
                    nearTestPoins[j] = true;
                }
            }
        }

        for (var j = 0; j < nearTestPoins.length;j += 1) {
            if (nearTestPoins[j] == false ) {
                check = false;
                break;
            }
        }

        return check;
    },

    isInBoundingBox: function(gesture, boundingBoxes){
        var check = true;
        for (var i = 0; i < gesture.length - 1;i += 1) {
            var p = gesture[i];

            let hasRectangle = false;
            for (var k = 0; k < boundingBoxes.length;k += 1) {
                if (ogt_geometry.inside(p, boundingBoxes[k])){
                    hasRectangle = true;
                }
            }

            if (!hasRectangle){
                check = false;
                break;
            }
        }
        return check;
    },

    createRectangleBoundingBoxes: function(threshold, line){

        let rectangels = [];

        for (var i = 0; i < line.length - 1;i += 1) {
            let p = line[i];
            let p_n = line[i+1];
            let r = [];

            let dir = [
                p[0] - p_n[0],
                p[1] - p_n[1]
            ];

            let start_left_dir = ogt_geometry.resizeVector(ogt_geometry.rotateVector(dir, -135), threshold);
            let start_right_dir = ogt_geometry.resizeVector(ogt_geometry.rotateVector(dir, -225), threshold);

            let end_left_dir = ogt_geometry.resizeVector(ogt_geometry.rotateVector(dir, -45), threshold);
            let end_right_dir = ogt_geometry.resizeVector(ogt_geometry.rotateVector(dir, -315), threshold);

            r.push([
                p[0] - start_left_dir[0],
                p[1] - start_left_dir[1]
            ])

            r.push([
                p[0] - start_right_dir[0],
                p[1] - start_right_dir[1]
            ])

            r.push([
                p_n[0] - end_right_dir[0],
                p_n[1] - end_right_dir[1]
            ])

            r.push([
                p_n[0] - end_left_dir[0],
                p_n[1] - end_left_dir[1]
            ])

            r.push([
                p[0] - start_left_dir[0],
                p[1] - start_left_dir[1]
            ])

            rectangels.push(r);
        }

        return rectangels;
    }
}