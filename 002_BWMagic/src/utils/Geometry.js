
let Geometry = {

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
        return angle * (180 / Math.PI);
    },

    // https://stackoverflow.com/a/21484228
    getAngleBetweenVectors: function (v1, v2) {
        let angle = Math.atan2(v2[1], v2[0]) - Math.atan2(v1[1], v1[0]);
        angle = Math.abs((angle * (180 / Math.PI)));
        if (angle > 180) {
            return 360 - angle;
        } else {
            return angle;
        }

    },

    resizeVector:function (v, newLength) {
        let length = Math.sqrt(v[0]*v[0]+v[1]*v[1]);
        return [
            (v[0] / length) * newLength,
            (v[1] / length) * newLength
        ];
    },

    skaleVector:function (v, skale) {
        return [
            v[0] * skale,
            v[1] * skale
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
    },

    normalisePath: function (path, normaliseLength){
        return Geometry.moveAndSkalePath(path, 0, 0, normaliseLength);
    },

    moveAndSkalePath: function (path, newLeftTopX, newLeftTopY, newLenght) {

            let minX = Number.MAX_SAFE_INTEGER,
                maxX = Number.MIN_SAFE_INTEGER,
                minY = Number.MAX_SAFE_INTEGER,
                maxY = Number.MIN_SAFE_INTEGER;

            for (var i = 0; i < path.length; i++) {
                var p = path[i];
                if (p[0] < minX) { minX = p[0]; }
                if (p[0] > maxX) { maxX = p[0]; }
                if (p[1] < minY) { minY = p[1]; }
                if (p[1] > maxY) { maxY = p[1]; }
            }

            // move to 0, 0
            var dirTopLeft = [minX, minY];

            var newPath = [];

            for (var i = 0; i < path.length; i++) {
                newPath.push([
                    path[i][0] - dirTopLeft[0],
                    path[i][1] - dirTopLeft[1]
                ]);
            }

            // skale to new length
            let width = maxX - minX;
            let height = maxY - minY;

            let skaleValue = width > height ? newLenght / width : newLenght / height;

            for (var i = 0; i < path.length; i++) {
                newPath[i] = Geometry.skaleVector(newPath[i], skaleValue);
            }

            // move to new location
            for (var i = 0; i < path.length; i++) {
                newPath[i][0] += newLeftTopX;
                newPath[i][1] += newLeftTopY;
            }


            return newPath;
    },

    getDistance: function (v1, v2) {
        return Math.sqrt(
            Math.pow((v1[0]-v2[0]), 2)
            +
            Math.pow((v1[1]-v2[1]), 2)
        );
    },

    //https://stackoverflow.com/a/24392281
    intersects: function (a,b,c,d,p,q,r,s) {
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
          return false;
        } else {
          lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
          gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
          return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    },

    simplifyPath: function (path) {

        var newPath = [];

        newPath.push(path[0]);

        for (let i = 1; i < path.length - 1; i++) {
            let angle = Geometry.getAngleBetweenLines(path[i-1],path[i],path[i+1]);
            angle = angle % 360;
            angle = Math.abs(angle);
            let distance = Geometry.getDistance(path[i-1],path[i]);

            if (distance > Settings.simplifyPathMaxDistanceForRemoval) {
                newPath.push(path[i]);
            } else if (
                angle > Settings.simplifyPathMinAngle
                &&
                distance > Settings.simplifyPathMinDistance
            ) {
                newPath.push(path[i]);
            }
        }

        newPath.push(path[path.length-1]);

        return newPath;
    },

    isInCircle: function (p, middle, r) {
        return Math.pow(middle[0] - p[0], 2) + Math.pow(middle[1] - p[1], 2) < (r*r);
    }
};