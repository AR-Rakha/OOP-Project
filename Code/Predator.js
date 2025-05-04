class predator extends boid{
    constructor(x,y){

        super(x,y);

        //Max Speed
        this.maxspeed=2;

        //Max force -  used to apply the desired direction smoothly to the acceleration
        this.maxforce = 0.1;

        //The rules view range
        this.separationView=25*rangeSliderPredator.value();
        this.alignmentView=50*rangeSliderPredator.value();
        this.cohesionView=75*rangeSliderPredator.value();
    
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
        
        let aniFin = sin((millis()+this.random)*0.2*this.maxspeed);

        let ani = sin((millis()+this.random)*0.2*this.maxspeed);
        let offAni = sin((millis()+this.random+100)*0.2*this.maxspeed);
        let offAni2 = sin((millis()+this.random-250)*0.2*this.maxspeed);
        let offAni3 = sin((millis()+this.random-350)*0.2*this.maxspeed);


        //body
        
        rotate(offAni*10)   

            //fin Color
            fill(this.finColor)

            //left fin
            translate(2*2,1.5*2);
            rotate(-aniFin*6-30);
            ellipse(-1*2,0,4*2,1*2);
            rotate(aniFin*6+30);
            translate(-2*2,-1.5*2);

            //right fin
            translate(2*2,-1.5*2);
            rotate(-aniFin*6+30);
            ellipse(-1*2,0,4*2,1*2);
            rotate(aniFin*6-30);
            translate(-2*2,1.5*2);

        fill(this.baseColor)
        ellipse(1*2,0, 7*2,4*2)

            
        
        
        
        
            //tail Start
            translate(-1*2,0)

            rotate(offAni2*10)
            fill(this.tailColor)
            ellipse(-1*2,0,7*2,3*2)

                //tail End
                translate(-3*2,0)

                rotate(offAni3*10)
                fill(this.tailColor)
                ellipse(-2*2,0,7*2,1*2)

                
                
                rotate(-offAni3*10)
                translate(3*2,0)
            
            rotate(-offAni2*10)
            translate(1*2,0)

            
        
            //head
            translate(2*2,0)
            
            rotate(-ani*15)   
            fill(this.baseColor)     
            ellipse(1*2,0, 4*2,3*2)

            rotate(ani*15)
            translate(-2*2,0)


            //backfin
            fill(this.backFinColor)
            ellipse(0,0, 4*2,0.5*2)
            

        //resets the rotation and transformation
        pop();
        

    }
    
    boidsAlgorithm(boidsArray,preyArray=[]){

        //Separation
        let separationVector= new vector(0,0);
        let separationTotal = 0;
        
        let huntVector= new vector(0,0);
        let huntTotal = 0;

        //Alignment
        let alignmentVector= new vector(0,0);
        let alignmentTotal = 0;
        
        //Cohesion
        let cohesionVector= new vector(0,0);
        let cohesionTotal = 0;
        
        this.separationView=25*rangeSliderPredator.value();
        this.alignmentView=50*rangeSliderPredator.value();
        this.cohesionView=75*rangeSliderPredator.value();

        for (let other of boidsArray) {
            
            //Separation
            let dx=this.pos.getX()-other.pos.getX();
            let dy=this.pos.getY()-other.pos.getY();
            let dist = Math.sqrt(dx*dx + dy*dy); 

            let toOther = new vector(other.pos.getX()-this.pos.getX(),other.pos.getY()-this.pos.getY())
            let dotView = this.vel.dot(toOther)

            let inView = dotView>-0.6;

            
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
        for (let other of preyArray) {
            //Hunt
            let dx=other.pos.getX()-this.pos.getX();
            let dy=other.pos.getY()-this.pos.getY();
            let dist = Math.sqrt(dx*dx + dy*dy); 

            if (other !== this&& dist <= 125) {
                let diff=new vector(dx,dy);
                diff.multi(10/dist)
                huntVector.add(diff); 
                
                huntTotal++;  
            }
        }

        if (separationTotal > 0) {
            separationVector.div(separationTotal);
            separationVector.setMag(this.maxspeed);
            separationVector.sub(this.vel); 
            separationVector.setLimit(this.maxforce);

            //weight
            separationVector.multi(separationSliderPredator.value());
            this.acc.add(separationVector);
        }

        if (alignmentTotal > 0) {
            alignmentVector.div(alignmentTotal);
            alignmentVector.setMag(this.maxspeed);
            alignmentVector.sub(this.vel)
            alignmentVector.setLimit(this.maxforce);
            
            //weight
            alignmentVector.multi(alignmentSliderPredator.value());
            this.acc.add(alignmentVector);
        }
        
        if(cohesionTotal>0){
            cohesionVector.div(cohesionTotal);
            cohesionVector.sub(this.pos);
            cohesionVector.setLimit(this.maxforce);

            //weight
            cohesionVector.multi(cohesionSliderPredator.value());
            this.acc.add(cohesionVector);
        }

        this.acc.setLimit(this.maxforce);
        
        if (huntTotal > 0) {
            huntVector.div(huntTotal)
            huntVector.setMag(this.maxspeed);
            huntVector.sub(this.vel);
            huntVector.setLimit(this.maxforce);
            
            //weight
            huntVector.multi(huntSlider.value());
            this.acc.add(huntVector);
        }
        this.acc.setLimit(this.maxforce);
        
    }

}