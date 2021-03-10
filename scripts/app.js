// ****************
// Global elements
// ****************
const choiceList = $('.choice-list');
const checkAnswer = $('.check-answer');
const nextBtn = $('.next-btn');

let userChoice;
let userLabel;
let questionCount = 0;
let userScore = 0;
let currentQuestion;
let questionData;
let correctAnswer;
let shuffledOptions;

// ****************************************
// Show Start Quiz Message When Page Loads
// ****************************************
$('document').ready(function () {
	$('#quiz-container').addClass('d-none');
	$('#results-container').addClass('d-none');

	// Display Data from API
	$.getJSON(
		'https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple'
	).done(function (data) {
		questionData = data.results;
	});
});

// **********
// Show Quiz
// **********
$('#start-btn').click(function () {
	$('#start-container').fadeOut('slow', function () {
		$('#start-container').addClass('d-none');
		$('#quiz-container').removeClass('d-none');
		$('.finish-btn').addClass('d-none');
		showQuestion(questionCount);
		showChoices(questionCount);
		showCheckBtn();
		displayQuestionCount(questionCount + 1);
		progressBar(questionCount);
		evaluateAnswer();
	});
});

// *****************
// Display Question
// *****************
const showQuestion = index => {
	const questionText = $('.question');
	questionText.html(
		'<h2 class="card-text py-4 px-5">' +
			questionData[index].question +
			'</h2>'
	);
};

// ****************
// Display Choices
// ****************
const showChoices = index => {
	// Merge correct and incorrect answers
	let incorrectAnswers = questionData[index].incorrect_answers;
	correctAnswer = questionData[index].correct_answer;
	let allChoices = incorrectAnswers.concat(correctAnswer);
	shuffledOptions = shuffle(allChoices);

	let availableChoices =
		'<label class="d-flex rounded mb-4 mx-5 py-3 choice-border btn btn-info justify-content-between align-items-center" id="label-1">' +
		'<div class="d-flex align-items-center ps-2 choice-container">' +
		'<input class="me-2" type="radio" name="choice" id="choice-1"/>' +
		'<span class="px-2 text-start" id="userSelection-1">' +
		shuffledOptions[0] +
		'</span>' +
		'</div>' +
		'</label>' +
		'<label class="d-flex rounded mb-4 mx-5 py-3 choice-border btn btn-info justify-content-between align-items-center" id="label-2">' +
		'<div class="d-flex align-items-center ps-2 choice-container">' +
		'<input class="me-2" type="radio" name="choice" id="choice-2"/>' +
		'<span class="px-2 text-start" id="userSelection-2">' +
		shuffledOptions[1] +
		'</span>' +
		'</div>' +
		'</label>' +
		'<label class="d-flex rounded mb-4 mx-5 py-3 choice-border btn btn-info justify-content-between align-items-center" id="label-3">' +
		'<div class="d-flex align-items-center ps-2 choice-container">' +
		'<input class="me-2" type="radio" name="choice" id="choice-3"/>' +
		'<span class="px-2 text-start" id="userSelection-3">' +
		shuffledOptions[2] +
		'</span>' +
		'</div>' +
		'</label>' +
		'<label class="d-flex rounded mb-4 mx-5 py-3 choice-border btn btn-info justify-content-between align-items-center" id="label-4">' +
		'<div class="d-flex align-items-center ps-2 choice-container">' +
		'<input class="me-2" type="radio" name="choice" id="choice-4"/>' +
		'<span class="px-2 text-start" id="userSelection-4">' +
		shuffledOptions[3] +
		'</span>' +
		'</div>' +
		'</label>';

	choiceList.html(availableChoices);

	let userChoice1 = $('#label-1');
	let userChoice2 = $('#label-2');
	let userChoice3 = $('#label-3');
	let userChoice4 = $('#label-4');

	userChoice1.on('click', function () {
		userChoice = userChoice1.text();
		userLabel = userChoice1;
	});
	userChoice2.on('click', function () {
		userChoice = userChoice2.text();
		userLabel = userChoice2;
	});
	userChoice3.on('click', function () {
		userChoice = userChoice3.text();
		userLabel = userChoice3;
	});
	userChoice4.on('click', function () {
		userChoice = userChoice4.text();
		userLabel = userChoice4;
	});
};

