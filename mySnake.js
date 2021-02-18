const UNIT = 20;
const env_width = 20;
const env_height = 20;
const CODE_START = 116;
const CODE_PAUSE = 112;
const CODE_UP = 119; //w
const CODE_DOWN = 115; //s
const CODE_LEFT = 97; //a
const CODE_RIGHT = 100; //d
const FRAME_TIME = 200;
const SNAKE_COLOR = "darkgreen";
var score = 0;
var snakeLength = 2;
var moveX = 1, moveY = 0;
var pauseFlag;
var snakeArr = [];
var curUP=CODE_UP;
var curDOWN=CODE_DOWN;
var curLEFT=CODE_LEFT;
var curRIGHT=CODE_RIGHT;
var curSTART=CODE_START;
var foodPosition=[];
var intervalID;
$(document).ready(function () {
    $("#intro").click(function () { resetGame(); });
    $("#scoreDiv").click(function () { increaseSnake(); });
});

function moveSnake() {
    var tmpX = snakeEle.style.left.slice(0, -2);
    var tmpY = snakeEle.style.top.slice(0, -2);
    tmpX=Math.round(parseInt(tmpX)/10)*10;
    tmpY=Math.round(parseInt(tmpY)/10)*10;
    snakeEle.style.left=tmpX+"px";
    snakeEle.style.top=tmpY+"px";
    var preX = [tmpX];
    var preY = [tmpY];
    // console.log('head:',tmpX,tmpY);
    checkFood(tmpX,tmpY);
    var judgeA=checkTouchSnake(tmpX,tmpY);
    var judgeB=checkTouchWall(tmpX,tmpY);
    if (judgeA || judgeB) { return; }
    for (index in snakeArr) {
        preX.push(snakeArr[index].style.left.slice(0, -2));
        preY.push(snakeArr[index].style.top.slice(0, -2));
        setSnakePos(snakeArr[index], preX[index], preY[index]);
    }
    $('#snakeHead').animate({
        left: `+=${UNIT * moveX}px`,
        top: `+=${UNIT * moveY}px`
        }, { duration: FRAME_TIME, queue: false });
    for (index in snakeArr) {
           $(`#sn${index}`).animate({
                left: `${preX[index]}px`,
                top: `${preY[index]}px`
                }, { duration: FRAME_TIME, queue: false });
    }
}
var snakeEle = document.getElementById("snakeHead");
var foodEle = document.getElementById("food");
var scoreEle = document.getElementById("score");
var workAreaEle = document.getElementById("workArea");
var gameOverEle = document.getElementById("gameOver");

