//Boids array/list
let preys=[];

let predators=[];


//Number of boids
let preyNum=300;

let predatorNum=5;


// [base color, fin color, backfin color, tail color,]
let boidColor;

let boidColorPredator;


//slider weights that control how strong the rule is
let separationSlider;
let alignmentSlider;
let cohesionSlider;
let runAwaySlider;
let rangeSlider;


let separationSliderPredator;
let alignmentSliderPredator;
let cohesionSliderPredator;
let huntSlider;
let rangeSliderPredator;


let ruleText;



function setup() 
{
	createCanvas(windowWidth, 600);
	background(10,10,40);
	angleMode(DEGREES)

	//values and position of sliders

	

	ruleText=createDiv('<h5>Separation</h5>');
	ruleText.position(65, height+5);
	separationSlider = createSlider(0, 5,0,0.5);
	separationSlider.position(10, height+30)
	separationSlider.addClass("slider");

	ruleText=createDiv('<h5>Alignment</h5>');
	ruleText.position(65, height+45);
	alignmentSlider = createSlider(0, 1,0,0.1);
	alignmentSlider.position(10, height+70);
	alignmentSlider.addClass("slider");

	ruleText=createDiv('<h5>Cohesion</h5>');
	ruleText.position(65, height+85);
	cohesionSlider = createSlider(0, 1,0,0.1);
	cohesionSlider.position(10, height+110);
	cohesionSlider.addClass("slider");


	ruleText=createDiv('<h5>Run Away</h5>');
	ruleText.position(265, height+5);
	runAwaySlider = createSlider(0, 1,0,0.1);
	runAwaySlider.position(210, height+30);
	runAwaySlider.addClass("slider");


	ruleText=createDiv('<h5>View Range</h5>');
	ruleText.position(265, height+45);
	rangeSlider = createSlider(0.5,2,1,0.1);
	rangeSlider.position(210,height+70);
	rangeSlider.addClass("slider");
	

	
	
	ruleText=createDiv('<h5>Separation</h5>');
	ruleText.position(width-125, height+5);
	separationSliderPredator = createSlider(0, 5,0,0.5);
	separationSliderPredator.position(width-180, height+30);
	separationSliderPredator.addClass("sliderPredator");

	ruleText=createDiv('<h5>Alignment</h5>');
	ruleText.position(width-125, height+45);
	alignmentSliderPredator = createSlider(0, 1,0,0.1);
	alignmentSliderPredator.position(width-180, height+70);
	alignmentSliderPredator.addClass("sliderPredator");

	ruleText=createDiv('<h5>Cohesion</h5>');
	ruleText.position(width-125, height+85);
	cohesionSliderPredator = createSlider(0, 1,0,0.1);
	cohesionSliderPredator.position(width-180, height+110);
	cohesionSliderPredator.addClass("sliderPredator");

	ruleText=createDiv('<h5> Hunt </h5>');
	ruleText.position(width-325, height+5);
	huntSlider = createSlider(0, 1,0,0.1);
	huntSlider.position(width-380, height+30);
	huntSlider.addClass("sliderPredator");

	ruleText=createDiv('<h5>View Range</h5>');
	ruleText.position(width-325, height+45);
	rangeSliderPredator = createSlider(0.5,2,1,0.1);
	rangeSliderPredator.position(width-380,height+70);
	rangeSliderPredator.addClass("sliderPredator");





	// Color list for the boids because they have multiple shapes and colors
	boidColor=[color(200,200,0),color(150,150,0),color(100,100,0),color(200,200,0)]
	boidColorPredator=[color(150,0,120),color(130,0,120),color(100,0,100),color(150,0,120)]

	// Creating new boids with random position on a circle in a loop depending on the set numbers of boids
	for (let i = 0; i < preyNum; i++) {
		let r = random(360);
		preys.push(new prey(width/2+cos(r)*100, height/2+sin(r)*100));
		//setting the colors
		preys[i].setColor(boidColor[0],boidColor[1],boidColor[2],boidColor[3])
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
	for(let i=0; i<preyNum; i++){

		//Checking if boid is a certant distance (60 px) of the border and and sets the desired direction accordingly
		preys[i].border(60);

		//Applies the rules to the boids (separation,alignment,cohesion) and sets the desired direction accordingly
		preys[i].boidsAlgorithm(preys,predators);
		
		//Updates the velocity according to the acceleration and the position according to the velocity
		preys[i].update();

		//Draws the boid (fish shape)
		preys[i].show();

		preys[i].updateEnd();
	}
	for(let i=0; i<predatorNum; i++){

		//Checking if boid is a certant distance (60 px) of the border and and sets the desired direction accordingly
		predators[i].border(60);

		//Applies the rules to the boids (separation,alignment,cohesion) and sets the desired direction accordingly
		predators[i].boidsAlgorithm(predators,preys);
		
		//Updates the velocity according to the acceleration and the position according to the velocity
		predators[i].update();

		//Draws the boid (fish shape)
		predators[i].show();

		predators[i].updateEnd();
	}
}



