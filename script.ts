class Field {
    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    ctx: CanvasRenderingContext2D | null = this.canvas?.getContext('2d');
    temp_line: Line | undefined = undefined;
    lines_arr: Line[] = [];

    constructor() {
        this.canvas.oncontextmenu = () => { return false; };
        console.log(this.canvas);
    }

    render_point(point: Point): void {
        this.ctx?.beginPath();
        this.ctx?.arc(point.x, point.y, 5, 0, 2 * Math.PI, true);
        this.ctx!.fillStyle = 'red';
        this.ctx?.fill();
        this.ctx?.stroke();
    }

    render_intersect_points(): void {
        for (let line of this.lines_arr) {
            for (let point of line.intersect_point()) {
                this.render_point(point);
            }
        }
    }

    set_point(point: Point): void {
        if (this.temp_line) {
            this.temp_line.set_end(point);
            this.temp_line = undefined;
        } else {
            this.temp_line = new Line();
            this.lines_arr.push(this.temp_line);
            this.temp_line.set_start(point);
        }
    }

    unset_line(): void {
        if (this.lines_arr.length != 0 && this.temp_line) {
            this.lines_arr.pop();
            this.temp_line = undefined;
            requestAnimationFrame(this.render_all);
        }
    }

    render_temp_line(point: Point): void {
        if (this.temp_line) {
            this.temp_line.set_end(point);
            requestAnimationFrame(this.render_all);
        }
    }

    render_lines(): void {
        for (let { start_coordinates, end_coordinates } of this.lines_arr) {
            this.ctx?.beginPath();
            this.ctx?.moveTo(start_coordinates.x, start_coordinates.y);
            this.ctx?.lineTo(end_coordinates.x, end_coordinates.y);
            this.ctx?.stroke();
        }
    }

    render_all = (): void => {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.render_lines();
        this.render_intersect_points();
    }
    
    collapse(line: Line): void {
        let { start_coordinates, end_coordinates } = line!;
        let x1: number, x2: number, y1: number, y2: number, tStart: number = 0, tEnd: number = 1;
        let inter: number = setInterval(() => {
            if (tStart.toFixed(2) == '0.50' || tEnd.toFixed(2) == '0.50') {
                clearInterval(inter);
                console.log(Date.now() - start_time, "3 sec tipa")
                this.lines_arr.shift();
            }
            tStart += 0.001;
            tEnd -= 0.001;
            x1 = lerp(start_coordinates.x, end_coordinates.x, tStart);
            x2 = lerp(start_coordinates.x, end_coordinates.x, tEnd);
            y1 = lerp(start_coordinates.y, end_coordinates.y, tStart);
            y2 = lerp(start_coordinates.y, end_coordinates.y, tEnd);
            line?.set_start({ x: x1, y: y1 });
            line?.set_end({ x: x2, y: y2 });
            requestAnimationFrame(this.render_all);
        }, 6)
    }

    collapse_lines(): void {
        for (let line of this.lines_arr) {
            this.collapse(line);
        }
    }
}

class Line {
    start_coordinates: Point;
    end_coordinates: Point;

    set_start(point: Point): void {
        this.start_coordinates = point;
    }

    set_end(point: Point): void {
        this.end_coordinates = point;
    }

    intersect_point(): Point[] {
        let points: Point[] = [];
        let tTop: number, uTop: number, bottom: number, t: number, u: number;
        for (let line of field.lines_arr) {
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
    }
}

function lerp(A: number, B: number, t: number) {
    return A + (B - A) * t;
}

interface Point {
    x: number;
    y: number;
}

let field = new Field();

let start_time: number = 0;

field.canvas.addEventListener("click", (event) => {
    field.set_point({ x: event.offsetX, y: event.offsetY });
}, false);

field.canvas.addEventListener("contextmenu", (event) => {
    field.unset_line();
}, false);

field.canvas.addEventListener("mousemove", (event) => {
    field.render_temp_line({ x: event.offsetX, y: event.offsetY });
}, false);

document.getElementById('button')!.onclick = () => { start_time = Date.now(); field.collapse_lines(); };
