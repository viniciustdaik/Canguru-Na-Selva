/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisiblejungle, jungleImage;

var obstaclesGroup, obstacle1;

var score = 0;

var gameOver, restart;

function preload(){
  kangaroo_running = loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
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

  jungle = createSprite(width / 2, windowHeight / 2, windowWidth + 800, windowHeight);//400, 100, 400, 20
  jungle.addImage("jungle", jungleImage);
  jungle.scale = 0.4;//0.3
  //jungle.x = width /2;

  kangaroo = createSprite(50, windowHeight / 2 + 200, 20, 50);//50, 200, 20, 50
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle", 0, 0, 300)
  //kangaroo.debug = true;

  invisibleGround = createSprite(400, windowHeight - 50, 1600, 10);//400, 450, 1600, 10
  invisibleGround.shapeColor = "green";
  invisibleGround.visible = false;
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background("red");//jungleImage);//255
  
   kangaroo.x = camera.position.x - 270;




  if (gameState === PLAY){

    jungle.velocityX =- 3

    if(jungle.x < windowWidth / 2 - 200)//100
    {
       jungle.x = windowWidth - 600;//400
    }
   console.log(kangaroo.y)
    if(keyDown("space") && kangaroo.y > windowHeight - 130) {//270
      jumpSound.play();
      kangaroo.velocityY = -16;
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

      shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided", kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
  }

  
  drawSprites();


}

function spawnShrubs() {

  if (frameCount % 150 === 0) {


     var shrub = createSprite(camera.position.x + windowWidth + 100, windowHeight - 70, 40, 10);
     //camera.position.x + 500, 330, 40, 10



    shrub.velocityX = -(6 + 3*score/100)
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
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    
    
     var obstacle = createSprite(camera.position.x + windowWidth, windowHeight - 70, 40, 40);
     //camera.position.x + 400, 330, 40, 40


    obstacle.setCollider("rectangle", 0, 0, 200, 200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;   
 
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}
