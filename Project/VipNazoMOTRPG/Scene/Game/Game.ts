/// <reference path="../../Cursor/SelectCursor.ts" />
/// <reference path="../../Field/Cell.ts" />
/// <reference path="../../Field/CellHolder.ts" />
/// <reference path="../../Field/ICellRenderer.ts" />
/// <reference path="../../Event/EventHandler.ts" />
/// <reference path="../../Player/PlayerHolder.ts" />
/// <reference path="../../Player/Player.ts" />
/// <reference path="../../Util/Random.ts" />
/// <reference path="../IScene.ts" />
module scene.game {
    import Cell = field.Cell;
    import CellHolder = field.CellHolder;
    import CellType = field.CellType;
    import ICellRenderer = field.ICellRenderer;

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
        private cellHolder_: CellHolder;
        private cellRenderer_: ICellRenderer;
        private players_: PlayerHolder;

        private cursor_: SelectCursor;

        constructor() {
        }

        initialize(): void {
            this.cellHolder_ = new CellHolder(5, 5);
            this.cursor_ = new SelectCursor();
            this.players_ = new PlayerHolder();

            // 自分と他人1人を追加
            this.players_.add(new Player(true, 0, 0));
            this.players_.add(new Player(false, 4, 3));

            var R = CellType.kRiver;
            var F = CellType.kForest;
            var V = CellType.kVillage;
            var O = CellType.kOperation;
            // セルの属性を設定
            this.cellHolder_.setupAll([
                [ R, V, V, V, V ],
                [ F, R, F, F, V ],
                [ F, F, R, F, F ],
                [ V, F, F, R, F ],
                [ V, V, V, V, R ]
            ]);
            this.cellHolder_.setupAll([
                [O, O, O, O, O],
                [O, O, O, O, O]
            ]);
        }

        get cellHolder(): CellHolder {
            return this.cellHolder_;
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

        createSceneRenderer(canvas: sys.IGraphics): ISceneRenderer {
            return this.cellRenderer_ || (this.cellRenderer_ = new SceneRenderer(canvas, this));
        }

        onClick(event: MouseEvent) {
            var cell: Cell = this.cellHolder.intersect(event.offsetX, event.offsetY);
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
            var cell: Cell = this.cellHolder.intersect(event.offsetX, event.offsetY);
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
        private renderer_: ICellRenderer;
        private cursor_: ISelectCursorRenderer;
        private players_: IPlayerRenderer;

        constructor(canvas: sys.IGraphics, game: Game) {
            this.canvas_ = canvas;
            this.game_ = game;
            this.renderer_ = game.cellHolder.createRenderer(canvas);
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
