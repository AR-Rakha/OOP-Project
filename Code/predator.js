class predator extends boid{
    constructor(x,y){

        super(x,y);

        //Max Speed
        this.maxspeed=2.5;

        //Min Speed
        this.minspeed = 2;

        //Velocity
        this.vel=new vector(cos(this.heading)*this.maxspeed,sin(this.heading)*this.maxspeed);
        
        //Max force 
        this.maxforce = 0.15;

    
    }

    


    otherBoidsAlgorithm(otherBoidArray,otherBoidViewRange,tunedOtherStrength){
        let huntVector= new vector(0,0);
        let huntTotal = 0;


        for (let other of otherBoidArray) {
            //Hunt
            let toOther = new vector(other.pos.getX()-this.pos.getX(),other.pos.getY()-this.pos.getY());

            let dist = toOther.getMag(); 
            let dotView = this.vel.dot(toOther);

            let inView = dotView > -0.1;

            if (other !== this&& dist <= otherBoidViewRange && dist > 0.001 && inView) {
                let diff=toOther.copy();
                diff.setMag(1/dist)
                huntVector.add(diff); 
                
                huntTotal++;  
            }
        }

        if (huntTotal > 0) {
            huntVector.div(huntTotal)
            
            //weight
            huntVector.multi(this.oSlider.value()*tunedOtherStrength);
            this.acc.add(huntVector);
        }
        this.acc.setLimit(this.maxforce);
    }
}
