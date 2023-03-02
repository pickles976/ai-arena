var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { Asteroid, Base, Bullet, EnergyCell, Obstacle, Resources, Ship } from "../objects/objects";
import { Collider, Transform, Vector2D } from "../engine/physics";
import { create_UUID } from "../engine/utils";
var Serializer = (function () {
    function Serializer() {
    }
    Serializer.packetifyGameObjectList = function (gol) {
        var tempList = [];
        for (var i in gol) {
            tempList = tempList.concat(gol[i].packet());
        }
        return Float32Array.from(tempList);
    };
    Serializer.serializeGameObjectList = function (gol) {
        var tempList = [];
        for (var i in gol) {
            tempList.push(gol[i].serialize());
        }
        return JSON.stringify(tempList);
    };
    Serializer.deserializeGameObjectList = function (str) {
        var list = JSON.parse(str);
        return list.map(function (item) { return Serializer.deserialize(item); });
    };
    Serializer.deserialize = function (str) {
        var list = JSON.parse(str);
        return this.listToObj(list);
    };
    Serializer.listToObj = function (list) {
        if (list !== undefined && list !== null && list.slice !== undefined) {
            var args = list.slice(1);
            for (var i in args) {
                args[i] = Serializer.deserialize(args[i]);
            }
            switch (list[0]) {
                case "VECTOR2D":
                    return new (Vector2D.bind.apply(Vector2D, __spreadArray([void 0], args, false)))();
                case "TRANSFORM":
                    return new (Transform.bind.apply(Transform, __spreadArray([void 0], args, false)))();
                case "COLLIDER":
                    return new (Collider.bind.apply(Collider, __spreadArray([void 0], args, false)))();
                case "RESOURCES":
                    return new (Resources.bind.apply(Resources, __spreadArray([void 0], args, false)))();
                case "ASTEROID":
                    return new (Asteroid.bind.apply(Asteroid, __spreadArray([void 0], args, false)))();
                case "OBSTACLE":
                    return new (Obstacle.bind.apply(Obstacle, __spreadArray([void 0], args, false)))();
                case "ENERGY_CELL":
                    return new (EnergyCell.bind.apply(EnergyCell, __spreadArray([void 0], args, false)))();
                case "SHIP":
                    return new (Ship.bind.apply(Ship, __spreadArray([void 0], args, false)))();
                case "BULLET":
                    return new (Bullet.bind.apply(Bullet, __spreadArray([void 0], args, false)))();
                case "BASE":
                    return new (Base.bind.apply(Base, __spreadArray([void 0], args, false)))();
                case "DEAD":
                    return null;
                default:
                    return list;
            }
        }
        return list;
    };
    Serializer.unpacketify = function (arr) {
        var goList = [];
        if (arr !== undefined && arr !== null && arr.slice !== undefined) {
            var arrCopy = Array.from(arr);
            var end = 0;
            while (arrCopy.length > 0) {
                switch (arrCopy[0]) {
                    case 0:
                        end = 7;
                        goList.push(new Asteroid(arrCopy[1], new Vector2D(arrCopy[2], arrCopy[3]), new Vector2D(arrCopy[4], arrCopy[5]), arrCopy[6], arrCopy[7]));
                        break;
                    case 1:
                        end = 6;
                        goList.push(new Obstacle(arrCopy[1], new Vector2D(arrCopy[2], arrCopy[3]), new Vector2D(arrCopy[4], arrCopy[5]), arrCopy[6]));
                        break;
                    case 2:
                        end = 6;
                        goList.push(new EnergyCell(arrCopy[1], new Vector2D(arrCopy[2], arrCopy[3]), new Vector2D(arrCopy[4], arrCopy[5]), arrCopy[6]));
                        break;
                    case 3:
                        end = 9;
                        goList.push(new Ship(arrCopy[1], new Vector2D(arrCopy[2], arrCopy[3]), new Vector2D(arrCopy[4], arrCopy[5]), new Vector2D(arrCopy[6], arrCopy[7]), arrCopy[8], arrCopy[9]));
                        break;
                    case 4:
                        end = 7;
                        goList.push(new Bullet(arrCopy[1], new Vector2D(arrCopy[2], arrCopy[3]), new Vector2D(arrCopy[4], arrCopy[5]), arrCopy[6], arrCopy[7]));
                        break;
                    case 5:
                        end = 5;
                        goList.push(new Base(arrCopy[1], new Vector2D(arrCopy[2], arrCopy[3]), arrCopy[4], arrCopy[5]));
                        break;
                    default:
                        end = 1;
                }
                arrCopy.splice(0, end + 1);
            }
        }
        return goList;
    };
    Serializer.test = function () {
        var vec = new Vector2D(1.25312324, 3.152);
        var asteroid = new Asteroid(create_UUID(), vec, vec, 100, 20);
        var obstacle = new Obstacle(create_UUID(), vec, vec, 100);
        var energyCell = new EnergyCell(create_UUID(), vec, vec, 20);
        var ship = new Ship(create_UUID(), vec, new Vector2D(0, 0), new Vector2D(0, 0), 20, 0);
        var parentUUID = create_UUID();
        var bullet = new Bullet(create_UUID(), vec, vec, 20, parentUUID);
        var base = new Base(create_UUID(), vec, 20, 0);
        var goArr = [asteroid, obstacle, energyCell, ship, bullet, base];
        var strings = Serializer.deserializeGameObjectList(Serializer.serializeGameObjectList(goArr));
        for (var i in strings) {
            if (strings[i].serialize() !== goArr[i].serialize()) {
                console.log("Serialization failed!");
                console.log(goArr[i]);
                console.log(strings[i]);
            }
        }
        var packets = Serializer.unpacketify(Serializer.packetifyGameObjectList(goArr));
        for (var i in packets) {
            if (packets[i].serialize() !== goArr[i].serialize()) {
                console.log("Packetification failed!");
                console.log(goArr[i]);
                console.log(packets[i]);
            }
        }
    };
    return Serializer;
}());
export { Serializer };
//# sourceMappingURL=serializer.js.map