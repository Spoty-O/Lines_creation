class Field {
    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    ctx: CanvasRenderingContext2D | null = this.canvas?.getContext('2d');
    temp_line: Line | null = null;
    lines_arr: Line[] = [];

    constructor() {
        console.log(this.canvas)
    }

    render_point(point: Point): void {
        this.ctx?.beginPath();
        this.ctx?.arc(point.x, point.y, 5, 0, 2 * Math.PI, true);
        this.ctx!.fillStyle = 'red';
        this.ctx?.fill();
        this.ctx?.stroke();
    }

    render_intersect_points(point_coor: Point | undefined = undefined): void {
        for (let line of this.lines_arr) {
            for (let point of line.intersect_point(point_coor)) {
                this.render_point(point);
            }
        }
    }

    set_point(point: Point): void {
        if (this.temp_line) {
            this.temp_line.set_end(point.x, point.y);
            this.lines_arr.push(this.temp_line);
            this.temp_line = null;
        } else {
            this.temp_line = new Line();
            this.temp_line.set_start(point.x, point.y);
        }
        this.render_all();
    }

    render_temp_line(point: Point): void {
        if (this.temp_line) {
            this.render_all();
            this.render_line(this.temp_line.start_coordinates, point);
            this.render_intersect_points(point);
        }
    }

    render_line(start_point: Point, end_point: Point): void {
        this.ctx?.beginPath();
        this.ctx?.moveTo(start_point.x, start_point.y);
        this.ctx?.lineTo(end_point.x, end_point.y);
        this.ctx?.stroke();
    }

    render_all(): void {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let line of this.lines_arr) {
            this.render_line(line.start_coordinates, line.end_coordinates);
        }
        this.render_intersect_points();
    }
}

class Line extends Field {
    start_coordinates: Point;
    end_coordinates: Point;

    set_start(x: number, y: number): void {
        this.start_coordinates = new Point(x, y);
    }

    set_end(x: number, y: number): void {
        this.end_coordinates = new Point(x, y);
    }

    intersec_check(a: Point, b: Point, c: Point, d: Point): boolean {
        let common: number = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);

        if (common == 0) return false;

        let rH: number = (a.y - c.y) * (d.x - c.x) - (a.x - c.x) * (d.y - c.y);
        let sH: number = (a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y);

        let r: number = rH / common;
        let s: number = sH / common;

        if (r >= 0 && r <= 1 && s >= 0 && s <= 1)
            return true;
        else
            return false;
    }

    intersect_point(end_point: Point = this.end_coordinates): Point[] {
        let points: Point[] = [];
        let a1: number, b1: number, c1: number, a2: number, b2: number, c2: number, det: number, x: number, y: number;
        if (end_point) {
            for (let line of field.lines_arr) {
                if (this.intersec_check(this.start_coordinates, end_point, line.start_coordinates, line.end_coordinates)) {
                    console.log(this.start_coordinates, end_point, line.start_coordinates, line.end_coordinates)
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
    }

}

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

let field = new Field();

field.canvas.addEventListener("click", (event) => {
    field.set_point(new Point(event.offsetX, event.offsetY));
}, false);

field.canvas.addEventListener("mousemove", (event) => {
    field.render_temp_line(new Point(event.offsetX, event.offsetY));
}, false);