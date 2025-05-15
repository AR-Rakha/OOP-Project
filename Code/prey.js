class prey extends boid{
    constructor(x,y){

        super(x,y)
        //Max Speed
        this.maxspeed = 3;

        //Velocity
        this.vel=new vector(cos(this.heading)*this.maxspeed,sin(this.heading)*this.maxspeed);


        //Max force -  used to apply the desired direction smoothly to the acceleration
        this.maxforce = 0.5;

        //The rules view range
        this.separationView=25*rangeSlider.value();
        this.alignmentView=50*rangeSlider.value();
        this.cohesionView=75*rangeSlider.value();
    
        
    }

    boidsAlgorithm(boidsArray,predatorArray=[]){

        //Separation
        let separationVector= new vector(0,0);
        let separationTotal = 0;
        
        let runAwayVector= new vector(0,0);
        let runAwayTotal = 0;

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
        for (let other of predatorArray) {
            //Separation
            let dx=this.pos.getX()-other.pos.getX();
            let dy=this.pos.getY()-other.pos.getY();
            let dist = Math.sqrt(dx*dx + dy*dy); 

            if (other !== this&& dist <= 75) {
                let diff=new vector(dx,dy);
                diff.multi(10/dist)
                runAwayVector.add(diff); 
                
                runAwayTotal++;  
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
        
        if (runAwayTotal > 0) {
            runAwayVector.div(runAwayTotal)
            runAwayVector.setMag(this.maxspeed);
            runAwayVector.sub(this.vel);
            runAwayVector.setLimit(this.maxforce*3);
            
            //weight
            runAwayVector.multi(runAwaySlider.value());
            this.acc.add(runAwayVector);
        }
        this.acc.setLimit(this.maxforce*3);
        
    }

    
}