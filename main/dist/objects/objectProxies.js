import { Serializer } from '../managers/serializer';
var ProxyMan = (function () {
    function ProxyMan() {
    }
    ProxyMan.createRendererProxy = function (renderer) {
        var whiteList = ['drawText', 'drawLine', 'drawCircle', 'drawCircleTransparent'];
        var rendererHandler = {
            get: function (target, prop) {
                var field = Reflect.get(target, prop);
                if (whiteList.includes(prop)) {
                    if (typeof field === 'function') {
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return field.apply(target, args);
                        };
                    }
                    else {
                        return field;
                    }
                }
                return null;
            },
            set: function (target, prop, value, receiver) {
                return false;
            },
            deleteProperty: function (target, prop) {
                return false;
            },
            defineProperty: function (target, prop, attributes) {
                return false;
            },
        };
        return new Proxy(renderer, rendererHandler);
    };
    ProxyMan.createGameObjectProxy = function (gameObject) {
        var grayList = ['transform', 'collider', 'resources'];
        var blackList = [
            'spawnShip',
            'upgradeInteractRadius',
            'upgradeHealRate',
            'upgradeMaxEnergy',
            'update',
            'start',
            'serialize',
            'queueShip',
            'trySpawnShip',
            'takeResources',
            'healShip',
            'destroy',
            'render',
            'collide',
            'simulate',
            'shipQueue',
            'moveTo',
            'seekTarget',
            'upgradeDamage',
            'shoot',
            'applyThrust',
            'breakup',
            'totalMass',
            'getResources',
            'toString',
            'colors',
        ];
        var gameObjectHandler = {
            get: function (target, prop) {
                var field = Reflect.get(target, prop);
                if (grayList.includes(prop)) {
                    return Serializer.deserialize(field.serialize());
                }
                else if (!blackList.includes(prop)) {
                    return field;
                }
                return null;
            },
            set: function (target, prop, value, receiver) {
                return false;
            },
            deleteProperty: function (target, prop) {
                return false;
            },
            defineProperty: function (target, prop, attributes) {
                return false;
            },
        };
        return new Proxy(gameObject, gameObjectHandler);
    };
    ProxyMan.createShipProxy = function (ship) {
        var whiteList = [
            'uuid',
            'team',
            'maxEnergy',
            'damage',
            'upgradeMaxEnergyCost',
            'upgradeDamageCost',
            'upgradeMaxEnergy',
            'upgradeDamage',
            'seekTarget',
            'moveTo',
            'shoot',
        ];
        var grayList = ['transform', 'collider', 'resources'];
        var blackList = [
            'simulate',
            'render',
            'getResources',
            'collide',
            'totalMass',
            'destroy',
            'toString',
            'serialize',
            'createProxy',
            'start',
            'update',
        ];
        var shipHandler = {
            get: function (target, prop) {
                var field = Reflect.get(target, prop);
                if (grayList.includes(prop)) {
                    return Serializer.deserialize(field.serialize());
                }
                else if (!blackList.includes(prop)) {
                    if (typeof field === 'function') {
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return field.apply(target, args);
                        };
                    }
                    else {
                        return field;
                    }
                }
                return null;
            },
            set: function (target, prop, value, receiver) {
                if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop)) {
                    Reflect.set(target, prop, value, receiver);
                    return true;
                }
                return false;
            },
            deleteProperty: function (target, prop) {
                return false;
            },
            defineProperty: function (target, prop, attributes) {
                if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop)) {
                    Reflect.defineProperty(target, prop, attributes);
                    return true;
                }
                return false;
            },
        };
        return new Proxy(ship, shipHandler);
    };
    ProxyMan.createBaseProxy = function (base) {
        var whiteList = [
            'uuid',
            'team',
            'health',
            'shipCost',
            'spawnShip',
            'healRate',
            'upgradeHealRateCost',
            'upgradeHealRate',
            'maxEnergy',
            'upgradeMaxEnergyCost',
            'upgradeMaxEnergy',
            'refiningRate',
            'upgradeRefiningRateCost',
            'upgradeRefiningRate',
            'interactRadius',
            'upgradeInteractRadiusCost',
            'upgradeInteractRadius',
            'refiningEfficiency',
            'upgradeRefiningEfficiencyCost',
            'upgradeRefiningEfficiency',
            'repairRate',
            'upgradeRepairRateCost',
            'upgradeRepairRate',
            'maxHealth',
            'upgradeMaxHealthCost',
            'upgradeMaxHealth',
        ];
        var grayList = ['transform', 'collider', 'resources'];
        var blackList = [
            'shipQueue',
            'simulate',
            'collide',
            'render',
            'destroy',
            'healShip',
            'takeResources',
            'trySpawnShip',
            'queueShip',
            'serialize',
            'createProxy',
            'start',
            'update',
        ];
        var baseHandler = {
            get: function (target, prop) {
                if (grayList.includes(prop)) {
                    return Serializer.deserialize(Reflect.get(target, prop).serialize());
                }
                else if (!blackList.includes(prop)) {
                    var field = target[prop];
                    if (typeof field === 'function') {
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return target[prop].apply(target, args);
                        };
                    }
                    else {
                        return field;
                    }
                }
                return null;
            },
            set: function (target, prop, value, receiver) {
                if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop)) {
                    Reflect.set(target, prop, value, receiver);
                    return true;
                }
                return false;
            },
            deleteProperty: function (target, prop) {
                return false;
            },
            defineProperty: function (target, prop, attributes) {
                if (!blackList.includes(prop) && !grayList.includes(prop) && !whiteList.includes(prop)) {
                    Reflect.defineProperty(target, prop, attributes);
                    return true;
                }
                return false;
            },
        };
        return new Proxy(base, baseHandler);
    };
    ProxyMan.createObjectManagerProxy = function (gameManager) {
        var whiteList = [
            'H',
            'W',
            'getAsteroids',
            'getClosestAsteroid',
            'getObstacle',
            'getClosestObstacle',
            'getEnergyCells',
            'getClosestEnergyCell',
            'getShips',
            'getShipsByTeam',
            'getBullets',
            'getBases',
            'getBaseByTeam',
        ];
        var gameManagerHandler = {
            get: function (target, prop) {
                if (whiteList.includes(prop)) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var items = Reflect.get(target, prop).apply(target, args);
                        if (Object.prototype.toString.call(items) === '[object Array]') {
                            items = items.map(function (item) { return ProxyMan.createGameObjectProxy(item); });
                        }
                        else {
                            items = ProxyMan.createGameObjectProxy(items);
                        }
                        return items;
                    };
                }
                return null;
            },
            set: function (target, prop, value, receiver) {
                return false;
            },
            deleteProperty: function (target, p) {
                return false;
            },
            defineProperty: function (target, propery, attributes) {
                return false;
            },
        };
        return new Proxy(gameManager, gameManagerHandler);
    };
    return ProxyMan;
}());
export { ProxyMan };
//# sourceMappingURL=objectProxies.js.map