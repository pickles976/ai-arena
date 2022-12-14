/**
 * https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/
 */
const sandboxProxies = new WeakMap();

export const compileCode = function (src) {
    try {
        src = 'with (sandbox) {' + src + '}';
        const code = new Function('sandbox', src);

        return function (sandbox) {
            if (!sandboxProxies.has(sandbox)) {
                const sandboxProxy = new Proxy(sandbox, { has, get });
                sandboxProxies.set(sandbox, sandboxProxy);
            }
            return code(sandboxProxies.get(sandbox));
        };
    } catch (e) {
        alert(`Code failed to compile: \n Error: ${e}`);
    }
};

const has = function (target, key) {
    return true;
};

const get = function (target, key) {
    if (key === Symbol.unscopables) return undefined;
    return target[key];
};
