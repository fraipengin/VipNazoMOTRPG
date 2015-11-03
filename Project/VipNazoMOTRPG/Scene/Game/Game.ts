/// <reference path="../../Cursor/SelectCursor.ts" />
/// <reference path="../../Field/Cell.ts" />
/// <reference path="../../Field/CellHolder.ts" />
/// <reference path="../../Field/ICellRenderer.ts" />
/// <reference path="../../Operation/Cell.ts" />
/// <reference path="../../Operation/CellHolder.ts" />
/// <reference path="../../Operation/ICellRenderer.ts" />
/// <reference path="../../Event/EventHandler.ts" />
/// <reference path="../../Player/PlayerHolder.ts" />
/// <reference path="../../Player/Player.ts" />
/// <reference path="../../Util/Random.ts" />
/// <reference path="../IScene.ts" />
module scene.game {
    import FieldCell = field.Cell;
    import FieldCellHolder = field.CellHolder;
    import FieldCellType = field.CellType;
    import FieldICellRenderer = field.ICellRenderer;

    import OperationCell = operation.Cell;
    import OperationCellHolder = operation.CellHolder;
    import OperationCellType = operation.CellType;
    import OperationICellRenderer = operation.ICellRenderer;

    import IOnClick = eventhandler.IOnClick;
    import IOnMouseMove = eventhandler.IOnMouseMove;
    import IOnKeyDown = eventhandler.IOnKeyDown;
    import ISelectCursorRenderer = cursor.ISelectCursorRenderer;

    import Player = player.Player;
    import PlayerHolder = player.PlayerHolder;
    import IPlayerRenderer = player.IPlayerRenderer;

    import SelectCursor = cursor.SelectCursor;

    import IPlayerTraverser = player.IPlayerTraverser;
    import Random = util.Random;

    /** ゲーム画面 */
    export class Game
        implements IScene, IOnClick, IOnMouseMove, IOnKeyDown
    {
        private FieldCellHolder_: FieldCellHolder;
        private FieldICellRenderer_: FieldICellRenderer;

        private OperationCellHolder_: OperationCellHolder;
        private OperationICellRenderer_: OperationICellRenderer;

        private players_: PlayerHolder;

        private cursor_: SelectCursor;

        constructor() {
        }

        initialize(): void {
            this.FieldCellHolder_ = new FieldCellHolder(5, 5);
            this.OperationCellHolder_ = new OperationCellHolder(5, 2);
            this.cursor_ = new SelectCursor();
            this.players_ = new PlayerHolder();

            // 自分と他人1人を追加
            this.players_.add(new Player(true, 0, 0));
            this.players_.add(new Player(false, 4, 3));

            var R = FieldCellType.kRiver;
            var F = FieldCellType.kForest;
            var V = FieldCellType.kVillage;
            // セルの属性を設定
            this.FieldCellHolder_.setupAll([
                [ R, V, V, V, V ],
                [ F, R, F, F, V ],
                [ F, F, R, F, F ],
                [ V, F, F, R, F ],
                [ V, V, V, V, R ]
            ]);

            var O1 = OperationCellType.kOperation01;
            var O2 = OperationCellType.kOperation02;
            var O3 = OperationCellType.kOperation03;
            var O4 = OperationCellType.kOperation04;
            var O5 = OperationCellType.kOperation05;
            var O6 = OperationCellType.kOperation06;
            var O7 = OperationCellType.kOperation07;
            var O8 = OperationCellType.kOperation08;
            var O9 = OperationCellType.kOperation09;
            var O10 = OperationCellType.kOperation10;

            this.OperationCellHolder_.setupAll([
                [O1, O2, O3, O4, O5],
                [O6, O7, O8, O9, O10]
            ]);
        }

        get FieldcellHolder(): FieldCellHolder {
            return this.FieldCellHolder_;
        }
        get OprerationcellHolder(): OperationCellHolder {
            return this.OperationCellHolder_;
        }

        get cursor(): SelectCursor {
            return this.cursor_;
        }

        get players(): PlayerHolder {
            return this.players_;
        }

        update(): IScene {
            return null;
        }

        FieldcreateSceneRenderer(canvas: sys.IGraphics): ISceneRenderer {
            return this.FieldICellRenderer_ || (this.FieldICellRenderer_ = new SceneRenderer(canvas, this));
        }
        OperationcreateSceneRenderer(canvas: sys.IGraphics): ISceneRenderer {
            return this.OperationICellRenderer_ || (this.OperationICellRenderer_ = new SceneRenderer(canvas, this));
        }

        onClick(event: MouseEvent) {
            var cell: FieldCell = this.FieldcellHolder.intersect(event.offsetX, event.offsetY);
            if (cell != null) {
                // 周囲8マスか判定して移動
                var self: Player = this.players.findSelf();
                var isMovable = (Math.abs(self.x - cell.x) | Math.abs(self.y - cell.y)) == 1;
                if (isMovable) {
                    self.x = cell.x;
                    self.y = cell.y;
                    this.__testMoveOther();
                }
            }
        }
        
        /** テスト用にその他の人を1マス移動させる */
        __testMoveOther(): void {
            this.players_.traverse(new __TestMoveOtherTraverser);
        }

        onMouseMove(event: MouseEvent) {
            // 今マウスがいるマスを検索する
            var cell: FieldCell = this.FieldcellHolder.intersect(event.offsetX, event.offsetY);
            if (cell != null) {
                this.cursor.valid();
                this.cursor.x = cell.x;
                this.cursor.y = cell.y;
            } else {
                this.cursor.invalid();
            }
        }

        onKeyDown(event: KeyboardEvent) {
        }
    }

    /** ゲーム画面の描画 */
    class SceneRenderer implements ISceneRenderer {
        private canvas_: sys.IGraphics;
        private game_: Game;
        private renderer_: FieldICellRenderer;
        private cursor_: ISelectCursorRenderer;
        private players_: IPlayerRenderer;

        constructor(canvas: sys.IGraphics, game: Game) {
            this.canvas_ = canvas;
            this.game_ = game;
            this.renderer_ = game.FieldcellHolder.createRenderer(canvas);
            this.cursor_ = game.cursor.createRenderer(canvas);
            this.players_ = game.players.createRenderer(canvas);
        }

        draw(): void {
            this.renderer_.draw();
            this.players_.draw();
            this.cursor_.draw();
        }
    }

    class __TestMoveOtherTraverser implements IPlayerTraverser {
        execPlayer(no: number, player: Player): void {
            if (!player.isSelf()) {
                for (var i: number = 0; i < 10; ++i) {
                    var x = Random.instance().generate(0, 2) - 1 + player.x;
                    var y = Random.instance().generate(0, 2) - 1 + player.y;

                    if (x >= 0 && x < 5 &&
                            y >= 0 && y < 5 &&
                            !(player.x == x && player.y == y) ) {
                        player.x = x;
                        player.y = y;
                        break;
                    }
                }
            }
        }
    }
} 
