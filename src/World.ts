import * as PIXI from 'pixi.js';
import Matter from './Matter';
import Ball from './Ball';
import Particle from './Particle';

export default class World {
    public _engine: any;
    public renderer: PIXI.Renderer;
    public stage: PIXI.Container;
    public ticker: PIXI.Ticker;
    public graphics: PIXI.Graphics;
    private ball: Ball;
    private staticSpot: Particle;
    private staticSpot2: Particle;
    private constraints: Matter.Constraint[];
    private staticPoints: Particle[];
    private mouseConstraint: Matter.MouseConstraint;

    constructor(
        engine: any,
        renderer: PIXI.Renderer,
        stage: PIXI.Container,
        ticker: PIXI.Ticker,
        graphics: PIXI.Graphics
    ) {
        this._engine = engine;
        this.renderer = renderer;
        this.stage = stage;
        this.ticker = ticker;
        this.graphics = graphics;
        this.constraints = [];
        this.staticPoints = [];

        let img = new Image();
        img.src = "src/Assets/Ball.png";
        let base = new PIXI.BaseTexture(img);
        let ballTexture: PIXI.Texture = new PIXI.Texture(base);

        let img2 = new Image();
        img2.src = "src/Assets/Ball2.png";
        let base2 = new PIXI.BaseTexture(img2);
        let ballTexture2: PIXI.Texture = new PIXI.Texture(base2);

        //Maak hier al je staticPoints aan en doe ze in een array
        this.staticSpot = new Particle('constraint1', this._engine, 0x001, 650, 400, 40, 40, ballTexture);
        this.staticSpot2 = new Particle('constraint2', this._engine, 0x001, 300, 400, 40, 40, ballTexture);
        this.staticPoints.push(this.staticSpot2);
        this.staticPoints.push(this.staticSpot);

        let pipe = PIXI.Sprite.from("src/Assets/pipe.png");
        pipe.position.x = 620;
        pipe.position.y = 700;

        this.ball = new Ball('ball', this._engine, 0x001, 200, 400, 40, 40, ballTexture2);
        
        this.staticPoints.forEach(element => {
            this.ballStaticConstraint(element, this.ball);
        });

        this.createMouseConstraint();

        Matter.World.add(this._engine.world, [this.ball.body, this.staticSpot.body, this.staticSpot2.body]);

        this.stage.addChild(this.graphics);
        this.stage.addChild(this.ball.sprite);
        this.stage.addChild(this.staticSpot.sprite);
        this.stage.addChild(this.staticSpot2.sprite);
        this.stage.addChild(pipe);

        this.ticker.add(this.update);
    }

    private update = (): void => {
        this.ball.update();
        
        this.graphics.clear();
        this.staticPoints.forEach(element => {
            this.drawLine(element, this.ball);
        });

        this.checkWin();

        this.staticSpot.body.position.y = 400;
        this.staticSpot.body.position.x = 650;
        this.staticSpot2.body.position.y = 400;
        this.staticSpot2.body.position.x = 300;
    }

    private drawLine(particle: Particle, ball: Ball){
        this.graphics.lineStyle(5, 0xffffff);
        this.graphics.moveTo(particle.body.position.x, particle.body.position.y);
        this.graphics.lineTo(ball.body.position.x, ball.body.position.y);
        this.graphics.endFill();
    }

    private checkWin(){
        //{x: 600, y: 700} t/m {x: 650, y: 700}
        if(this.ball._body.position.x >= 620 && this.ball._body.position.x <= 670){
            if(this.ball._body.position.y > 700){
                this.winContainer();
            }
        }
    }

    //Voeg een mouse constraint toe aan de canvas
    private createMouseConstraint(){
        let canvasMouse: Matter.Mouse;
        canvasMouse = Matter.Mouse.create(this.renderer.view);
        let optionsMouse = {
            mouse: canvasMouse
        }
        this.mouseConstraint =  Matter.MouseConstraint.create(this._engine, optionsMouse);
        Matter.World.add(this._engine.world, this.mouseConstraint);

        let index = 0;
        Matter.Events.on(this.mouseConstraint, "mousedown", (event: any) => {
            let mouseCoordinate = event.mouse.absolute;
            this.constraints.forEach((element) => {
                let bodyA = element.bodyA.position; //Punt 1
                let bodyB = element.bodyB.position; //Punt 2
                //kijk of je muis coordinaten tussen deze 2 punten valt
                if(mouseCoordinate.x >= bodyA.x && mouseCoordinate.x <= bodyB.x){
                    if(mouseCoordinate.y >= bodyA.y && mouseCoordinate.y <= bodyB.y){
                        // console.log("je hebt nu op een constraint geklikt");
                        try{
                            Matter.World.remove(this._engine.world, this.constraints[index]);
                            this.staticPoints.splice(0, 1);
                            index++
                        }
                        catch(e){
                            // console.log(e);
                        }
                    }
                }
                else
                    return;
            });
        });
    }

    //Voeg een constraint tussen de bal en de staticSpot
    private ballStaticConstraint(staticSpot: any, ball: any){
        let constraint: Matter.Constraint;
        var options = {
            bodyA: staticSpot.body,
            bodyB:  ball.body,
            length: 160,
            stiffness: 0.05,
        };
        constraint = Matter.Constraint.create(options);
        Matter.World.add(this._engine.world, constraint);
        this.constraints.push(constraint);
    }

    private winContainer(){
        //Check hier de positie van de ball
        //Als de posistie van de bal binnen een bepaalde waarde valt
        //Heb je gewonnen en dan komt er een scherm te voorschijn
        //Waar je het spel weer kunt resetten.
        if(document.querySelector("div") === null){
            let div = document.createElement('div');
            div.className = "winContainer";
    
            let title = document.createElement('h1');
            title.className = "winTitle";
            title.textContent = "Gefeliciteerd jij hebt het level gehaald!!!";
    
            let button = document.createElement('button');
            button.className = "refreshPageBtn";
            button.textContent = "restart";
            button.onclick = this.refreshPage;
    
            div.appendChild(title);
            div.appendChild(button);
            document.body.appendChild(div);
        }
    }

    private refreshPage(){
        window.location.reload();
    }
}