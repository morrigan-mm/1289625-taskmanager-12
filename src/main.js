import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createBoardTemplate} from "./view/board.js";
import {createTaskTemplate} from "./view/task.js";
import {createLoadMoreButtonTemplate} from "./view/load-more-button.js";
import {createEditTaskTemplate} from "./view/edit-task.js";

const TASK_AMOUNT = 3;

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

render(main, createFilterTemplate(), `beforeend`);
render(main, createBoardTemplate(), `beforeend`);
render(mainControl, createSiteMenuTemplate(), `beforeend`);

const board = main.querySelector(`.board`);
const boardTasks = board.querySelector(`.board__tasks`);

render(board, createSortingTemplate(), `afterbegin`);
render(board, createLoadMoreButtonTemplate(), `beforeend`);
render(boardTasks, createEditTaskTemplate(), `beforeend`);

for (let i = 0; i < TASK_AMOUNT; i++) {
  render(boardTasks, createTaskTemplate(), `beforeend`);
}


