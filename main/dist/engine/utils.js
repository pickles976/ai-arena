import { ENERGY_SCALE } from '../config/gameConfig';
import { USER_CODE_MAX_SIZE } from '../config/engineConfig';
import { Vector2D } from './physics';
export var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
export var clamp = function (value, min, max) {
    return Math.min(Math.max(min, value), max);
};
export var energyDiff = function (thisObject, otherObject) {
    return ((ENERGY_SCALE *
        otherObject.transform.mass *
        Math.pow(thisObject.transform.velocity.subtract(otherObject.transform.velocity).magnitude, 2)) /
        2);
};
export var randomInRange = function (min, max) {
    return min + Math.random() * (max - min);
};
export var create_UUID = function () {
    return Math.floor(Math.random() * 10000000);
};
export var dist = function (obj1, obj2) {
    return Vector2D.dist(obj1.transform.position, obj2.transform.position);
};
export var checkMemory = function (obj) {
    var size = new TextEncoder().encode(JSON.stringify(obj)).length;
    var kiloBytes = size / 1024;
    if (kiloBytes > USER_CODE_MAX_SIZE) {
        console.log('You used up too much memory!');
        return true;
    }
    return false;
};
export var validVector = function (direction) {
    return (direction !== null &&
        direction !== undefined &&
        direction.type === 'VECTOR2D' &&
        direction instanceof Vector2D &&
        validNumber(direction.x) &&
        validNumber(direction.y) &&
        validNumber(direction.magnitude));
};
export var validNumber = function (num) {
    return num !== null && num !== undefined && !isNaN(+num);
};
//# sourceMappingURL=utils.js.map