module operation {
    /** セルの集中管理用 */
    export class CellHolder {
        private cells_: Array<Array<Cell>>;

        constructor(x: number, y: number) {

            this.cells_ = new Array(x);
            for (var i = 0; i < x; ++i) {

                this.cells_[i] = new Array(y);
                for (var j = 0; j < y; ++j) {
                    this.cells_[i][j] = new Cell(i, j);
                }
            }
        }

        pick(x: number, y: number): Cell {
            return this.cells_[x][y];
        }

        setupAll(array:Array<Array<CellType>>) {
            for (var y in array) {
                for (var x in array[y]) {
                    var o = array[y][x];
                    this.pick(x, y).type = o;
                }
            }
        }

        intersect(sx: number, sy: number): Cell {
            var array = this.cells_;
            for (var x in array) {
                for (var y in array[x]) {
                    var c = array[x][y];
                    if (c.rect.isCross(sx, sy)) {
                        return c;
                    }
                }
            }
            return null;
        }

        createRenderer(canvas: sys.IGraphics): ICellRenderer {
            return new CanvasCellRenderer(this.cells_, canvas);
        }
    }
}