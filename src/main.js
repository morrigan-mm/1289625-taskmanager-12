import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createBoardTemplate} from "./view/board.js";
import {createTaskTemplate} from "./view/task.js";
import {createLoadMoreButtonTemplate} from "./view/load-more-button.js";
import {createEditTaskTemplate} from "./view/edit-task.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils.js";

const TASK_AMOUNT = 20;
const TASK_AMOUNT_PER_STEP = 8;

const tasks = new Array(TASK_AMOUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

render(main, createFilterTemplate(filters), `beforeend`);
render(main, createBoardTemplate(), `beforeend`);
render(mainControl, createSiteMenuTemplate(), `beforeend`);

const board = main.querySelector(`.board`);
const boardTasks = board.querySelector(`.board__tasks`);

render(board, createSortingTemplate(), `afterbegin`);
render(boardTasks, createEditTaskTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, TASK_AMOUNT_PER_STEP); i++) {
  render(boardTasks, createTaskTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > TASK_AMOUNT_PER_STEP) {
  let renderedTaskCount = TASK_AMOUNT_PER_STEP;

  render(board, createLoadMoreButtonTemplate(), `beforeend`);

  const loadMoreButton = board.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_AMOUNT_PER_STEP)
      .forEach((task) => render(boardTasks, createTaskTemplate(task), `beforeend`));

    renderedTaskCount += TASK_AMOUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
