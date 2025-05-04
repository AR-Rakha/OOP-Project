//Boids array/list
let boids=[];

let predators=[];


//Number of boids
let num=200;

let predatorNum=5;


// [base color, fin color, backfin color, tail color,]
let boidColor;

let boidColorPredator;


//slider weights that control how strong the rule is
let separationSlider;
let alignmentSlider;
let cohesionSlider;
let runAwaySlider;

let separationSliderPredator;
let alignmentSliderPredator;
let cohesionSliderPredator;
let huntSlider;


function setup() 
{
	createCanvas(windowWidth, 600);
	background(10,10,40);
	angleMode(DEGREES)

	//values and position of sliders
	separationSlider = createSlider(0, 5,0,0.5);
	separationSlider.position(5, height+3)
	alignmentSlider = createSlider(0, 1,0,0.1);
	alignmentSlider.position(5, height+27)
	cohesionSlider = createSlider(0, 1,0,0.1);
	cohesionSlider.position(5, height+52)
	runAwaySlider = createSlider(0, 1,0,0.1);
	runAwaySlider.position(5, height+78)
	
	separationSliderPredator = createSlider(0, 5,0,0.5);
	separationSliderPredator.position(width-165, height+3)
	alignmentSliderPredator = createSlider(0, 1,0,0.1);
	alignmentSliderPredator.position(width-165, height+27)
	cohesionSliderPredator = createSlider(0, 1,0,0.1);
	cohesionSliderPredator.position(width-165, height+52)
	huntSlider = createSlider(0, 1,0,0.1);
	huntSlider.position(width-165, height+78)

	// Color list for the boids because they have multiple shapes and colors
	boidColor=[color(200,200,0),color(150,150,0),color(100,100,0),color(200,200,0)]
	boidColorPredator=[color(150,0,120),color(130,0,120),color(100,0,100),color(150,0,120)]

	// Creating new boids with random position on a circle in a loop depending on the set numbers of boids
	for (let i = 0; i < num; i++) {
		let r = random(360);
		boids.push(new boid(width/2+cos(r)*100, height/2+sin(r)*100));
		//setting the colors
		boids[i].setColor(boidColor[0],boidColor[1],boidColor[2],boidColor[3])
	}

	for (let i = 0; i < predatorNum; i++) {
		let r = random(360);
		predators.push(new predator(width/2+cos(r)*100, height/2+sin(r)*100));
		//setting the colors
		predators[i].setColor(boidColorPredator[0],boidColorPredator[1],boidColorPredator[2],boidColorPredator[3])
	}
}

function draw()
{
	//Drawing the dark blue background
	background(10,10,40);

	//Looping through the array of boids
	for(let i=0; i<num; i++){

		//Checking if boid is a certant distance (60 px) of the border and and sets the desired direction accordingly
		boids[i].border(60);

		//Applies the rules to the boids (separation,alignment,cohesion) and sets the desired direction accordingly
		boids[i].boidsAlgorithm(boids,predators);
		
		//Updates the velocity according to the acceleration and the position according to the velocity
		boids[i].update();

		//Draws the boid (fish shape)
		boids[i].show();

		boids[i].updateEnd();
	}
	for(let i=0; i<predatorNum; i++){

		//Checking if boid is a certant distance (60 px) of the border and and sets the desired direction accordingly
		predators[i].border(60);

		//Applies the rules to the boids (separation,alignment,cohesion) and sets the desired direction accordingly
		predators[i].boidsAlgorithm(predators,boids);
		
		//Updates the velocity according to the acceleration and the position according to the velocity
		predators[i].update();

		//Draws the boid (fish shape)
		predators[i].show();

		predators[i].updateEnd();
	}
}



