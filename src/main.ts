import * as PIXI from "pixi.js"
import Matter from "./Matter"
import World from "./World";

export default class Game{
    public renderer: PIXI.Renderer;
    public stage: PIXI.Container;
    public graphics: PIXI.Graphics;
    public engine: any;
    public world: World;
    public ticker: PIXI.Ticker;
    public particles: any;
    public bodies: any;

    constructor(){
        this.engine = Matter.Engine.create();

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        
        this.renderer = new PIXI.Renderer({
            width: 1200, 
            height: 800
        });
        document.body.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();
        this.ticker = new PIXI.Ticker();
        this.graphics = new PIXI.Graphics();

        this.ticker.add(() => {
            this.renderer.render(this.stage);
        }, PIXI.UPDATE_PRIORITY.LOW);
        this.ticker.start();

        this.world = new World(this.engine, this.renderer, this.stage, this.ticker, this.graphics);

        Matter.Engine.run(this.engine);
    }
}

new Game();