import IngredientService from '../service/ingredient_service.js';
import DOMService from './dom_manipulation.js';

/*
 * Naam:
 * Studentnr:
*/

const domService = new DOMService();
let ingredients;

function getIngredientKeys() {
  return Object.keys(ingredients);
}

function addUnitsToBuy(ingredient) {
  let unitsToBuy = ingredient.quantity.optimum - ingredient.quantity.available;

  if (unitsToBuy < 0) {
    unitsToBuy = 0;
  }

  return {
    ...ingredient,
    unitsToBuy,
  };
}

/**
 * This function should calculate the expected total price to get all ingredients currenty
 * available (availableSeason) back to the optimum level based on the average price per unit.
 * @function getTotalPrice
 * @param {Array<Ingredient>} ingredientsToDisplay - Array of Ingredients
 * @returns {Number} - estimated total price.
 */
function getTotalPrice(ingredientsToDisplay) {
  // TODO: Replace the return statement and add your JS-2 solution her
  const totalPrice = ingredientsToDisplay
    .filter((ingredient) => ingredient.availableSeason)
    .reduce((total, ingredient) => {
      const ingredientPrice = ingredient.unitsToBuy * ingredient.averagePricePerUnit;
      return total + ingredientPrice;
    }, 0);
  return totalPrice;
}

function getIngredientsToDisplay() {
  const { lowAvailability, availableSeason } = domService.getActiveFilters();

  return getIngredientKeys()
    .map((key) => ({ id: key, ...ingredients[key] }))
    .filter((ingredient) => !availableSeason || ingredient.availableSeason)
    .filter(({ quantity }) => !lowAvailability || (quantity.available < quantity.minimum));
}

function displayIngredients() {
  const ingredientsToDisplay = getIngredientsToDisplay()
    .map((ingredient) => addUnitsToBuy(ingredient));

  domService.removeCurrentIngredients();

  ingredientsToDisplay
    .map((ingredient) => domService.createRowForIngredient(ingredient))
    .forEach((ingredient) => domService.addRow(ingredient));

  const totalPrice = getTotalPrice(ingredientsToDisplay);
  domService.displayTotalPrice(totalPrice);
}

function handleFiltersChanged() {
  displayIngredients(ingredients);
}

function handleSetAvailability(event) {
  const { value, ingredientId } = event.detail;
  const ingredient = ingredients[ingredientId];
  ingredient.quantity.available = value;
  IngredientService.updateIngredient(ingredientId, ingredient)
    .then(() => displayIngredients());
}

function handleIncreaseAvailability(event) {
  const ingredientId = event.detail;
  const ingredient = ingredients[ingredientId];
  ingredient.quantity.available += 1;
  IngredientService.updateIngredient(ingredientId, ingredient)
    .then(() => displayIngredients());
}

function handleDecreaseAvailability(event) {
  const ingredientId = event.detail;
  const ingredient = ingredients[ingredientId];
  if (ingredient.quantity.available - 1 >= 1) {
    ingredient.quantity.available -= 1;
  }
  IngredientService.updateIngredient(ingredientId, ingredient)
    .then(() => displayIngredients());
}

function handleRemoveIngredient(event) {
  const ingredientId = event.detail;
  delete ingredients[ingredientId];
  IngredientService.removeIngredient(ingredientId)
    .then(() => displayIngredients());
}

function handleAddIngredient(event) {
  const { key, data } = event.detail;
  ingredients = {
    ...ingredients,
    [key]: data,
  };
  IngredientService.addIngredient(key, data)
    .then(() => displayIngredients());
}

function init() {
  window.addEventListener('filters-changed', handleFiltersChanged);
  window.addEventListener('set-availability', handleSetAvailability);
  window.addEventListener('increase-availability', handleIncreaseAvailability);
  window.addEventListener('decrease-availability', handleDecreaseAvailability);
  window.addEventListener('remove-ingredient', handleRemoveIngredient);
  window.addEventListener('add-ingredient', handleAddIngredient);

  IngredientService.getIngredients()
    .then((data) => {
      ingredients = data;
      displayIngredients();
    });
}

init();
