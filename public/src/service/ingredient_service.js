const NOT_FOUND_ERROR = 404;
const CONFLIC_ERROR = 409;
const BASE_PATH = '/v1/ingredient';

/**
 * This class offers services regarding the class Ingredient, by accessing the REST API of the
 * server for this class.
 */
export default class IngredientService {
  /**
   * This static method fetches all ingredients known by the server
   * @method getIngredients
   * @returns {Promise<JSON<[Ingredient]>>} - The method will return a promise, that when fullfilled
   *    will hold a JSON object of Ingredients.
   */
  static getIngredients() {
    return fetch(BASE_PATH)
      .then((response) => response.json());
  }

  /**
   * This static method will fetch a single ingredient.
   * @method getIngredient
   * @param {String} ingredient - the name (key value) of the ingredient to be fetched.
   * @returns {Promise<JSON<Ingredient>>} - The method will return a promise, that when fullfilled
   *      will hold a JSON object of a single Ingredient.
   *      In case the ingredient can't be found by the server an error with the status of the 
   *      response will be thrown.
   */
  static getIngredient(ingredient) {
    return fetch(`${BASE_PATH}/${ingredient}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      });
  }

  /**
   * This static method will add a single ingredient to the list of ingredients at the server.
   * @method addIngredient
   * @param {String} ingredient - the name (key value) of the ingredient to be fetched.
   * @param {JSON<Ingredient>} ingredientData - a JSON object with the values of an Ingredient
   *      object.
   * @returns {Promise<Response>} - The method will return a promise, that when fullfilled will
   *      hold the Response object returned by the server.
   *      In case the Ingredient already existed an error with the status of the response will be
   *      thrown.
   */
  static addIngredient(ingredient, ingredientData) {
    return fetch(`${BASE_PATH}/${ingredient}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(ingredientData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response;
      });
  }

  /**
   * This static method will update an existing ingredient at the server.
   * @method updateIngredient
   * @param {String} ingredient - the name (key value) of the ingredient to be fetched.
   * @param {JSON<Ingredient>} ingredientData - a JSON object with the values of an Ingredient
   *      object.
   * @returns {Promise<Response>} - The method will return a promise, that when fullfilled will
   *      hold the Response object returned by the server.
   *      In case the Ingredient can't be found an error with the status of the response will be
   *      thrown.
   */
  static updateIngredient(ingredient, ingredientData) {
    return fetch(`${BASE_PATH}/${ingredient}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(ingredientData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response;
      });
  }

  /**
   * This static method will delete an existing ingredient at the server.
   * @method removeIngredient
   * @param {String} ingredient - the name (key value) of the ingredient to be fetched. 
   * @returns {Promise<Response} - The method will return a promise, that when fullfilled will
   *      hold the Response object returned by the server.
   *      In case the Ingredient can't be found an error with the status of the response will be
   *      thrown.
   */
  static removeIngredient(ingredient) {
    return fetch(`${BASE_PATH}/${ingredient}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response;
      });
  }
}
