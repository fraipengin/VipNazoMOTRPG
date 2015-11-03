/// <reference path="../Util/Rect.ts" />
import Rect = util.Rect;

module operation {

    /** マス */
    export class Cell {
        private x_: number;
        private y_: number;

        /** キャンバス上の座標 */
        private rect_: Rect;

        /** セルの属性 */
        private type_: CellType;

        constructor(x: number, y: number) {
            this.x_ = x;
            this.y_ = y;
            this.rect_ = CellCoordinate.toRect(x, y);
        }

        get x(): number {
            return this.x_;
        }

        get y(): number {
            return this.y_;
        }

        get rect(): Rect {
            return this.rect_.clone();
        }

        get type(): CellType {
            return this.type_;
        }

        set type(type: CellType) {
            this.type_ = type;
        }
    }

    export enum CellType {
        kOperation01,
        kOperation02,
        kOperation03,
        kOperation04,
        kOperation05,
        kOperation06,
        kOperation07,
        kOperation08,
        kOperation09,
        kOperation10,

    }

}