var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { backgroundColor, H, RenderQueue, W } from '../config/engineConfig';
var Renderer = (function () {
    function Renderer(H, W, canvas) {
        var _a;
        this.H = H;
        this.W = W;
        this.ctx = (_a = canvas.getContext('2d')) !== null && _a !== void 0 ? _a : new CanvasRenderingContext2D();
    }
    Renderer.prototype.queueAction = function (action, layer, kwargs) {
        if (layer in RenderQueue) {
            RenderQueue[layer].push(action.apply(void 0, kwargs));
        }
        else {
            RenderQueue[layer] = [action.apply(void 0, kwargs)];
        }
    };
    Renderer.prototype.newFrame = function () {
        function newFrameCoroutine(self) {
            return __generator(this, function (_a) {
                self.ctx.fillStyle = backgroundColor;
                self.ctx.fillRect(0, 0, W, H);
                return [2];
            });
        }
        this.queueAction(newFrameCoroutine, 0, [this]);
    };
    Renderer.prototype.drawText = function (text, position, size, color) {
        function drawTextCoroutine(self, text, position, size, color) {
            var ctx;
            return __generator(this, function (_a) {
                ctx = self.ctx;
                ctx.fillStyle = color;
                ctx.font = size + 'px sans-serif';
                ctx.fillText(text, position.x, position.y);
                return [2];
            });
        }
        this.queueAction(drawTextCoroutine, 5, [this, text, position, size, color]);
    };
    Renderer.prototype.drawLine = function (start, end, color) {
        function drawLineCoroutine(self, start, end, color) {
            var ctx;
            return __generator(this, function (_a) {
                ctx = self.ctx;
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                return [2];
            });
        }
        this.queueAction(drawLineCoroutine, 5, [this, start, end, color]);
    };
    Renderer.prototype.drawCircleTransparent = function (pos, radius, color, opacity) {
        this.ctx.globalAlpha = opacity;
        this.drawCircle(pos, radius, color);
        this.ctx.globalAlpha = 1.0;
    };
    Renderer.prototype.drawCircle = function (pos, radius, color) {
        function drawCircleCoroutine(self, pos, radius, color) {
            var ctx, newX, newY, wraparound;
            return __generator(this, function (_a) {
                ctx = self.ctx;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
                ctx.fill();
                newX = pos.x;
                newY = pos.y;
                wraparound = false;
                if (pos.x + radius > W) {
                    newX = pos.x - W;
                    wraparound = true;
                }
                else if (pos.x - radius < 0) {
                    newX = pos.x + W;
                    wraparound = true;
                }
                if (pos.y + radius > H) {
                    newY = pos.y - H;
                    wraparound = true;
                }
                else if (pos.y - radius < 0) {
                    newY = pos.y + H;
                    wraparound = true;
                }
                if (wraparound) {
                    ctx.beginPath();
                    ctx.arc(newX, newY, radius, 0, 2 * Math.PI);
                    ctx.fill();
                }
                return [2];
            });
        }
        this.queueAction(drawCircleCoroutine, 3, [this, pos, radius, color]);
    };
    Renderer.prototype.drawArc = function (pos, radius, start, end, color) {
        function drawArcCoroutine(self, pos, radius, start, end, color) {
            var ctx, newX, newY, wraparound;
            return __generator(this, function (_a) {
                ctx = self.ctx;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, start, end);
                ctx.lineWidth = 4;
                ctx.stroke();
                newX = pos.x;
                newY = pos.y;
                wraparound = false;
                if (pos.x + radius > W) {
                    newX = pos.x - W;
                    wraparound = true;
                }
                else if (pos.x - radius < 0) {
                    newX = pos.x + W;
                    wraparound = true;
                }
                if (pos.y + radius > H) {
                    newY = pos.y - H;
                    wraparound = true;
                }
                else if (pos.y - radius < 0) {
                    newY = pos.y + H;
                    wraparound = true;
                }
                if (wraparound) {
                    ctx.beginPath();
                    ctx.arc(newX, newY, radius, 0, 2 * Math.PI);
                    ctx.fill();
                }
                return [2];
            });
        }
        this.queueAction(drawArcCoroutine, 2, [this, pos, radius, start, end, color]);
    };
    Renderer.prototype.drawExhaust = function (position, rotation, scale) {
        function drawExhaustCoroutine(self, position, rotation, scale) {
            var ctx;
            return __generator(this, function (_a) {
                ctx = self.ctx;
                ctx.fillStyle = '#FFFFFF';
                ctx.save();
                ctx.translate(position.x, position.y);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.beginPath();
                ctx.moveTo(-5 * scale, 10);
                ctx.lineTo(0, 10 + 15 * scale);
                ctx.lineTo(5 * scale, 10);
                ctx.fill();
                ctx.restore();
                return [2];
            });
        }
        this.queueAction(drawExhaustCoroutine, 2, [this, position, rotation, scale]);
    };
    return Renderer;
}());
export { Renderer };
//# sourceMappingURL=renderer.js.map