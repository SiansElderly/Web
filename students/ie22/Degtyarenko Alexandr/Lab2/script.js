document.addEventListener('DOMContentLoaded', function() {
    let firstOperand = '';
    let secondOperand = '';
    let expressionResult = '';
    let selectedOperation = null;
    let currentExpression = '';
    let accumulatedResult = null; // Переменная для накопления результата
    let rememberedNumber = null; // Переменная для запоминания числа
    let previousOperation = null; // Переменная для хранения предыдущей операции
  
    // Окно вывода результата
    const outputElement = document.getElementById("result");
  
    // Объект для хранения функций операций
    const operations = {
      'x': (a, b) => a * b,
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '/': (a, b) => b !== 0 ? a / b : Infinity
    };
  
    // Функция для обновления окна вывода
    function updateOutput() {
      let displayValue = '';
  
      if (selectedOperation && secondOperand !== '') {
        displayValue = `${firstOperand} ${selectedOperation} ${secondOperand}`;
      } else if (selectedOperation && secondOperand === '') {
        displayValue = `${firstOperand} ${selectedOperation}`;
      } else {
        displayValue = firstOperand || '0';
      }
  
      if (displayValue.length > 8) {
        if (displayValue.includes('.')) {
          const parts = displayValue.split('.');
          if (parts[1].length > 4) {
            displayValue = parseFloat(displayValue).toFixed(4);
          }
        } else {
          displayValue = Math.round(parseFloat(displayValue)).toString();
        }
      }
      if (displayValue.length > 8) {
        displayValue = displayValue.substring(0, 8);
    }
      outputElement.innerHTML = displayValue;
    }
  
    // Функция для обработки клика на цифровые кнопки
    function onDigitButtonClicked(digit) {
      if (!selectedOperation) {
        if ((digit !== '.') || (digit === '.' && !firstOperand.includes(digit))) {
          if (firstOperand === '0' && digit !== '.') {
            firstOperand = digit;
          } else {
            firstOperand += digit;
          }
        }
      } else {
        if ((digit !== '.') || (digit === '.' && !secondOperand.includes(digit))) {
          if (secondOperand === '0' && digit !== '.') {
            secondOperand = digit;
          } else {
            secondOperand += digit;
          }
          currentExpression = `${firstOperand} ${selectedOperation} ${secondOperand}`;
        }
      }
      updateOutput();
    }
  
    // Функция для установки операции
    function setOperation(operation) {
      if (firstOperand !== '') {
          selectedOperation = operation;
          currentExpression = `${firstOperand} ${operation}`;
          secondOperand = '';
          accumulatedResult = null;
          previousOperation = null;
          updateOutput();
      }
  }
  
    // Функция для выполнения операции
    function performOperation() {
      if (selectedOperation && firstOperand !== '' && secondOperand !== '') {
        rememberedNumber = parseFloat(secondOperand);
        previousOperation = selectedOperation;
        if (accumulatedResult === null) {
          expressionResult = operations[selectedOperation](parseFloat(firstOperand), parseFloat(secondOperand));
        } else {
          expressionResult = operations[selectedOperation](parseFloat(accumulatedResult), parseFloat(secondOperand));
        }
        accumulatedResult = expressionResult;
        firstOperand = expressionResult.toString();
        secondOperand = ''; 
        selectedOperation = null;
        updateOutput();
      }
    }
  
    // Установка колбек-функций на кнопки циферблата
    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');
    digitButtons.forEach(button => {
      button.onclick = function() {
        const digitValue = button.innerHTML;
        onDigitButtonClicked(digitValue);
      }
    });
  
    // Установка колбек-функций для кнопок операций
    const operationButtons = {
      'x': document.getElementById("btn_op_mult"),
      '+': document.getElementById("btn_op_plus"),
      '-': document.getElementById("btn_op_minus"),
      '/': document.getElementById("btn_op_divide")
    };
  
    Object.keys(operationButtons).forEach(operation => {
      operationButtons[operation].onclick = () => setOperation(operation);
    });
  
    // Кнопка смены знака
    document.getElementById("btn_op_sign").onclick = function() {
      if (firstOperand !== '') {
        firstOperand = (-1 * parseFloat(firstOperand)).toString();
        updateOutput();
      } else if (secondOperand !== '') {
        secondOperand = (-1 * parseFloat(secondOperand)).toString();
        updateOutput();
      }
    };
  
    // Кнопка вычисления процента
    document.getElementById("btn_op_percent").onclick = function() {
      if (selectedOperation) {
        if (secondOperand !== '') {
          const percentage = parseFloat(secondOperand) / 100;
          secondOperand = (parseFloat(firstOperand) * percentage).toString();
          updateOutput();
        }
      } else {
        if (firstOperand !== '') {
          firstOperand = (parseFloat(firstOperand) / 100).toString();
          updateOutput();
        }
      }
    };
  
    // Кнопка стирания последней цифры
    document.getElementById("btn_op_backspace").onclick = function() {
      if (!selectedOperation) {
        firstOperand = firstOperand.slice(0, -1);
        if (firstOperand === '') {
          firstOperand = '0';
        }
        updateOutput();
      } else {
        secondOperand = secondOperand.slice(0, -1);
        if (secondOperand === '') {
          secondOperand = '0';
        }
        updateOutput();
      }
    };
  
    // Кнопка вычисления квадратного корня
    document.getElementById("btn_op_sqrt").onclick = function() {
      if (firstOperand !== '') {
        firstOperand = Math.sqrt(parseFloat(firstOperand)).toString();
        updateOutput();
      } else if (secondOperand !== '') {
        secondOperand = Math.sqrt(parseFloat(secondOperand)).toString();
        updateOutput();
      }
    };
  
    // Кнопка возведения в квадрат
    document.getElementById("btn_op_square").onclick = function() {
      if (firstOperand !== '') {
        firstOperand = Math.pow(parseFloat(firstOperand), 2).toString();
        updateOutput();
      } else if (secondOperand !== '') {
        secondOperand = Math.pow(parseFloat(secondOperand), 2).toString();
        updateOutput();
      }
    };
  
    // Функция для вычисления факториала
    function factorial(n) {
      if (n < 0) return undefined;
      if (n === 0 || n === 1) return 1;
  
      let result = 1;
      for (let i=2; i <= n; i++) {
        result *= i;
      }
      return result;
    }
  
    // Кнопка вычисления факториала
    document.getElementById("btn_op_factorial").onclick = function() {
      if (firstOperand !== '') {
        firstOperand = factorial(parseInt(firstOperand)).toString();
        updateOutput();
      } else if (secondOperand !== '') {
        secondOperand = factorial(parseInt(secondOperand)).toString();
        updateOutput();
      }
    };
  
    // Кнопка добавления трех нулей
    document.getElementById("btn_op_add_three_zeros").onclick = function() {
      if (!selectedOperation) {
        firstOperand += "000";
        updateOutput();
      } else {
        secondOperand += "000";
        updateOutput();
      }
    };
  
    // Кнопка очистки
    document.getElementById("btn_op_clear").onclick = function() { 
      firstOperand = '';
      secondOperand = '';
      selectedOperation = null;
      expressionResult = '';
      accumulatedResult = null; 
      rememberedNumber = null; 
      previousOperation = null;
      outputElement.innerHTML = '0';
    };
  
    // Кнопка вычисления результата
    document.getElementById("btn_op_equal").onclick = function() {
      if (selectedOperation && firstOperand !== '' && secondOperand !== '') {
          performOperation();
      } else if (previousOperation && firstOperand !== '') {
          expressionResult = operations[previousOperation](parseFloat(firstOperand), rememberedNumber);
          firstOperand = expressionResult.toString();
          updateOutput();
      }
  };
  
    // Кнопка смены цвета фона
    document.getElementById("btn_color_change").onclick = function() {
        const colors = ['#2B5257', '#4A9B8E', '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#E67E22', '#E74C3C'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.querySelector('.button-container').style.backgroundColor = randomColor;
      };
    
      // Кнопка смены цвета окна вывода результата
      document.getElementById("btn_result_color_change").onclick = function() {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#E67E22', '#E74C3C', '#2B5257', '#4A9B8E'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        outputElement.style.backgroundColor = randomColor;
      };


// Смена темы
function toggleTheme() {
    const body = document.body;
    const themeToggleSound = document.getElementById('themeToggleSound');
    const themeToggleOffSound = document.getElementById('themeToggleOffSound');
    if (body.classList.contains('night')) {
        body.classList.remove('night');
        if (!themeToggleOffSound.paused) {
            themeToggleOffSound.pause();
            themeToggleOffSound.currentTime = 0;
        }
        themeToggleSound.play();
    } else {
        body.classList.add('night');
        if (!themeToggleSound.paused) {
            themeToggleSound.pause();
            themeToggleSound.currentTime = 0;
        }
        themeToggleOffSound.play();
    }
}
document.getElementById('btn_theme_toggle').addEventListener('click', toggleTheme);

document.getElementById('btn_do_not_press').addEventListener('click', function() {
    document.body.style.backgroundImage = "url('creepy.jpg')";
    
    document.querySelector('.button-container').style.display = 'none';
    
    const dropdownContainer = document.querySelector('.dropdown-container');
    if (dropdownContainer) {
        dropdownContainer.style.display = 'none';
    }

    this.style.display = 'none';

    const hiddenContent = document.getElementById('hiddenContent');
    hiddenContent.style.display = 'flex';
    
    const continueButton = document.getElementById('continueButton');
    continueButton.style.display = 'block';

    continueButton.addEventListener('click', function() {
        const continueSound = document.getElementById('continueSound');
        continueSound.play();
        continueButton.style.display = 'none';

        const questionContainer = document.getElementById('questionContainer');
        questionContainer.style.display = 'flex';

        document.getElementById('btn_yes').onclick = function() {
            const notAloneMessage = document.getElementById('notAloneMessage');
            notAloneMessage.style.display = 'block';
            questionContainer.style.display = 'none';

            const playQuestionContainer = document.getElementById('playQuestionContainer');
            playQuestionContainer.style.display = 'flex';


            document.getElementById('btn_play_yes').onclick = function() {
                alert("Пароли были похищены!");
                alert("Давай поиграем в прятки? Ты водишь.");
                playQuestionContainer.style.display = 'none';

                setTimeout(function() {
                    alert("Не смотри в шкафу.");
                    
                    setTimeout(function() {
                        const foundMessageContainer = document.createElement('div');
                        foundMessageContainer.style.position = 'fixed';
                        foundMessageContainer.style.top = '50%';
                        foundMessageContainer.style.left = '50%';
                        foundMessageContainer.style.transform = 'translate(-50%, -50%)';
                        foundMessageContainer.style.color = '#ffffff';
                        foundMessageContainer.style.fontSize = '2rem';
                        foundMessageContainer.innerText = "Нашёл?";
                        
                        const noButton = document.createElement('button');
                        noButton.innerText = "Нет";
                        noButton.style.marginTop = '20px';
                        noButton.style.padding = '10px 20px';
                        noButton.style.fontSize = '1.5rem';
                        
                        noButton.onclick = function() {
                            const myTurnMessage = document.createElement('div');
                            myTurnMessage.innerText = "Теперь моя очередь искать.";
                            myTurnMessage.style.position = 'fixed';
                            myTurnMessage.style.top = '50%';
                            myTurnMessage.style.left = '50%';
                            myTurnMessage.style.transform = 'translate(-50%, -50%)';
                            myTurnMessage.style.color = '#ffffff';
                            myTurnMessage.style.fontSize = '2rem';
                            document.body.appendChild(myTurnMessage);
                            foundMessageContainer.remove();
                        };

                        foundMessageContainer.appendChild(noButton);
                        document.body.appendChild(foundMessageContainer);
                    }, 5000);
                }, 3000);
            };

            document.getElementById('btn_play_no').onclick = function() {
                notAloneContainer.style.display = 'block';
                playQuestionContainer.style.display = 'none';
            };
        };

        document.getElementById('btn_no').onclick = function() {
            const notAloneContainer = document.getElementById('notAloneContainer');
            notAloneContainer.style.display = 'block';
            questionContainer.style.display = 'none';
        };
    });
});
});