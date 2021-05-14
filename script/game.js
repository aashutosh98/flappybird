//game constants

const canvas=document.getElementById("gamescreen");
const ctx=canvas.getContext("2d") ;
const GAME_WIDTH=350;
const GAME_HEIGHT=600;
const DEGREE=Math.PI/180;
const STATE={
    current:0,
    getReady:0,
    game:1,
    over:2
};

let frames=0;
const bg = new Image();
    bg.src="images/background.png";

const fg=new Image()
    fg.src="images/ground.png";

const bird_image=[];
 bird_image[0]= new Image();
 bird_image[1]= new Image();
 bird_image[2]= new Image();
 bird_image[3]= new Image();

 bird_image[0].src="images/bird-1.png";
 bird_image[1].src="images/bird-2.png";
 bird_image[2].src="images/bird-3.png";
 bird_image[3].src="images/bird-2.png";



const sprite = new Image();
sprite.src = "images/sprite.png";


    document.addEventListener("click",function(evt){
        switch(STATE.current){
          case STATE.getReady:
                STATE.current=STATE.game;
                 break;
            case STATE.game:
                bird.flap();
                break;
            case STATE.over:
                let rect = canvas.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                STATE.current = STATE.game;
            }
            break;

        } 

    })
    document.addEventListener("keypress",function(e){
        
                if(e)
                 {
                    switch(STATE.current){
                        case STATE.game:
                            bird.flap();
                            break;
                        case STATE.over:
                            STATE.current=STATE.getReady();
                            pipes.reset();
                             bird.speedReset();
                            score.reset();
                            STATE.current = STATE.getReady;
                            break;
                        case STATE.getReady:
                            STATE.current=STATE.game();
                            break;
                        
                }
        } 

    })

    

     
class Background{
    constructor( )
    {
       
        this.width=GAME_WIDTH;
        this.height=GAME_HEIGHT;
        this.init();
 
    }

    init(){
        ctx.drawImage(bg,0,0,this.width,this.height);
    }
    
    draw()
    {
        ctx.drawImage(bg,0,0,this.width,this.height);


    }
}

class Foreground{
    constructor()
    {
        this.width=400;
        this.height=1 *GAME_HEIGHT/5;
        this.dx=2;
        this.x=0;
        this.y=4/5*GAME_HEIGHT;
    }
        
     draw()
     {
        ctx.drawImage(fg,this.x,this.y,this.width,this.height);
    }

    update(frames){
        if(STATE.current==STATE.game){
            this.x=(this.x-this.dx)%(this.width/10);
        }
    }
}

 
     
const pipes = {
    position : [],
    
    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },
    
    w : 53,
    h : 400,
    gap : 100,
    maxYPos : -150,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(STATE.current !== STATE.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x :  canvas.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
            // COLLISION DETECTION
            // TOP PIPE
            if(bird.xpos + bird.radius > p.x && bird.xpos   < p.x + this.w && bird.ypos - bird.radius > p.y && bird.ypos   < p.y + this.h){
                STATE.current = STATE.over;
             }
            // BOTTOM PIPE
            if(bird.xpos + bird.radius > p.x && bird.xpos  < p.x + this.w && bird.ypos + bird.radius > bottomPipeYPos && bird.ypos < bottomPipeYPos + this.h){
                STATE.current = STATE.over;
                            }
            
            // MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;
            
            // if the pipes go beyond canvas, we delete them from the array
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}


class Bird{
    constructor(){
        this.xpos=(1.5/5)*GAME_WIDTH;
        this.ypos=(1/3)*GAME_HEIGHT;
        this.speed=0;
        this.gravity=.25;
        this.jump=5;
       this.radius=18;
        this.frame=0;
        this.rotation=0;
    }  

    draw(frames)
    {   
        let bird = bird_image[this.frame];
 
  
        ctx.save();
        ctx.translate(this.xpos,this.ypos)  ;
        ctx.rotate(this.rotation);
         ctx.drawImage(bird_image[this.frame%4],-36/2,-36/2,36,36);
        ctx.restore();
 
        }

    flap()
    {
        this.speed=-this.jump;

    }

    update(frames)
    {
        if(STATE.current==STATE.getReady){
             this.ypos=1/3*GAME_HEIGHT;
             this.rotation = 0 * DEGREE;

        }
        else{
        this.speed+=this.gravity;
        this.ypos+=this.speed;
        if(this.ypos+26>=4/5*GAME_HEIGHT){
            this.ypos=4/5*GAME_HEIGHT-26;
            if(STATE.current===STATE.game){
                this.frame=1;
                STATE.current=STATE.over;
            }
        }
        if(this.speed>=this.jump){
           this.rotation=90*DEGREE;
        }
        else{
            this.rotation=-25*DEGREE;
        }
    }
       
        
  }
}

   

const getReady={     
    draw:function(){
        if(STATE.current==STATE.getReady){
        ctx.font="30px Calibri";
        ctx.fillText("Tap to Start",110,300);
        ctx.fillText("Space to Play",90,350);
     }
}

}

const over={    
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : canvas.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(STATE.current == STATE.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
}

const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(STATE.current == STATE.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value,  canvas.width/2, 50);
            ctx.strokeText(this.value,  canvas.width/2, 50);
            
        }else if(STATE.current == STATE.over){
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);
            ctx.fillText("Your Score",80,186);
            // BEST SCORE
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);
            ctx.fillText("HighestScore",80,228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}





var background=new Background();
var foreground = new Foreground();
var bird= new Bird();
 


 //functions

function draw(frames)
{
    over.draw();

    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    background.draw();
    pipes.draw();
    foreground.draw();
    bird.draw();
    getReady.draw();
    over.draw();
    score.draw();
    
  
 }
function update(frames){
    bird.update(frames);
    foreground.update(frames);
    pipes.update();
 
}

function loop()
{
    update(frames);
    draw(frames);
    frames++;
    requestAnimationFrame(loop);
}
loop();
 



