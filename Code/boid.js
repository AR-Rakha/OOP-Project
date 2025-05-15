class boid{
    constructor(x,y){

        //Max Speed
        this.maxspeed = 0;
        

        //Max force -  used to apply the desired direction smoothly to the acceleration
        this.maxforce = 0.5;

        //The rules view range
        this.separationView=25;
        this.alignmentView=50;
        this.cohesionView=75;
        
        //Position
        this.pos=new vector(x,y);

        //Heading - sets the direction of the boid to the center of the canvas in the start
        this.heading = atan2(height/2-this.pos.getY(), width/2-this.pos.getX());

        //Velocity
        this.vel=new vector(cos(this.heading)*this.maxspeed,sin(this.heading)*this.maxspeed);

        //Acceleration
        this.acc=new vector(0,0);

        // Colors of the boids
        this.baseColor=color(200,200,0);
        this.finColor=color(200,200,0);
        this.backFinColor=color(200,200,0);
        this.tailColor=color(200,200,0);

        //offsets the animation randomly so the animation of the boids is not sinced
        this.random=random(500);
        
    }

    //Method for setting the color
    setColor(baseColor,finColor,backFinColor,tailColor){
        this.baseColor=baseColor;
        this.finColor=finColor;
        this.backFinColor=backFinColor;
        this.tailColor=tailColor;
    }

    //Draws and animates the boids
    show(){
        this.heading=atan2(this.vel.getY(),this.vel.getX())

        push();

        translate(this.pos.getX(), this.pos.getY());
        rotate(this.heading)

        strokeWeight(2);
        noStroke()

        //animation
        
        let aniFin = sin((millis()+this.random)*0.2*this.maxspeed*2);

        let ani = sin((millis()+this.random)*0.2*this.maxspeed*2);
        let offAni = sin((millis()+this.random+100)*0.2*this.maxspeed*2);
        let offAni2 = sin((millis()+this.random-250)*0.2*this.maxspeed*2);
        let offAni3 = sin((millis()+this.random-350)*0.2*this.maxspeed*2);


        //body
        
        rotate(offAni*10)   

            //fin Color
            fill(this.finColor)

            //left fin
            translate(2,1.5);
            rotate(-aniFin*6-30);

            ellipse(-1,0,4,1);

            rotate(aniFin*6+30);
            translate(-2,-1.5);

            //right fin
            translate(2,-1.5);
            rotate(-aniFin*6+30);

            ellipse(-1,0,4,1);

            rotate(aniFin*6-30);
            translate(-2,1.5);

        fill(this.baseColor)
        ellipse(1,0, 7,4)

            //tail Start
            translate(-1,0)
            rotate(offAni2*10)

            fill(this.tailColor)
            ellipse(-1,0,7,2.5)

                //tail End
                translate(-3,0)
                rotate(offAni3*10)

                fill(this.tailColor)
                ellipse(-2,0,7,1)

                rotate(-offAni3*10)
                translate(3,0)
            
            rotate(-offAni2*10)
            translate(1,0)

            
        
            //head
            translate(2,0)
            rotate(-ani*15)   

            fill(this.baseColor)     
            ellipse(1.5,0, 4,3)

            rotate(ani*15)
            translate(-2,0)


            //backfin
            fill(this.backFinColor)
            ellipse(0.5,0, 4,1)
            

        //resets the rotation and transformation
        pop();
        

    }


    update(){
        this.vel.add(this.acc);
        this.vel.setMag(this.maxspeed);
        this.pos.add(this.vel);
    }


    updateEnd(){
        this.acc.multi(0);
    }

    boidsAlgorithm(boidsArray,predatorArray=[]){

        //Separation
        let separationVector= new vector(0,0);
        let separationTotal = 0;
        

        //Alignment
        let alignmentVector= new vector(0,0);
        let alignmentTotal = 0;
        
        //Cohesion
        let cohesionVector= new vector(0,0);
        let cohesionTotal = 0;

        this.separationView=25*rangeSlider.value();
        this.alignmentView=50*rangeSlider.value();
        this.cohesionView=75*rangeSlider.value();
        
        for (let other of boidsArray) {
            
            //Separation
            let dx=this.pos.getX()-other.pos.getX();
            let dy=this.pos.getY()-other.pos.getY();
            let dist = Math.sqrt(dx*dx + dy*dy); 

            let toOther = new vector(other.pos.getX()-this.pos.getX(),other.pos.getY()-this.pos.getY())
            let dotView = this.vel.dot(toOther)

            let inView = dotView>-0.8;

            
            if (other !== this&& dist <= this.separationView && dist > 0.0001 &&inView) {
                let diff=new vector(dx,dy);
                diff.multi(5/dist)
                separationVector.add(diff); 
                
                separationTotal++;  
                
            }

            //Alignment
            if (other !== this&& dist <= this.alignmentView&&inView) {
                alignmentVector.add(other.vel);

                alignmentTotal++;
            }
            
            //Cohesion
            if (other !== this&& dist <= this.cohesionView&&inView) {
                cohesionVector.add(other.pos);
                
                cohesionTotal++;
            }
        }

        if (separationTotal > 0) {
            separationVector.div(separationTotal);
            separationVector.setMag(this.maxspeed);
            separationVector.sub(this.vel); 
            separationVector.setLimit(this.maxforce);

            //weight
            separationVector.multi(separationSlider.value());
            this.acc.add(separationVector);
        }

        if (alignmentTotal > 0) {
            alignmentVector.div(alignmentTotal);
            alignmentVector.setMag(this.maxspeed);
            alignmentVector.sub(this.vel)
            alignmentVector.setLimit(this.maxforce);
            
            //weight
            alignmentVector.multi(alignmentSlider.value());
            this.acc.add(alignmentVector);
        }
        
        if(cohesionTotal>0){
            cohesionVector.div(cohesionTotal);
            cohesionVector.sub(this.pos);
            cohesionVector.setLimit(this.maxforce);

            //weight
            cohesionVector.multi(cohesionSlider.value());
            this.acc.add(cohesionVector);
        }

        this.acc.setLimit(this.maxforce);
        
        
    }

    
    //Method to Check the borders of the canvas
    border(offset){
        
        let desired = null;
        if (this.pos.getX()< offset) {
            desired = new vector(this.maxspeed, this.vel.getY());
        } else if (this.pos.getX()> width - offset) {
            desired = new vector(-this.maxspeed, this.vel.getY());
        }if (this.pos.getY()< offset) {
            desired = new vector(this.vel.getX(), this.maxspeed);
        } else if (this.pos.getY()> height - offset) {
            desired = new vector(this.vel.getX(), -this.maxspeed);
        }
        
        if (desired !== null) {
            desired.normalize();
            desired.multi(this.maxspeed);
            let steer = new vector(desired.getX()-this.vel.getX(),desired.getY()-this.vel.getY());;
            steer.setLimit(this.maxforce*50);
            this.acc.add(steer)
        }

    }  
}