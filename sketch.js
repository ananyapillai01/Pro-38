var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var background1;

var gameOver, gameOverImage;

var score;
var PLAY = 1;
var END = 0;
gameState = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  background1 = loadImage("background.png");

  gameOverImage = loadImage("gameOver.png");
}

function setup() {
  createCanvas(displayWidth - 20, displayHeight - 30);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300, 100, 20, 20);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
  
  
}

function draw() {
  background(background1);
  
  camera.position.x = trex.x;
  camera.position.y = trex.y;

  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY) {
      score = score + Math.round(getFrameRate()/60);
    
      if(keyDown("space")) {
        trex.velocityY = -10;
      }
  
      trex.velocityY = trex.velocityY + 0.8
  
      if (ground.x < 0){
        ground.x = ground.width/2;
      }
      spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)) {
       gameState = END;
    }

     }
  else if(gameState === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    
    trex.changeAnimation("collided", trex_collided);
    
    gameOver.visible = true;
  }
 
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 40 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

getState()
{
  var gameStateRef  = database.ref('gameState');
  gameStateRef.on("value",function(data){
     gameState = data.val();
  })

}

update(state)
{
  database.ref('/').update({
    gameState: state
  });
}
