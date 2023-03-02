var sandboxProxies = new WeakMap();
export var compileCode = function (src) {
    try {
        src = 'with (sandbox) {' + src + '}';
        var code_1 = new Function('sandbox', src);
        return function (sandbox) {
            if (!sandboxProxies.has(sandbox)) {
                var sandboxProxy = new Proxy(sandbox, { has: has, get: get });
                sandboxProxies.set(sandbox, sandboxProxy);
            }
            return code_1(sandboxProxies.get(sandbox));
        };
    }
    catch (e) {
        alert("Code failed to compile: \n Error: ".concat(e));
    }
};
var has = function (target, key) {
    return true;
};
var get = function (target, key) {
    if (key === Symbol.unscopables)
        return undefined;
    return target[key];
};
//# sourceMappingURL=safeEval.js.map