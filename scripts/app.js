// ****************************
// Bring in necessary elements
// ****************************
const $choiceContainer = $('.choice-container');
const $choiceList = $('.choice-list');
const checkAnswer = $('.check-answer');
const nextBtn = $('.next-btn');
let label;
let questionCount = 0;
let userScore = 0;
let currentQuestion;
let questionData;
let incorrectAnswers;
let correctAnswer;
let allChoices;
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
		userSelection();
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
	incorrectAnswers = questionData[index].incorrect_answers;
	correctAnswer = questionData[index].correct_answer;
	allChoices = incorrectAnswers.concat(correctAnswer);
	shuffledOptions = shuffle(allChoices);

	// Create Options in HTML
	for (let i = 0; i < questionData.length; i++) {
		let answerText = `<input
										class="me-2"
										type="radio"
										name="choice"
										id="choice-${i + 1}"
									/><span class="px-2 text-start" id="userAnswer-${i}">${
			shuffledOptions[i]
		}</span>`;
		$choiceContainer.eq(i).html(answerText);
	}
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

// BUG Not updating user selection, and is saving all the clicked options as answers
// *********************
// User Selected Choice
// *********************
const userSelection = () => {
	for (let i = 0; i < questionData.length; i++) {
		let selectedAnswer = $(`#userAnswer-${i}`).text();
		const iconX = $('.bi').addClass('x');
		const iconCheck = $('.bi').addClass('check');
		label = $('label').addClass(`.userAnswerClass-${i}`);
		label.eq(i).click(function () {
			console.log('user selection function: ' + selectedAnswer);
			evaluateAnswer(
				selectedAnswer,
				label.eq(i),
				iconCheck.eq(i),
				iconX.eq(i)
			);
		});
	}
};

// BUG Evaluating all user clicks
// ****************
// Evaluate Answer
// ****************
const evaluateAnswer = (selection, label, iconCheck, iconX) => {
	checkAnswer.click(function () {
		showNextBtn();
		console.log(selection, correctAnswer);
		if (selection == correctAnswer) {
			console.log('Correct Answer 🎉');
			label.addClass('correct');
			iconCheck.html('<use xlink:href="img/bootstrap-icons.svg#check"/>');
			$('label').css('pointer-events', 'none');
			userScore++;
			console.log(userScore);
		} else if (selection !== correctAnswer) {
			console.log('Wrong Answer 😞');
			label.addClass('wrong');
			iconX.html('<use xlink:href="img/bootstrap-icons.svg#x"/>');
			$('label').css('pointer-events', 'none');

			// When user selects wrong answer, correct answer is also shown
			// BUG
			for (let i = 0; i < questionData.length; i++) {
				if (selection == correctAnswer) {
					console.log(selection);
					$('label').eq(i).addClass('correct');
				}
			}
		}

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
nextBtn.click(function () {
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
$('.finish-btn').click(function () {
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
$('.restart-btn').click(function () {
	location.reload(true);
});
