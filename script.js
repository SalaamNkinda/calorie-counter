/**
 * Calorie Counter Application
 * 
 * This script provides functionality for a calorie tracking application:
 * - Adding food/exercise entries
 * - Calculating remaining calories based on budget
 * - Clearing the form
 */

// DOM Element References
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

/**
 * Cleans input string by removing +, -, and whitespace characters
 * @param {string} str - The input string to clean
 * @returns {string} The cleaned string
 */
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

/**
 * Checks if input contains invalid scientific notation
 * @param {string} str - The input string to validate
 * @returns {boolean} True if invalid input is found
 */
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

/**
 * Adds a new entry (food or exercise) to the selected category
 */
function addEntry() {
  // Find the target container based on dropdown selection
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  // Calculate entry number based on existing entries
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  
  // HTML template for new entry
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  
  // Insert the new entry into the container
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

/**
 * Calculates remaining calories based on budget and entries
 * @param {Event} e - The submit event
 */
function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  // Get all calorie inputs from each category
  const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
  const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
  const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
  const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
  const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

  // Calculate calories for each category
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  // Calculate totals and remaining calories
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  
  // Display results
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove('hide');
}

/**
 * Sums calories from a list of input elements
 * @param {NodeList} list - List of input elements
 * @returns {number} Total calories
 */
function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

/**
 * Clears all form inputs and results
 */
function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

// Event Listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener('click', clearForm);