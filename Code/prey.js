class prey extends boid{
    constructor(x,y){

        super(x,y)
        //Max Speed
        this.maxspeed = 3;

        //Min Speed
        this.minspeed = 2;

        //Velocity
        this.vel=new vector(cos(this.heading)*this.maxspeed,sin(this.heading)*this.maxspeed);


        //Max force -  used to apply the desired direction smoothly to the acceleration
        this.maxforce = 0.4;
     
    }

    
}