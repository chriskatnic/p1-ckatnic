var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

var scoreUser = 0;
var scoreCPU = 0;


// GET '/' 
// 
// Should return index.html
//
// req = the request
// resp = the response
app.get('/', function(req, resp) {

	console.log("Page requested: ", req.url);
	console.log(__dirname + "/index.html");
	resp.sendFile(__dirname + "/index.html");
});

// POST '/play' 
// 
// Should return a modified index.html with the score updated
//
// req = the request - should contain req.choice
// resp = the response - should contain the updated html
app.post("/play", function(req, resp) {

	// if the user clicked submit with no choice, 
	// chastise them and don't do anything.
	// else, play the game
	if(req.body.choice == undefined){	
		// read html file from local storage and edit it to reflect score
		fs.readFile("indexTemplate.html", "utf-8", function(error, data) {
		
			// document should be html data
			var document = data;
		
			// create the results div
			var results =   "<div>Please make a choice before submitting!";
			results += 	"<h3>CPU Wins: " + scoreCPU + "</h3></ br>";
			results +=	"<h3>Player Wins: " + scoreUser + "</h3></ br>";
			results +=	"</div> </html>";
			
			// combine the template html with the constructed html string above
			// into a single ugly functional html page	
			var indexUpdated = document + results;
		
			//send back this document
			resp.send(indexUpdated);
		
		});
	} else {
		// boolean variables for scorekeeping
		var userWins;
		var tieGame = false;
		
		// get the user's choice
		console.log("Page requested: ", req.url);
		console.log("Input sent: ");
		console.log(req.body.choice);
		var userChoice = req.body.choice;
		
		// get the CPU's choice
		// generate random choice 0, 1, 2 (rock, paper, scissors)
		var cpuChoice = Math.floor(Math.random() * 10) % 3;
		var cpuChoiceString;
		
		// determine the winner
		switch(cpuChoice) {
			// cpu = rock
			case 0:
				cpuChoiceString = "rock";
				
				if ( userChoice === "paper" ) {
					userWins = true;
				}
				else if ( userChoice === "scissors" ) {
					userWins = false;
				}
				else {
					tieGame = true;
				}
				break;
				
			// cpu = paper
			case 1:
				cpuChoiceString = "paper";
				if ( userChoice === "scissors" ) {
					userWins = true;
				}
				else if ( userChoice === "rock" ) {
					userWins = false;
				}
				else {
					tieGame = true;
				}
				break;
			
			// cpu = scissors
			case 2:
				cpuChoiceString = "scissors";
				if ( userChoice === "rock" ) {
					userWins = true;
				}
				else if ( userChoice === "paper" ) {
					userWins = false;
				}
				else {
					tieGame = true;
				}
				break;
		}
	
		// update score
		if(!tieGame) {
			if( userWins ) {
				scoreUser++;
			} else {
				scoreCPU++;
			}
		}
		
		//render template 
		resp.render("index", {_scoreCPU: scoreCPU, _scorePlayer: scoreUser, _cpuChoice: cpuChoiceString});
	
		
	}
	
});

app.listen(3000);
console.log("App server is awake, but the client-mind-reading module failed to start...");
