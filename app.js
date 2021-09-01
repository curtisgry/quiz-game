const cat = document.querySelector('.cat');
const dif = document.querySelector('.dif');
const qbutton = document.querySelector('.qbtn');
const h2 = document.querySelector('h2');
const qText = document.querySelector('h3');
const submitBtn = document.querySelector('.sub-btn');
const resetBtn = document.querySelector('.reset-btn');
const questionContainer = document.querySelector('.question .card-body');
const allAnswers = document.querySelectorAll('.ans');
const radios = document.querySelectorAll('input[type="radio"]');
const inputArea = document.querySelector('.question-container');
let scoreValue = 0;

const outcome = document.createElement('H3');
questionContainer.append(outcome);
const score = document.createElement('H3');
score.innerText = 0;
score.classList.add('score');
questionContainer.append(score);

let correctAnswer = '';

const getQuestionInfo = function () {
        return [cat.value, dif.value];
};

function reset() {
        cat.value = 'any';
        dif.value = 'any';
        cat.disabled = false;
        dif.disabled = false;
        qbutton.disabled = false;
        inputArea.classList.remove('fade-in');
        inputArea.classList.add('fade-out');
}

resetBtn.addEventListener('click', function (e) {
        e.preventDefault();
        reset();
        resetColors(allAnswers);
});

function randomAnswer(answersArr) {
        let copy = Array.from(answersArr);
        return function () {
                if (copy.length < 1) {
                        copy = Array.from(answersArr);
                }
                const index = Math.floor(Math.random() * copy.length);
                const item = copy[index];
                copy.splice(index, 1);
                return item;
        };
}

function makeAnsList(arr, ans) {
        for (let i = 0; i < arr.length; i++) {
                arr[i].innerHTML = `<p>${ans()}</p>`;
        }
}

async function getData() {
        resetColors(allAnswers);
        const params = getQuestionInfo();
        const response = await axios.get(
                `https://opentdb.com/api.php?amount=1&category=${params[0]}&difficulty=${params[1]}&type=multiple`
        );
        const data = response.data.results[0];
        const answersToQues = data.incorrect_answers;
        correctAnswer = data.correct_answer;
        answersToQues.push(correctAnswer);
        console.log(answersToQues);
        const choseAnswer = randomAnswer(answersToQues);
        h2.innerHTML = data.category;
        qText.innerHTML = data.question;
        console.log(correctAnswer);
        makeAnsList(allAnswers, choseAnswer);
        inputArea.classList.remove('hide');
        inputArea.classList.add('fade-in');
}

qbutton.addEventListener('click', async function (e) {
        e.preventDefault();
        resetSelected(radios);
        const config = getQuestionInfo();
        if (config[0] !== 'any' && config[1] !== 'any') {
                try {
                        getData();
                        qbutton.disabled = true;
                        cat.disabled = true;
                        dif.disabled = true;
                } catch (e) {
                        inputArea.classList.remove('hide');
                        h2.innerHTML = 'No Question Found, Sorry :(';
                        console.log('Error!', e);
                }
        }
});

function resetSelected(radBtns) {
        for (let i = 0; i < radBtns.length; i++) {
                if (radBtns[i].checked) {
                        radBtns[i].checked = false;
                }
        }
}

function isOneChecked() {
        const chx = document.querySelectorAll('input[type="radio"]');
        for (let i = 0; i < chx.length; i++) {
                if (chx[i].type === 'radio' && chx[i].checked) {
                        return true;
                }
        }
        return false;
}

function checkSelected(radBtns) {
        console.log(radBtns);
        for (let i = 0; i < radBtns.length; i++) {
                if (radBtns[i].checked) {
                        return radBtns[i].value;
                }
        }
}

function showCorrectAns(items, selected) {
        const currentSelectTxt = selected.innerText;
        if (currentSelectTxt !== correctAnswer) {
                resetSelected(radios);
                for (let i = 0; i < items.length; i++) {
                        if (items[i].firstElementChild.innerText === correctAnswer) {
                                items[i].classList.add('correct');
                        } else {
                                items[i].classList.add('incorrect');
                        }
                }
        } else {
                resetSelected(radios);
                for (let i = 0; i < items.length; i++) {
                        if (items[i].firstElementChild.innerText === correctAnswer) {
                                items[i].classList.add('correct');
                        } else {
                                items[i].classList.add('incorrect');
                        }
                }
        }
}

function resetColors(items) {
        for (const item of items) {
                item.classList.remove('incorrect');
                item.classList.remove('correct');
        }
}

function flashOutcome() {
        outcome.classList.remove('hidden');
        outcome.classList.add('fade-in-out');
        setTimeout(() => {
                outcome.classList.add('hidden');
        }, 2000);
}

submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const checkInput = isOneChecked();
        if (checkInput) {
                const selectedRadio = checkSelected(radios);
                const selectedLabel = document.querySelector(`.ans[for="${selectedRadio}"]`);
                const chosenAnswer = selectedLabel.firstElementChild.innerText;
                if (chosenAnswer === correctAnswer) {
                        outcome.innerText = 'You got it!';
                        outcome.classList.add('outcome');
                        flashOutcome();
                        showCorrectAns(allAnswers, selectedLabel);
                        scoreValue += 1;
                        console.log(scoreValue);
                        score.innerText = scoreValue;
                        setTimeout(getData, 2500);
                } else {
                        outcome.innerText = '';
                        outcome.classList.add('outcome');
                        outcome.innerText = 'Thats not it..';
                        flashOutcome();
                        showCorrectAns(allAnswers, selectedLabel);
                        if (scoreValue > 0) {
                                scoreValue -= 1;
                        }
                        console.log(scoreValue);
                        score.innerText = scoreValue;
                        setTimeout(getData, 2500);
                }
        }
});
