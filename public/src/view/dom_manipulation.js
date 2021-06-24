/*
  Naam:
  Studentnr:
*/

const tableBody = document.getElementById('table-body');
const lowAvailabilityCheckbox = document.getElementById('filter-low-availability');
const availableSeasonCheckbox = document.getElementById('filter-available-season');
const rowTemplate = document.getElementById('row-template');

/**
 * This function should open a modal dialog box voor the given id (key value of an Ingredient)
 * @function openModal
 * @param {String} id - The key value of the ingredient
 */
function openModal(id) {
  // TODO: Add your WEB-2 solution here and in the closeModal function.
}

/**
 * This function should close the dialog box voor a given id (key value of an Ingredient)
 * @function closeModal
 * @param {String} id 
 */
function closeModal(id) {
  // TODO: Add your WEB-2 solution here and in the openModal function.
}

function handleInputChange(event) {
  const { value } = event.target;
  const ingredientId = event.target.dataset.id;
  window.dispatchEvent(new CustomEvent('set-availability', { detail: { ingredientId, value } }));
}

function handleButtonClick(event) {
  const button = event.target;
  const ingredientId = button.dataset.id;
  if (button.classList.contains('info-button')) {
    openModal(ingredientId);
  }

  if (button.classList.contains('dialog-close')) {
    closeModal(ingredientId);
  }

  if (button.classList.contains('availability-increase')) {
    window.dispatchEvent(new CustomEvent('increase-availability', { detail: ingredientId }));
  }

  if (button.classList.contains('availability-decrease')) {
    window.dispatchEvent(new CustomEvent('decrease-availability', { detail: ingredientId }));
  }

  if (button.classList.contains('remove-button')) {
    window.dispatchEvent(new CustomEvent('remove-ingredient', { detail: ingredientId }));
  }
}

/**
 * This function should convert the id (key value of an ingredient) to a format that starts with a
 * uppercase letter and replaces the '_' with spaces.
 *
 * @function toTitle
 * @param {String} id
 * @returns {String} -
 * @example toTitle('olive_oil') returns 'Olive Oil'.
 *
 */
function toTitle(id) {
  // TODO: Replace the return statement and add your JS-1 solution here
  return id;
}

function toId(title) {
  return title.replace(' ', '-').toLowerCase();
}

export default class DOMService {
  constructor() {
    document.querySelector('#reset').addEventListener('click', () => {
      fetch('/v1/reset')
        .then(() => document.location.reload());
    });

    document.querySelectorAll('#filters [type="checkbox"]').forEach((checkbox) => checkbox.addEventListener('change', () => {
      window.dispatchEvent(new CustomEvent('filters-changed'));
    }));

    document.querySelector('#add-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.target;

      window.dispatchEvent(new CustomEvent('add-ingredient', {
        detail: {
          key: toId(form.querySelector('[name="title"]').value),
          data: {
            unit: form.querySelector('[name="unit"]').value,
            availableSeason: form.querySelector('[name="available-season"]').checked,
            averagePricePerUnit: Number(form.querySelector('[name="average-price-per-unit"]').value),
            quantity: {
              available: Number(form.querySelector('[name="available"]').value),
              minimum: Number(form.querySelector('[name="minimum"]').value),
              optimum: Number(form.querySelector('[name="optimum"]').value),
            },
          },
        },
      }));

      document.querySelector('#add-dialog').close();
    });

    document.querySelector('#button-add-ingredient')
      .addEventListener('click', () => document.querySelector('#add-dialog').showModal());

    document.querySelector('#close-add-dialog')
      .addEventListener('click', () => document.querySelector('#add-dialog').close());
  }

  removeCurrentIngredients() {
    tableBody.querySelectorAll('.button')
      .forEach((button) => button.removeEventListener('click', handleButtonClick));

    tableBody.innerHTML = '';
  }

  getActiveFilters() {
    return {
      lowAvailability: lowAvailabilityCheckbox.checked,
      availableSeason: availableSeasonCheckbox.checked,
    };
  }

  attachInfoButtonEventListeners(row) {
    row.querySelector('.info-button').addEventListener('click', handleButtonClick);
    row.querySelector('.dialog-close').addEventListener('click', handleButtonClick);
  }

  /**
   * This method should add an event listener, for each button in the given row, which
   * calls the handleButtonClick method when the button is clicked.
   * @method attachButtonEventListeners
   * @param {DOM-Node} row
   */
  attachButtonEventListeners(row) {
    this.attachInfoButtonEventListeners(row);
    // TODO: Add your WEB-3 solution here
  }

  attachChangeEventListeners(row) {
    row.querySelector('.table-available-input').addEventListener('change', handleInputChange);
  }

  /**
   * This method should add a class attribute 'low-on-stock' to each ingredient row of which the
   * available stock is lower than the defined minimum stock for that ingredient.
   * @param {JSON<Ingredient>} ingredient
   * @param {DOM Node} row
   */
  markLowOnStock(ingredient, row) {
    // TODO: Add your WEB-1 solution here
  }

  createRowForIngredient(ingredient) {
    const row = rowTemplate.content.cloneNode(true);

    this.attachButtonEventListeners(row);
    this.attachChangeEventListeners(row);

    row.querySelectorAll('.ingredient-title')
      .forEach((titleElement) => { titleElement.innerText = toTitle(ingredient.id); });
    row.querySelectorAll('.units-label')
      .forEach((unitElement) => { unitElement.innerText = ingredient.unit; });

    row.querySelector('dialog').dataset.dialog = ingredient.id;
    row.querySelector('label').setAttribute('for', ingredient.id);
    row.querySelector('.table-available-input').setAttribute('id', ingredient.id);
    row.querySelector('.table-available-input').value = ingredient.quantity.available;
    row.querySelector('.units-to-buy').innerText = ingredient.unitsToBuy;
    row.querySelector('.unit-price').innerText = ingredient.averagePricePerUnit;
    row.querySelector('.available').innerText = ingredient.quantity.available;
    row.querySelector('.minimum').innerText = ingredient.quantity.minimum;
    row.querySelector('.optimum').innerText = ingredient.quantity.optimum;
    row.querySelector('.ingredient-total-price').innerText = ingredient.unitsToBuy * ingredient.averagePricePerUnit;

    this.markLowOnStock(ingredient, row);

    if (ingredient.availableSeason === false) {
      row.querySelector('tr').classList.add('out-of-season');
    }

    row.querySelectorAll('.button, input[type="number"]').forEach((element) => {
      element.dataset.id = ingredient.id;
    });

    return row;
  }

  addRow(row) {
    tableBody.appendChild(row);
  }

  displayTotalPrice(total) {
    const roundedValue = Math.round(total * 100) / 100;
    document.querySelector('#calculated-price output').innerText = roundedValue;
  }
}
