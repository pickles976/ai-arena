var GameObject = (function () {
    function GameObject(uuid, type, transform, collider) {
        this.uuid = uuid;
        this.type = type;
        this.transform = transform;
        this.collider = collider;
    }
    GameObject.prototype.destroy = function () {
        this.type = 'DEAD';
    };
    GameObject.prototype.simulate = function (deltaTime) {
        this.transform.simulate(deltaTime);
    };
    GameObject.prototype.render = function (renderer) { };
    GameObject.prototype.collide = function (otherObject) { };
    GameObject.prototype.serialize = function () { };
    GameObject.prototype.packet = function () {
        return [];
    };
    return GameObject;
}());
export { GameObject };
//# sourceMappingURL=gameObject.js.map