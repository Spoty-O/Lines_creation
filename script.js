var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Field = /** @class */ (function () {
    function Field() {
        var _a;
        this.canvas = document.getElementById('canvas');
        this.ctx = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        this.temp_line = null;
        this.lines_arr = [];
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
    Field.prototype.render_intersect_points = function (point_coor) {
        if (point_coor === void 0) { point_coor = undefined; }
        for (var _i = 0, _a = this.lines_arr; _i < _a.length; _i++) {
            var line = _a[_i];
            for (var _b = 0, _c = line.intersect_point(point_coor); _b < _c.length; _b++) {
                var point = _c[_b];
                this.render_point(point);
            }
        }
    };
    Field.prototype.set_point = function (point) {
        if (this.temp_line) {
            this.temp_line.set_end(point.x, point.y);
            this.lines_arr.push(this.temp_line);
            this.temp_line = null;
        }
        else {
            this.temp_line = new Line();
            this.temp_line.set_start(point.x, point.y);
        }
        this.render_all();
    };
    Field.prototype.render_temp_line = function (point) {
        if (this.temp_line) {
            this.render_all();
            this.render_line(this.temp_line.start_coordinates, point);
            this.render_intersect_points(point);
        }
    };
    Field.prototype.render_line = function (start_point, end_point) {
        var _a, _b, _c, _d;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.moveTo(start_point.x, start_point.y);
        (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.lineTo(end_point.x, end_point.y);
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.stroke();
    };
    Field.prototype.render_all = function () {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var _i = 0, _b = this.lines_arr; _i < _b.length; _i++) {
            var line = _b[_i];
            this.render_line(line.start_coordinates, line.end_coordinates);
        }
        this.render_intersect_points();
    };
    return Field;
}());
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.set_start = function (x, y) {
        this.start_coordinates = new Point(x, y);
    };
    Line.prototype.set_end = function (x, y) {
        this.end_coordinates = new Point(x, y);
    };
    Line.prototype.intersec_check = function (a, b, c, d) {
        var common = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
        if (common == 0)
            return false;
        var rH = (a.y - c.y) * (d.x - c.x) - (a.x - c.x) * (d.y - c.y);
        var sH = (a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y);
        var r = rH / common;
        var s = sH / common;
        if (r >= 0 && r <= 1 && s >= 0 && s <= 1)
            return true;
        else
            return false;
    };
    Line.prototype.intersect_point = function (end_point) {
        if (end_point === void 0) { end_point = this.end_coordinates; }
        var points = [];
        var a1, b1, c1, a2, b2, c2, det, x, y;
        if (end_point) {
            for (var _i = 0, _a = field.lines_arr; _i < _a.length; _i++) {
                var line = _a[_i];
                if (this.intersec_check(this.start_coordinates, end_point, line.start_coordinates, line.end_coordinates) == true) {
                    console.log(this.start_coordinates, end_point, line.start_coordinates, line.end_coordinates);
                    a1 = this.start_coordinates.y - end_point.y;
                    b1 = this.end_coordinates.x - this.start_coordinates.x;
                    c1 = this.start_coordinates.x * end_point.y - end_point.x * this.start_coordinates.y;
                    a2 = line.start_coordinates.y - line.end_coordinates.y;
                    b2 = line.end_coordinates.x - line.start_coordinates.x;
                    c2 = line.start_coordinates.x * line.end_coordinates.y - line.end_coordinates.x * line.start_coordinates.y;
                    det = a1 * b2 - a2 * b1;
                    x = (b1 * c2 - b2 * c1) / det;
                    y = (a2 * c1 - a1 * c2) / det;
                    points.push(new Point(x, y));
                }
            }
        }
        return points;
    };
    return Line;
}(Field));
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var field = new Field();
field.canvas.addEventListener("click", function (event) {
    field.set_point(new Point(event.offsetX, event.offsetY));
}, false);
field.canvas.addEventListener("mousemove", function (event) {
    field.render_temp_line(new Point(event.offsetX, event.offsetY));
}, false);
