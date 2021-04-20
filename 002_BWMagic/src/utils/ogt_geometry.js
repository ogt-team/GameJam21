
let ogt_geometry = {

    // https://stackoverflow.com/a/29915728
    inside: function(point, vs) {
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

        var x = point[0], y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    },

    //https://stackoverflow.com/a/42159152
    getAngleBetweenLines: function (v1, v2, v3) {
        var dAx = v2[0] - v1[0] ;
        var dAy = v2[1] - v1[1] ;
        var dBx = v3[0] - v2[0];
        var dBy = v3[1] - v2[1];
        var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
        return degree_angle = angle * (180 / Math.PI);
    },

    resizeVector:function (v, newLength) {
        let length = Math.sqrt(v[0]*v[0]+v[1]*v[1]);
        return [
            (v[0] / length) * newLength,
            (v[1] / length) * newLength
        ];
    },

    // https://stackoverflow.com/a/28112459
    rotateVector : function (vec, ang){
        ang = -ang * (Math.PI/180);
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        return new Array(
            Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000,
            Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000
        );
    }

};