let keys = {};
let playerSheet = {};

var renderer = PIXI.autoDetectRenderer(512,512,{
    transparent: true,
    resolution: 1
});

renderer.backgroundColor = 0xAFFFFF;

document.getElementById("display").appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.loader.add("skull","images/sprite_skull.png").load(setup);

var sprite, sprite2;
var rect, rect2;
var idle

function setup(){
    stage.interactive = true;
    
    rect = new PIXI.Rectangle(0,0,64,64);
    rect2 = new PIXI.Rectangle(0,0,64,64);
    
    var texture = PIXI.loader.resources["skull"].texture;
    texture.frame = rect;
    sprite = new PIXI.Sprite(texture);
    sprite2 = new PIXI.Sprite(texture);

    idle = setInterval(function(){      
        if(rect.x >= 64 * 4) rect.x = 0;       
        sprite.texture.frame = rect;       
        rect.x += 64;       
    }, 350);
    
    sprite.scale.set(2,2);
    sprite.vx = 10;
    sprite2.scale.set(2,2);
    sprite2.vx = 10;

    sprite2.anchor.x = 1;     /* 0 = top, 0.5 = center, 1 = bottom */
    sprite2.scale.x *= -1;    /* flip vertically */

    stage.addChild(sprite);

    sprite2.x += 650; //arranging position of second player

    stage.addChild(sprite2);

    animationLoop();

}

function animationLoop(){

    requestAnimationFrame(animationLoop);

    renderer.render(stage);

}

/*t o change intervals according to players */
function interval(r){
    clearInterval(idle);
    idle = setInterval(function(){      
    if(r.x >= 64 * 4) r.x = 0;       
        sprite.texture.frame = r;       
        r.x += 64;       
    }, 350);
}

/* walking figure */
function walk(i){
    if(i==1)
    {
        rect = new PIXI.Rectangle(64,64,64,64); 
        interval(rect);
        
    }
    else if(i==2) 
    {
        rect2 = new PIXI.Rectangle(64,64,64,64);  
        interval(rect2);
    }
}

/* standing figure */
function stand(){
    setTimeout(() => {  rect = new PIXI.Rectangle(0,0,64,64); //wait 1s before standing
                        rect2 = new PIXI.Rectangle(0,0,64,64);}, 1000);  
}

/* attacking figure */
function attack(i){
    if(i==1)
    {
        rect = new PIXI.Rectangle(128,128,64,64);
        interval(rect);
    }
    else if(i==2) 
    {
        rect2 = new PIXI.Rectangle(128,128,64,64);   
        interval(rect2);
    }
}

//keyboard event handlers
window.addEventListener("keydown",keysDown);
window.addEventListener("keyup",keysUp);

function keysDown(e){
    keys[e.code] = true;
    console.log(keys);
    if (keys["KeyD"]) { walk(1); sprite.x += sprite.vx;}
    if (keys["KeyA"]) { walk(1); sprite.x -= sprite.vx; }
    if (keys["KeyW"]) { walk(1); sprite.y -= sprite.vx; }
    if (keys["KeyS"]) { walk(1); sprite.y += sprite.vx; }
    if (keys["KeyE"]) { attack(1); }

    if (keys["ArrowRight"]) { walk(2); sprite2.x += sprite2.vx;}
    if (keys["ArrowLeft"]) { walk(2); sprite2.x -= sprite2.vx;}
    if (keys["ArrowUp"]) { walk(2); sprite2.y -= sprite2.vx;}
    if (keys["ArrowDown"]) { walk(2); sprite2.y += sprite2.vx;}
    if (keys["KeyC"]) { attack(2); }
    stand();
}

function keysUp(e){
    keys[e.code] = false;
}
