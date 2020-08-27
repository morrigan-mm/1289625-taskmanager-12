import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

import BoardPresenter from "./presenter/board.js";
import {render, RenderPosition} from "./utils/render.js";

const TASK_AMOUNT = 20;

const tasks = new Array(TASK_AMOUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);
const boardPresenter = new BoardPresenter(main);

render(mainControl, new SiteMenuView(), RenderPosition.BEFOREEND);
render(main, new FilterView(filters), RenderPosition.BEFOREEND);
boardPresenter.init(tasks);
