//Boids array/list
let preys=[];

let predators=[];


//Number of boids
let preyNum=200;

let predatorNum=5;


// [base color, fin and tail color, backfin color]
let boidColor;

let boidColorPredator;


//slider weights that control how strong the rule is

//Prey sliders
let separationSlider;
let alignmentSlider;
let cohesionSlider;
let runAwaySlider;
let rangeSlider;

//Predator sliders
let separationSliderPredator;
let alignmentSliderPredator;
let cohesionSliderPredator;
let huntSlider;
let rangeSliderPredator;

//
let ruleText;



function setup() 
{
	createCanvas(windowWidth, 600);
	background(10,10,40);
	angleMode(DEGREES)

	//values and position of sliders and text

	//---------------------PREY---------------------

		//text
			ruleText=createP('Separation');
			ruleText.position(65, height+5);
		//Slider
		separationSlider = createSlider(0, 5,0,0.5);
		separationSlider.position(10, height+30)
		separationSlider.addClass("slider");

		//text
			ruleText=createP('Alignment');
			ruleText.position(65, height+45);
		//Slider
		alignmentSlider = createSlider(0, 1,0,0.1);
		alignmentSlider.position(10, height+70);
		alignmentSlider.addClass("slider");

		//text
			ruleText=createP('Cohesion');
			ruleText.position(65, height+85);
		//Slider
		cohesionSlider = createSlider(0, 1,0,0.1);
		cohesionSlider.position(10, height+110);
		cohesionSlider.addClass("slider");

		//text
			ruleText=createP('Run Away');
			ruleText.position(265, height+5);
		//Slider
		runAwaySlider = createSlider(0, 1,0,0.1);
		runAwaySlider.position(210, height+30);
		runAwaySlider.addClass("slider");

		//text
			ruleText=createP('View Range');
			ruleText.position(265, height+45);
		//Slider
		rangeSlider = createSlider(0.5,2,1,0.1);
		rangeSlider.position(210,height+70);
		rangeSlider.addClass("slider");

	//---------------------PREY---------------------

	//-------------------PREDATOR-------------------

		//text
			ruleText=createP('Separation');
			ruleText.position(width-125, height+5);
		//Slider
		separationSliderPredator = createSlider(0, 5,0,0.5);
		separationSliderPredator.position(width-180, height+30);
		separationSliderPredator.addClass("sliderPredator");

		//text
			ruleText=createP('Alignment');
			ruleText.position(width-125, height+45);
		//Slider
		alignmentSliderPredator = createSlider(0, 1,0,0.1);
		alignmentSliderPredator.position(width-180, height+70);
		alignmentSliderPredator.addClass("sliderPredator");

		//text
			ruleText=createP('Cohesion');
			ruleText.position(width-125, height+85);
		//Slider
		cohesionSliderPredator = createSlider(0, 1,0,0.1);
		cohesionSliderPredator.position(width-180, height+110);
		cohesionSliderPredator.addClass("sliderPredator");

		//text
			ruleText=createP('Hunt');
			ruleText.position(width-325, height+5);
		//Slider
		huntSlider = createSlider(0, 1,0,0.1);
		huntSlider.position(width-380, height+30);
		huntSlider.addClass("sliderPredator");

		//text
			ruleText=createP('View Range');
			ruleText.position(width-325, height+45);
		//Slider
		rangeSliderPredator = createSlider(0.5,2,1,0.1);
		rangeSliderPredator.position(width-380,height+70);
		rangeSliderPredator.addClass("sliderPredator");

	//-------------------PREDATOR-------------------




	// Color list for the boids because they have multiple shapes and colors
	boidColor=[color(200,200,0),color(150,150,0),color(100,100,0)]
	boidColorPredator=[color(150,0,120),color(130,0,120),color(100,0,100)]

	// Creating new boids with random position on a circle in a loop depending on the set numbers of boids
	for (let i = 0; i < preyNum; i++) {
		let r = random(360);
		preys.push(new prey(width/2+cos(r)*100, height/2+sin(r)*100));
		preys[i].setSliders(separationSlider,alignmentSlider,cohesionSlider,runAwaySlider)
		//setting the colors
		preys[i].setColor(boidColor[0],boidColor[1],boidColor[2])
	}

	for (let i = 0; i < predatorNum; i++) {
		let r = random(360);
		predators.push(new predator(width/2+cos(r)*100, height/2+sin(r)*100));
		predators[i].setSliders(separationSliderPredator,alignmentSliderPredator,cohesionSliderPredator,huntSlider)
		//setting the colors
		predators[i].setColor(boidColorPredator[0],boidColorPredator[1],boidColorPredator[2])
	}
}

function draw()
{


	//Drawing the dark blue background
	background(10,10,40);

	//Looping through the array of boids
	for(let i=0; i<preyNum; i++){

		preys[i].wrapAround();
		
		preys[i].updateSliders(rangeSlider,25,50,75);

		preys[i].boidsAlgorithm(preys,10,1,0.01);

		preys[i].otherBoidsAlgorithm(predators,75,3);
		
		preys[i].update();

		preys[i].show(1,0.3);


	}
	for(let i=0; i<predatorNum; i++){

		predators[i].wrapAround();

		predators[i].updateSliders(rangeSliderPredator,30,60,90);

		predators[i].boidsAlgorithm(predators,10,1,0.01);

		predators[i].otherBoidsAlgorithm(preys,150,3);
		
		predators[i].update();

		predators[i].show(1.75,0.2);

	}
}



