/// <reference path="../Util/Rect.ts" />

module operation {

    /** セルのキャンバス上の座標の計算 */
    export class CellCoordinate {

        static toRect(x: number, y: number): Rect {
            var kWidth: number = 100;
            var kHeight: number = 610;
            var kMargin: number = 25;
            var kPadding: number = 10;

            return new Rect(x * (kWidth + kPadding) + kMargin,
                y * (kHeight + kPadding) + kMargin, kWidth, kHeight);
        }
    }
}