var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { H, VELOCITY_FACTOR, W } from '../config/engineConfig';
var Vector2D = (function () {
    function Vector2D(x, y) {
        this.type = 'VECTOR2D';
        this.x = x;
        this.y = y;
        this.magnitude = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
    }
    Vector2D.prototype.add = function (newVector) {
        return new Vector2D(this.x + newVector.x, this.y + newVector.y);
    };
    Vector2D.prototype.subtract = function (newVector) {
        return new Vector2D(this.x - newVector.x, this.y - newVector.y);
    };
    Vector2D.prototype.multiply = function (scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    };
    Vector2D.prototype.divide = function (scalar) {
        return new Vector2D(this.x / scalar, this.y / scalar);
    };
    Vector2D.prototype.dot = function (newVector) {
        return this.x * newVector.x + this.y * newVector.y;
    };
    Vector2D.prototype.normal = function () {
        return new Vector2D(this.x / this.magnitude, this.y / this.magnitude);
    };
    Vector2D.prototype.copy = function () {
        return new Vector2D(this.x, this.y);
    };
    Vector2D.prototype.rotate = function (degrees) {
        var rad = (Math.PI * degrees) / 180;
        var rotX = this.x * Math.cos(rad) - this.y * Math.sin(rad);
        var rotY = this.x * Math.sin(rad) + this.y * Math.cos(rad);
        return new Vector2D(rotX, rotY);
    };
    Vector2D.random = function () {
        return new Vector2D(Math.random() - 0.5, Math.random() - 0.5).normal();
    };
    Vector2D.dist = function (v1, v2) {
        return v1.subtract(v2).magnitude;
    };
    Vector2D.prototype.serialize = function () {
        return JSON.stringify([this.type, parseFloat(this.x.toFixed(4)), parseFloat(this.y.toFixed(4))]);
    };
    Vector2D.prototype.packet = function () {
        return [this.x, this.y];
    };
    return Vector2D;
}());
export { Vector2D };
var Transform = (function () {
    function Transform(mass, position, velocity) {
        this.type = 'TRANSFORM';
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector2D(0, 0);
    }
    Transform.prototype.simulate = function (deltaTime) {
        this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime).divide(VELOCITY_FACTOR));
        this.acceleration = new Vector2D(0, 0);
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        if (this.position.x < 0) {
            this.position.x += W;
        }
        if (this.position.y < 0) {
            this.position.y += H;
        }
        this.position.x = this.position.x % W;
        this.position.y = this.position.y % H;
    };
    Transform.prototype.serialize = function () {
        return JSON.stringify([this.type, this.mass, this.position.serialize(), this.velocity.serialize()]);
    };
    Transform.prototype.packet = function () {
        return __spreadArray(__spreadArray([this.mass], this.position.packet(), true), this.velocity.packet(), true);
    };
    return Transform;
}());
export { Transform };
var Collider = (function () {
    function Collider(radius) {
        this.type = 'COLLIDER';
        this.radius = radius;
    }
    Collider.prototype.serialize = function () {
        return JSON.stringify([2, this.radius.toFixed(1)]);
    };
    return Collider;
}());
export { Collider };
//# sourceMappingURL=physics.js.map