// ***********************
// Generate Random Answer
// ***********************
const shuffle = array => {
	let m = array.length,
		t,
		i;
	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);
		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
};

// ****************
// Evaluate Answer
// ****************
const evaluateAnswer = () => {
	checkAnswer.click(function () {
		// Correct Answer
		if (userChoice == correctAnswer) {
			console.log('Correct Answer 🎉');
			userLabel.addClass('correct');
			userLabel.append(
				'<svg class="bi check" width="32" height="32" fill="currentColor"><use xlink:href="img/bootstrap-icons.svg#check"/></svg>'
			);
			$('label').css('pointer-events', 'none');
			userScore++;
			// Wrong Answer
		} else if (userChoice !== correctAnswer) {
			console.log('Wrong Answer 😞');
			userLabel.addClass('wrong');
			userLabel.append(
				'<svg class="bi x" width="32" height="32" fill="currentColor"><use xlink:href="img/bootstrap-icons.svg#x"/></svg>'
			);
			$('label').css('pointer-events', 'none');

			// When user selects wrong answer, correct answer is also shown
			for (let i = 0; i < shuffledOptions.length; i++) {
				if ($('label').eq(i).children().text() == correctAnswer) {
					$('label').eq(i).addClass('correct');
					$('label')
						.eq(i)
						.append(
							'<svg class="bi check" width="32" height="32" fill="currentColor"><use xlink:href="img/bootstrap-icons.svg#check"/></svg>'
						);
				}
			}
		}
		showNextBtn();
		showFinishBtn();
	});
};

// ****************
// Show Next Btn
// ****************
const showNextBtn = () => {
	$('.next-btn').removeClass(`d-none`);
	$('.check-answer').addClass(`d-none`);
};

// ****************
// Show Check Btn
// ****************
const showCheckBtn = () => {
	$('.next-btn').addClass(`d-none`);
	$('.check-answer').removeClass(`d-none`);
};

// ****************
// Next Question
// ****************
nextBtn.on('click', function () {
	questionCount++;
	displayQuestionCount(questionCount + 1);
	showCheckBtn();
	showQuestion(questionCount);
	showChoices(questionCount);
	progressBar(questionCount);
	resetQuestion();
});

// **********************
// Update Question Count
// **********************
const displayQuestionCount = index => {
	const bottomQuestionNumber = $('.question-number');
	let totalQuesCount =
		'<span>' +
		index +
		' <span>of</span> ' +
		questionData.length +
		'</span>';
	bottomQuestionNumber.html(totalQuesCount);
};

// ***************
// Reset Question
// ***************
const resetQuestion = () => {
	$('label').removeClass('correct');
	$('label').removeClass('wrong');
	$('.bi').removeClass('x').empty();
	$('.bi').removeClass('check').empty();
	$('label').css('pointer-events', 'auto');
};

// *******************
// Show Finish Button
// *******************
const showFinishBtn = () => {
	if (questionCount >= questionData.length - 1) {
		$('.next-btn').addClass(`d-none`);
		$('.check-answer').addClass(`d-none`);
		$('.finish-btn').removeClass('d-none');
	}
};

// ***********************
// Show Results Container
// ***********************
$('.finish-btn').on('click', function () {
	$('#results-container').removeClass('d-none');
	$('#quiz-container').addClass('d-none');

	// User Score
	let resultsText;
	const results = $('.results');
	if (userScore > 3) {
		resultsText =
			'<p class="p-4 text-center fs-5"> You scored ' +
			userScore +
			' <span>out of</span> ' +
			questionData.length +
			' Great job!</p>';
		results.html(resultsText);
	} else {
		resultsText =
			'<p class="p-4 text-center fs-5"> You scored ' +
			userScore +
			' <span>out of</span> ' +
			questionData.length +
			' Good effort! Try again to increase your score!</p>';
		results.html(resultsText);
	}
});

// ********************
// Update Progress Bar
// ********************
const progressBar = index => {
	let myBar = $('.progress-bar');
	let width = 0;
	if (width >= 100) {
		clearInterval();
	} else {
		width = ((index + 1) / questionData.length) * 100;
		myBar.css('width', `${width}%`);
	}
};

// *************
// Restart Quiz
// *************
$('.restart-btn').on('click', function () {
	location.reload(true);
});
