import { GameObjectList, GlobalRender, H, resetGameState, W, xArray } from '../config/engineConfig';
import { Vector2D } from './physics';
import { validNumber, validVector } from './utils';
export var checkForCollisions = function (gameObjArray) {
    var i = 0;
    var pairs = [];
    while (i < gameObjArray.length) {
        var c1 = gameObjArray[i].transform;
        var r1 = gameObjArray[i].collider.radius;
        var j = 1;
        var collision = true;
        while (collision) {
            collision = false;
            var index = i - j;
            if (index < 0) {
                index += gameObjArray.length;
            }
            var c2 = gameObjArray[index].transform;
            var r2 = gameObjArray[index].collider.radius;
            var dist = 100000;
            if (index < i) {
                dist = c1.position.x - c2.position.x;
            }
            else {
                dist = c1.position.x + W - c2.position.x;
            }
            if (Math.abs(dist) < r1 + r2) {
                pairs.push([gameObjArray[i], gameObjArray[index]]);
                collision = true;
            }
            j++;
        }
        i++;
    }
    i = 0;
    while (i < pairs.length) {
        var obj1 = pairs[i][0];
        var obj2 = pairs[i][1];
        if (obj1.type !== 'DEAD' && obj2.type !== 'DEAD') {
            var c1 = obj1.transform;
            var r1 = obj1.collider.radius;
            var c2 = obj2.transform;
            var r2 = obj2.collider.radius;
            var c1Pos = c1.position;
            var c2Pos = c2.position;
            if (c1.position.x < c2.position.x) {
                c2Pos = new Vector2D(c2.position.x - W, c2.position.y);
            }
            var dist = c1Pos.subtract(c2Pos).magnitude;
            if (dist > r1 + r2) {
                var tempC2 = c2Pos.copy();
                if (c1.position.y < c2.position.y) {
                    tempC2.y -= H;
                }
                else {
                    tempC2.y += H;
                }
                var tempDist = c1Pos.subtract(tempC2).magnitude;
                if (tempDist < r1 + r2) {
                    dist = tempDist;
                    c2Pos = tempC2;
                }
            }
            if (dist < r1 + r2) {
                var newVelocities = collide(c1Pos, c2Pos, c1.velocity, c2.velocity, c1.mass, c2.mass);
                obj1.collide(obj2);
                obj2.collide(obj1);
                c1.velocity = newVelocities[0];
                c2.velocity = newVelocities[1];
            }
        }
        i++;
    }
};
var collide = function (p1, p2, v1, v2, m1, m2) {
    var e = 0.15;
    var oomf = 0.001;
    var collisionNormal = p1.subtract(p2).normal();
    var vRel = v1.subtract(v2);
    var tVel = -collisionNormal.dot(vRel.multiply(1 + e));
    var impulse = tVel / (1.0 / m1 + 1.0 / m2);
    var delta1 = collisionNormal.multiply(impulse / m1 + oomf);
    var delta2 = collisionNormal.multiply(impulse / m2 + oomf);
    return [v1.add(delta1), v2.subtract(delta2)];
};
export var overlapCircle = function (position, radius) {
    if (validVector(position) && validNumber(radius)) {
        if (xArray.length <= 0) {
            return [];
        }
        var i = binarySearch(xArray, position.x);
        var possible = [];
        var collision = true;
        var j = 1;
        while (collision) {
            collision = false;
            var index = i - j;
            if (index < 0) {
                index += GameObjectList.length;
            }
            var c2 = GameObjectList[index].transform;
            var r2 = GameObjectList[index].collider.radius;
            var dist = 100000;
            if (index < i) {
                dist = position.x - c2.position.x;
            }
            else {
                dist = position.x + W - c2.position.x;
            }
            if (Math.abs(dist) < radius + r2) {
                possible.push(GameObjectList[index]);
                collision = true;
            }
            j++;
        }
        collision = true;
        j = 0;
        while (collision) {
            collision = false;
            var index = i + j;
            if (index >= GameObjectList.length) {
                index -= GameObjectList.length;
            }
            var c2 = GameObjectList[index].transform;
            var r2 = GameObjectList[index].collider.radius;
            var dist = 100000;
            if (index >= i) {
                dist = position.x - c2.position.x;
            }
            else {
                dist = position.x + W - c2.position.x;
            }
            if (Math.abs(dist) < radius + r2) {
                possible.push(GameObjectList[index]);
                collision = true;
            }
            j++;
        }
        var collisions = [];
        var k = 0;
        while (k < possible.length) {
            var obj = possible[k];
            var c2 = obj.transform;
            var r2 = obj.collider.radius;
            var c2Pos = c2.position;
            if (position.x < c2.position.x) {
                c2Pos = new Vector2D(c2.position.x - W, c2.position.y);
            }
            var dist = position.subtract(c2Pos).magnitude;
            if (dist > radius + r2) {
                var tempC2 = c2Pos.copy();
                if (position.y < c2.position.y) {
                    tempC2.y -= H;
                }
                else {
                    tempC2.y += H;
                }
                var tempDist = position.subtract(tempC2).magnitude;
                if (tempDist < radius + r2) {
                    dist = tempDist;
                    c2Pos = tempC2;
                }
            }
            if (dist < radius + r2) {
                collisions.push(obj);
            }
            k++;
        }
        var debug = false;
        if (debug) {
            var color_1 = 'rgba(255, 255, 0, 0.5)';
            GlobalRender.drawCircle(position, radius, color_1);
            possible.map(function (c) {
                GlobalRender.drawLine(position, c.transform.position, 'rgba(255, 255, 255, 0.5)');
            });
            collisions.map(function (c) {
                GlobalRender.drawLine(position, c.transform.position, color_1);
            });
        }
        return collisions;
    }
    alert("Invalid input for OverlapCircle! \n Position: ".concat(position.toString(), " Radius: ").concat(radius.toString()));
    resetGameState();
    return [];
};
var binarySearch = function (array, k) {
    var start = 0;
    var end = array.length - 1;
    while (start <= end) {
        var mid = Math.floor((start + end) / 2);
        if (array[mid] == k)
            return mid;
        else if (array[mid] < k)
            start = mid + 1;
        else
            end = mid - 1;
    }
    return end + 1;
};
//# sourceMappingURL=collisions.js.map