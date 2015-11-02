/// <reference path="../Sys/IGraphics.ts" />
module field {

    /** セルの描画 */
    export class CanvasCellRenderer implements ICellRenderer {

        private cells_: Array<Array<Cell>>;
        private canvas_: sys.IGraphics;

        constructor(cells: Array<Array<Cell>>, canvas: sys.IGraphics) {
            this.cells_ = cells;
            this.canvas_ = canvas;
        }

        draw(): void {
            for (var c in this.cells_) {
                for (var i in this.cells_[c]) {
                    this.drawCell(this.cells_[c][i]);
                }
            }
        }

        private drawCell(cell: Cell): void {
            var g = this.canvas_;
            var c = CanvasCellRenderer.toColor(cell.type);
            var coord = cell.rect;
            g.fillRect(coord.x, coord.y, coord.width, coord.height, c);
        }

        private static colours_ = CanvasCellRenderer.colours();
        private static colours() {
            var c = {};
            c[CellType.kOperation] = new sys.Color(.0, .0, .0);
            return c;
        }

        private static toColor(type: CellType): sys.Color {
            return CanvasCellRenderer.colours_[type];
        }

    }
}