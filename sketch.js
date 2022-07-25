/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisiblejungle, jungleImage;

var jumpbutton, buttonAllowed = false, buttonAllowedOnPC = false;

var obstaclesGroup, obstacle1;

var score = 0, highscore = 0;

var gameOver, restart;

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function preload(){
  kangaroo_running = loadAnimation("assets/kangaroo1.png", "assets/kangaroo2.png", "assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo3.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/fimdejogo.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);//800, 400

  jumpbutton = createButton("");
  jumpbutton.class("jumpbutton");
  jumpbutton.position(width - width - width, -45);
  jumpbutton.mousePressed(jump);
  if(isMobile && buttonAllowed == true){
    jumpbutton.position(width / 2 -45, 25);
  }
  

  jungle = createSprite(width / 2, windowHeight / 2, windowWidth + 800, windowHeight);//400, 100, 400, 20
  jungle.addImage("jungle", jungleImage);
  jungle.scale = 0.4;//0.3
  //jungle.x = width /2;

  if(windowHeight / 2 + 200 > windowHeight){
    kangaroo = createSprite(50, windowHeight / 2, 20, 50);//50, 200, 20, 50
  }else{
    kangaroo = createSprite(50, windowHeight / 2 + 200, 20, 50);//50, 200, 20, 50
  }
  
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle", 0, 0, 300)
  //kangaroo.debug = true;

  invisibleGround = createSprite(400, windowHeight - 50, 1600, 10);//400, 450, 1600, 10
  invisibleGround.shapeColor = "brown";
  invisibleGround.visible = false;
  //if(!isMobile){
    gameOver = createSprite(width / 2, height / 2 - 100);//400, 100
    restart = createSprite(width / 2 + 150, height / 2 - 100 + 40);//550, 140
  //}else{
  //  gameOver = createSprite(width / 2, height / 2 + 90);//400, 100
  //  restart = createSprite(width / 2 + 150, height / 2 + 100 - 40);//550, 140
  //}
  
  gameOver.addImage(gameOverImg);
  
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  //background("green");//jungleImage);//255
  if(isMobile){
    jungle.visible = false;
    background(jungleImage);//255
  }else{
    background("green");//jungleImage);//255
  }

  kangaroo.x = camera.position.x - 270;
  if(buttonAllowed == true && jumpbutton.x != width / 2
  || buttonAllowed == true && jumpbutton.y != 25){
    if(!isMobile && buttonAllowedOnPC){
      jumpbutton.position(width / 2 - 40, 55);
    }else if(isMobile){
      jumpbutton.position(width / 2 - 40, 95);
    }
    
  }

  if (gameState === PLAY){
    jungle.velocityX =- 3

    if(jungle.x < width / 2 - 200)//100
    {
      jungle.x = width - 600;//400
    }

    console.log(kangaroo.y)
    if(keyDown("space") && kangaroo.y > windowHeight - 130 //270
    || touches.length > 0 && kangaroo.y > windowHeight - 130 && buttonAllowed == false //270
    ||keyDown("W") && kangaroo.y > windowHeight - 130 //270
    ||keyDown("UP_ARROW") && kangaroo.y > windowHeight - 130) {//270
      jumpSound.play();
      kangaroo.velocityY = -16;
      touches = [];
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
      score = score + 1;
      for(var shrub of shrubsGroup){
        if(shrub.isTouching(kangaroo)){
          shrub.destroy();
        }
        
      }
      //shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x = camera.position.x;
    restart.x = camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided", kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || touches.length > 0) {
      touches = [];
      reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided", kangaroo_collided);

    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    restart.x = camera.position.x;
    restart.visible = true;
    if(mousePressedOver(restart) || touches.length > 0) {
      touches = [];
      reset();
    }
  }
  
  drawSprites();

  textSize(45);
  fill('gold')
  stroke('green');
  //stroke(3);
  //fill("black");
  if(!isMobile){
    textAlign("center");
  }
  if(!isMobile){
    text("Pontuação: "+ score, camera.position.x, 50);
  }else{
    text("Pontuação: "+ score, 50, 50);
  }

  if(score >= 5){
    textAlign("center");
    kangaroo.visible = false;
    textSize(30);
    //stroke(3);
    //fill("black");
    fill('gold');
    stroke('green');
    text("Parabéns! Você Venceu O Jogo!", width / 2, height / 2);//70, 200
    gameState = WIN;
  }

}

function spawnShrubs() {

  if (frameCount % 150 === 0) {
    var shrub = createSprite(camera.position.x + width + 100, windowHeight - 70, 40, 10);
    //camera.position.x + 500, 330, 40, 10

    shrub.velocityX = -(6 + 3*score/100);
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
      break;
      case 2: shrub.addImage(shrub2);
      break;
      case 3: shrub.addImage(shrub3);
      break;
      default: break;
    }
         
    shrub.scale = 0.05;
    shrub.lifetime = 420;
    
    shrub.setCollider("rectangle", 0, 0, shrub.width/2, shrub.height/2);
    shrubsGroup.add(shrub);
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(camera.position.x + width, windowHeight - 70, 40, 40);
    //camera.position.x + 400, 330, 40, 40

    obstacle.setCollider("rectangle", 0, 0, 200, 200);
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.scale = 0.15;   
 
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
  }
}

function jump(){
  if(gameState == PLAY){
    if(kangaroo.y > windowHeight - 130) {//270
      jumpSound.play();
      kangaroo.velocityY = -16;
      touches = [];
    }
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  kangaroo.changeAnimation("running", kangaroo_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  if(score > highscore){
    highscore = score;
  }
  score = 0;
}