function pressS() {
    setEnvironment();
    startSnake();
    curSTART=0;
    document.getElementById("btnS").disabled=true;
}
function keyFunction(event) {
    var currentKey = event.which || event.keyCode;
    // document.getElementById("demo").innerText = `The Unicode value is:  ${currentKey}`;

    console.log(currentKey == CODE_RIGHT);
    switch (currentKey) {
        case curSTART:
            pressS(); 
            break;
        case CODE_PAUSE:
            pauseSnake();
            break;
        case curRIGHT:
            moveX = 1;
            moveY = 0;
            curLEFT=0;
            curUP=CODE_UP;
            curDOWN=CODE_DOWN;
            break;
        case curLEFT:
            moveX = -1;
            moveY = 0;
            curRIGHT=0;
            curUP=CODE_UP;
            curDOWN=CODE_DOWN;
            break;
        case curUP:
            moveX = 0;
            moveY = -1;
            curDOWN=0;
            curRIGHT=CODE_RIGHT;
            curLEFT=CODE_LEFT;
            break;
        case curDOWN:
            moveX = 0;
            moveY = 1;
            curUP=0;
            curRIGHT=CODE_RIGHT;
            curLEFT=CODE_LEFT;
            break;
        default:
            break;
    }
}
function setEnvironment() {
    var tmpX=Math.floor(Math.random() * env_height/2) * UNIT;
    var tmpY=Math.floor(Math.random() * env_width/2) * UNIT;
    setSnakeStyle(snakeEle, tmpX, tmpY, SNAKE_COLOR);
    setSnakeStyle(foodEle, -10,-10, "tomato");
    foodPosition=genFood();
    snakeLength = 2;
    for (var i = 0; i < snakeLength; i++) {
        console.log(tmpX,tmpX-UNIT);
        genSnakeEle(tmpX-UNIT,tmpY);
    }
    pauseFlag = false;
    workAreaEle.style.width=`${(env_width+1)*UNIT}px`;
    workAreaEle.style.height=`${(env_height+1)*UNIT}px`;
    workAreaEle.style.border=`darkgoldenrod ${UNIT}px solid`;
    gameOverEle.style.visibility="hidden";
    gameOverEle.style.width=`${(env_width+1)*UNIT}px`;
    gameOverEle.style.height=`${(env_height+1)*UNIT}px`;
    gameOverEle.style.border=`black ${UNIT*2}px solid`;
    score=0;
    updateScore(score);
    moveX = 1, moveY = 0;
    curLEFT=0;
    curUP=CODE_UP;
    curDOWN=CODE_DOWN;
}
function setSnakeStyle(ele, initX, initY, colorStr) {
    ele.style.position = "absolute";
    ele.style.width = UNIT + "px";
    ele.style.height = UNIT + "px";
    ele.style.backgroundColor = colorStr;
    ele.style.top = `${initY}px`;
    ele.style.left = `${initX}px`;
}
function setSnakePos(ele, initX, initY) {
    ele.style.left = `${initX}px`;
    ele.style.top = `${initY}px`;
}
function genFood() {
    var tmpY=Math.floor(Math.random() * env_height) * UNIT;
    var tmpX=Math.floor(Math.random() * env_width) * UNIT;
    foodEle.style.top = tmpY + "px";
    foodEle.style.left = tmpX + "px";
    // console.log(tmpX,tmpY);
    return [tmpX,tmpY];
}
function startSnake() {
    intervalID= setInterval(() => {
    if (!pauseFlag) { moveSnake(); }
    }, FRAME_TIME);
}
function pauseSnake() {
    pauseFlag = !pauseFlag;
    if (gameOverEle.style.visibility=="hidden") {
        gameOverEle.style.visibility="visible";
    } else { gameOverEle.style.visibility="hidden"; }
    gameOverEle.innerHTML="Game Pause! Press 'p' to restart";
    // clearInterval(intervalID);
    // startSnake();
}
function genSnakeEle(orgX,orgY) {
    var newEle = document.createElement("div");
    // var orgX = orgSnakeEle.style.left.slice(0, -2);
    // var orgY = orgSnakeEle.style.top.slice(0, -2);
    setSnakeStyle(newEle, orgX, orgY, SNAKE_COLOR);
    newEle.id = `sn${snakeArr.length}`;
    workAreaEle.appendChild(newEle);
    snakeArr.push(newEle);
}
function increaseSnake() {
    var tmpX=snakeArr[snakeArr.length-1].style.left.slice(0,-2);
    var tmpY=snakeArr[snakeArr.length-1].style.top.slice(0,-2);
    genSnakeEle(tmpX,tmpY);
    snakeLength += 1;

}
function checkTouchWall(orgX,orgY) {
    var right = parseInt(workAreaEle.style.width.slice(0,-2));
    var bot = parseInt(workAreaEle.style.height.slice(0,-2));
    if (orgX<0 || orgX>right-1 || orgY <0 || orgY>bot-1) {
        gameOver();
        return true;
    }
}
function checkTouchSnake(orgX,orgY) {
    for (ele of snakeArr) {
        eleY=ele.style.top.slice(0,-2);
        eleX=ele.style.left.slice(0,-2);
        if (orgX==eleX&&orgY==eleY) {
            // console.log(ele.id,ele.style.left,snakeEle.style.left);
            gameOver();
            return true;
        }
    }
 }
function checkFood(orgX,orgY) {
    if (orgX==foodPosition[0] && orgY==foodPosition[1]) {
        increaseSnake();
        score+=1;
        updateScore(score);
        foodPosition=genFood();        
    }
 }
function updateScore(addScore) {
    var dt =100;
    //setting some effect when scoreing
    document.getElementById("score").style.boxShadow="0px 0px 10px red";
    $('#scoreDiv').animate({left:"-=5px"},dt)
    .animate({left:"+=10px"},dt)
    .animate({left:"-=5px"},dt);
    scoreEle.innerText=addScore;
    setTimeout(function(){
        document.getElementById("score").style.boxShadow="0px 0px 0px red";
    },dt*5);
 }
function resetGame() {
    for (var i = snakeArr.length - 1; i >= 1; i--) {
        // workAreaEle.remove(snakeArr[i]);
        snakeArr[i].remove();
        snakeArr.pop();
    }
    snakeLength = 1;
}
function gameOver() {
    clearInterval(intervalID);
    gameOverEle.style.visibility="visible";
    gameOverEle.innerHTML="Game Over! Press 't' to restart";
    resetGame();
    curSTART=CODE_START;
    document.getElementById("btnS").disabled=false;
}
