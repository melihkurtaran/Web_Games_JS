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

function setup(){
    stage.interactive = true;
    
    var rect = new PIXI.Rectangle(0,0,64,64);
    var texture = PIXI.loader.resources["skull"].texture;
    texture.frame = rect;

    sprite = new PIXI.Sprite(texture);
    sprite2 = new PIXI.Sprite(texture);

    var idle = setInterval(function(){

        if(rect.x >= 64 * 4) rect.x = 0;
        sprite.texture.frame = rect;
        sprite2.texture.frame = rect;
        rect.x += 64;
    }, 350);

    sprite.scale.set(2,2);
    sprite.vx = 10;
    sprite2.scale.set(2,2);
    sprite2.vx = 10;

    sprite2.anchor.x = 1;     /* 0 = top, 0.5 = center, 1 = bottom */
    sprite2.scale.x *= -1;    /* flip vertically */

    stage.addChild(sprite);

    sprite2.x += 650;

    stage.addChild(sprite2);

    createPlayerSheet();
    animationLoop();

}

function animationLoop(){

    requestAnimationFrame(animationLoop);

    renderer.render(stage);

}

function doneLoading(e){
    createPlayerSheet();
    createPlayerSheet();
}

function createPlayerSheet(){
    let sshet = new PIXI.BaseTexture.from(PIXI.loader.resources["skull"].url);

    playerSheet["walk"] = [
        new PIXI.Texture(sshet, new PIXI.Rectangle(0,64,64,128)),
        new PIXI.Texture(sshet, new PIXI.Rectangle(64,64,132,128)),
        new PIXI.Texture(sshet, new PIXI.Rectangle(128,64,192,128)),
        new PIXI.Texture(sshet, new PIXI.Rectangle(192,64,256,128))
    ];
    playerSheet["stand"] = [
        new PIXI.Texture(sshet, new PIXI.Rectangle(0,0,64,64)),
        new PIXI.Texture(sshet, new PIXI.Rectangle(64,0,132,64)),
        new PIXI.Texture(sshet, new PIXI.Rectangle(128,0,192,64)),
        new PIXI.Texture(sshet, new PIXI.Rectangle(192,0,256,64))
    ];
}

function createPlayer(){
    player = new PIXI.AnimatedSprite(playerSheet.stand);
    player.anchor.set(0.5);
    player.animationSpeed = .5;
    player.loop = true;
    stage.addChild(player);
    player.play();
}

function walk(){
    sprite = new PIXI.AnimatedSprite(playerSheet.walk);

}

//keyboard event handlers
window.addEventListener("keydown",keysDown);
window.addEventListener("keyup",keysUp);

function keysDown(e){
    keys[e.code] = true;
    console.log(keys);
    if (keys["KeyD"]) { sprite.x += sprite.vx; }
    if (keys["KeyA"]) sprite.x -= sprite.vx;
    if (keys["KeyW"]) sprite.y -= sprite.vx;
    if (keys["KeyS"]) sprite.y += sprite.vx;

    if (keys["ArrowRight"]) sprite2.x += sprite2.vx;
    if (keys["ArrowLeft"]) sprite2.x -= sprite2.vx;
    if (keys["ArrowUp"]) sprite2.y -= sprite2.vx;
    if (keys["ArrowDown"]) sprite2.y += sprite2.vx;

}

function keysUp(e){
    keys[e.code] = false;
}
