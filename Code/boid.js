class boid{
    constructor(x,y){

        //Max Speed
        this.maxspeed;

        //Min Speed
        this.minspeed;
        

        //Max force -  used to apply the desired direction smoothly to the acceleration
        this.maxforce = 0.5;

        //The rules view range
        this.separationView;
        this.alignmentView;
        this.cohesionView;

        //Sliders
        this.sSlider;
        this.aSlider;
        this.cSlider;
        this.oSlider;

        // viewAngle

        // 1 = cant only se what is right in front of it - 0 degrees of view
        // 0 = sees what is in front of it and not behind it - 180 degrees of view 
        // -1 = sees everything - 360 degrees of view 

        this.viewAngle=-0.3;

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

        //offsets the animation randomly so the animation of the boids is not sinced
        this.random=random(500);
        
    }

    //Method for setting the color
    setColor(baseColor,finColor,backFinColor){
        this.baseColor=baseColor;
        this.finColor=finColor;
        this.backFinColor=backFinColor;
        
    }

    //Draws and animates the boids
    show(size,animationSpeed){
        this.heading=atan2(this.vel.getY(),this.vel.getX())
        push();
        translate(this.pos.getX(), this.pos.getY());
        rotate(this.heading)

        strokeWeight(2);
        noStroke()

        //animation
        
        let aniFin = sin((millis()+this.random)*animationSpeed*this.vel.getMag());
        let ani = sin((millis()+this.random)*animationSpeed*this.vel.getMag());
        let offAni = sin((millis()+this.random+100)*animationSpeed*this.vel.getMag());
        let offAni2 = sin((millis()+this.random-150)*animationSpeed*this.vel.getMag());
        let offAni3 = sin((millis()+this.random-250)*animationSpeed*this.vel.getMag());


        //body
        
        rotate(offAni*10)   

            //fin Color
            fill(this.finColor)

            //left fin
            translate(2*size,1.5*size);
            rotate(-ani*6-30);
            ellipse(-1*size,0,4*size,1*size);
            rotate(ani*6+30);
            translate(-2*size,-1.5*size);

            //right fin
            translate(2*size,-1.5*size);
            rotate(-aniFin*6+30);
            ellipse(-1*size,0,4*size,1*size);
            rotate(aniFin*6-30);
            translate(-2*size,1.5*size);

        fill(this.baseColor)
        ellipse(1*size,0, 7*size,3.5*size)

            
        
        
        
        
            //tail Start
            translate(-1*size,0)
            rotate(offAni2*10)

                //tail End
                translate(-5*size,0)

                rotate(offAni3*10)
                fill(this.finColor)
                ellipse(-0.5*size,0,7*size,1*size)
                
                
                rotate(-offAni3*10)
                translate(5*size,0)
            

            fill(this.baseColor)
            ellipse(-1*size,0,9*size,2.5*size)
            rotate(-offAni2*10)
            translate(1*size,0)

            
        
            //head
            translate(2*size,0)
            
            rotate(-ani*15)   
            fill(this.baseColor)     
            ellipse(1*size,0, 4*size,2.75*size)

            rotate(ani*15)
            translate(-2*size,0)


            //backfin
            fill(this.backFinColor)
            ellipse(0,0, 4*size,0.5*size)
            

        //resets the rotation and transformation
        pop();
        

    }


    update(){
        this.vel.add(this.acc);
        this.vel.setMinMaxLimit(this.minspeed,this.maxspeed);
        this.pos.add(this.vel);
    }

    updateSliders(rSlider,separationStrength,alignmentStrength,cohesionStrength){
        this.separationView=separationStrength*rSlider.value();
        this.alignmentView=alignmentStrength*rSlider.value();
        this.cohesionView=cohesionStrength*rSlider.value();
    }

    setSliders(sS,aS,cS,oS){
        this.sSlider=sS;
        this.aSlider=aS;
        this.cSlider=cS;
        this.oSlider=oS;
    }

    updateEnd(){
        this.acc.multi(0);
    }

    

    boidsAlgorithm(boidsArray,tunedSeparationStrength,tunedAlignmentStrength,tunedCohesionStrength){

        //Separation
        let separationVector= new vector(0,0);
        let separationTotal = 0;
        

        //Alignment
        let alignmentVector= new vector(0,0);
        let alignmentTotal = 0;
        
        //Cohesion
        let cohesionVector= new vector(0,0);
        let cohesionTotal = 0;
        


        for (let other of boidsArray) {
  
            let toOther = new vector(other.pos.getX()-this.pos.getX(),other.pos.getY()-this.pos.getY());
            
            let dist = toOther.getMag(); 

            let dotView = this.vel.dot(toOther);

            let inView = dotView > this.viewAngle; // field of view angle threshold
            
            //Separation
            if (other !== this&& dist <= this.separationView && dist > 0.0001 && inView) {
                let diff=toOther.copy().negative();
                diff.multi(1/dist)
                separationVector.add(diff); 
                
                separationTotal++;  
                
            }

            //Alignment
            if (other !== this&& dist <= this.alignmentView && inView) {
                alignmentVector.add(other.vel);

                alignmentTotal++;
            }
            
            //Cohesion
            if (other !== this&& dist <= this.cohesionView && inView) {
                cohesionVector.add(other.pos);
                
                cohesionTotal++;
            }
        }

        if (separationTotal > 0) {
            separationVector.div(separationTotal);


            //weight
            separationVector.multi(this.sSlider.value()*tunedSeparationStrength);
            this.acc.add(separationVector);
        }

        if (alignmentTotal > 0) {
            alignmentVector.div(alignmentTotal);

            
            //weight
            alignmentVector.multi(this.aSlider.value()*tunedAlignmentStrength);
            this.acc.add(alignmentVector);
        }
        
        if(cohesionTotal>0){
            cohesionVector.div(cohesionTotal);
            cohesionVector.sub(this.pos);

            //weight
            cohesionVector.multi(this.cSlider.value()*tunedCohesionStrength);
            this.acc.add(cohesionVector);
        }

        this.acc.setLimit(this.maxforce);
        
        
    }


    otherBoidsAlgorithm(otherBoidArray,otherBoidViewRange,tunedOtherStrength){
        let runAwayVector= new vector(0,0);
        let runAwayTotal = 0;

        for (let other of otherBoidArray) {
           
            let toOther = new vector(other.pos.getX()-this.pos.getX(),other.pos.getY()-this.pos.getY());
            

            let dist = toOther.getMag(); 
            let dotView = this.vel.dot(toOther);

            let inView = dotView > this.viewAngle;

            if (other !== this&& dist <= otherBoidViewRange && dist > 0.0001 &&inView) {
                let diff=toOther.copy().negative();
                diff.multi(1/dist)
                runAwayVector.add(diff); 
                
                runAwayTotal++;  
            }
        }

        if (runAwayTotal > 0) {
            runAwayVector.div(runAwayTotal)
            
            //weight
            runAwayVector.multi(this.oSlider.value()*tunedOtherStrength);
            this.acc.add(runAwayVector);
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
            
            desired.setMag(this.maxspeed);
            let steer = new vector(desired.getX()-this.vel.getX(),desired.getY()-this.vel.getY());;
            steer.setLimit(this.maxforce);
            this.acc.add(steer)
        }

    }  


    wrapAround(){
        this.pos.setX((this.pos.getX() + width) % width);
        this.pos.setY((this.pos.getY() + height) % height);
    }
}