var Field = /** @class */ (function () {
    function Field() {
        var _this = this;
        var _a;
        this.canvas = document.getElementById('canvas');
        this.ctx = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        this.temp_line = undefined;
        this.lines_arr = [];
        this.render_all = function () {
            var _a;
            (_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.render_lines();
            _this.render_intersect_points();
        };
        this.canvas.oncontextmenu = function () { return false; };
        console.log(this.canvas);
    }
    Field.prototype.render_point = function (point) {
        var _a, _b, _c, _d;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.arc(point.x, point.y, 5, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = 'red';
        (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.fill();
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.stroke();
    };
    Field.prototype.render_intersect_points = function () {
        for (var _i = 0, _a = this.lines_arr; _i < _a.length; _i++) {
            var line = _a[_i];
            for (var _b = 0, _c = line.intersect_point(); _b < _c.length; _b++) {
                var point = _c[_b];
                this.render_point(point);
            }
        }
    };
    Field.prototype.set_point = function (point) {
        if (this.temp_line) {
            this.temp_line.set_end(point);
            this.temp_line = undefined;
        }
        else {
            this.temp_line = new Line();
            this.lines_arr.push(this.temp_line);
            this.temp_line.set_start(point);
        }
    };
    Field.prototype.unset_line = function () {
        if (this.lines_arr.length != 0 && this.temp_line) {
            this.lines_arr.pop();
            this.temp_line = undefined;
            requestAnimationFrame(this.render_all);
        }
    };
    Field.prototype.render_temp_line = function (point) {
        if (this.temp_line) {
            this.temp_line.set_end(point);
            requestAnimationFrame(this.render_all);
        }
    };
    Field.prototype.render_lines = function () {
        var _a, _b, _c, _d;
        for (var _i = 0, _e = this.lines_arr; _i < _e.length; _i++) {
            var _f = _e[_i], start_coordinates = _f.start_coordinates, end_coordinates = _f.end_coordinates;
            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
            (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.moveTo(start_coordinates.x, start_coordinates.y);
            (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.lineTo(end_coordinates.x, end_coordinates.y);
            (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.stroke();
        }
    };
    Field.prototype.collapse = function (line) {
        var _this = this;
        var _a = line, start_coordinates = _a.start_coordinates, end_coordinates = _a.end_coordinates;
        var x1, x2, y1, y2, tStart = 0, tEnd = 1;
        var inter = setInterval(function () {
            if (tStart.toFixed(2) == '0.50' || tEnd.toFixed(2) == '0.50') {
                clearInterval(inter);
                console.log(Date.now() - start_time, "3 sec tipa");
                _this.lines_arr.shift();
            }
            tStart += 0.001;
            tEnd -= 0.001;
            x1 = lerp(start_coordinates.x, end_coordinates.x, tStart);
            x2 = lerp(start_coordinates.x, end_coordinates.x, tEnd);
            y1 = lerp(start_coordinates.y, end_coordinates.y, tStart);
            y2 = lerp(start_coordinates.y, end_coordinates.y, tEnd);
            line === null || line === void 0 ? void 0 : line.set_start({ x: x1, y: y1 });
            line === null || line === void 0 ? void 0 : line.set_end({ x: x2, y: y2 });
            requestAnimationFrame(_this.render_all);
        }, 6);
    };
    Field.prototype.collapse_lines = function () {
        for (var _i = 0, _a = this.lines_arr; _i < _a.length; _i++) {
            var line = _a[_i];
            this.collapse(line);
        }
    };
    return Field;
}());
var Line = /** @class */ (function () {
    function Line() {
    }
    Line.prototype.set_start = function (point) {
        this.start_coordinates = point;
    };
    Line.prototype.set_end = function (point) {
        this.end_coordinates = point;
    };
    Line.prototype.intersect_point = function () {
        var points = [];
        var tTop, uTop, bottom, t, u;
        for (var _i = 0, _a = field.lines_arr; _i < _a.length; _i++) {
            var line = _a[_i];
            tTop = (line.end_coordinates.x - line.start_coordinates.x) * (this.start_coordinates.y - line.start_coordinates.y) - (line.end_coordinates.y - line.start_coordinates.y) * (this.start_coordinates.x - line.start_coordinates.x);
            uTop = (line.start_coordinates.y - this.start_coordinates.y) * (this.start_coordinates.x - this.end_coordinates.x) - (line.start_coordinates.x - this.start_coordinates.x) * (this.start_coordinates.y - this.end_coordinates.y);
            bottom = (line.end_coordinates.y - line.start_coordinates.y) * (this.end_coordinates.x - this.start_coordinates.x) - (line.end_coordinates.x - line.start_coordinates.x) * (this.end_coordinates.y - this.start_coordinates.y);
            if (bottom != 0) {
                t = tTop / bottom;
                u = uTop / bottom;
                if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
                    points.push({ x: lerp(this.start_coordinates.x, this.end_coordinates.x, t), y: lerp(this.start_coordinates.y, this.end_coordinates.y, t) });
                }
            }
        }
        return points;
    };
    return Line;
}());
function lerp(A, B, t) {
    return A + (B - A) * t;
}
var field = new Field();
var start_time = 0;
field.canvas.addEventListener("click", function (event) {
    field.set_point({ x: event.offsetX, y: event.offsetY });
}, false);
field.canvas.addEventListener("contextmenu", function (event) {
    field.unset_line();
}, false);
field.canvas.addEventListener("mousemove", function (event) {
    field.render_temp_line({ x: event.offsetX, y: event.offsetY });
}, false);
document.getElementById('button').onclick = function () { start_time = Date.now(); field.collapse_lines(); };
