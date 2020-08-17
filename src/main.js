import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import SortingView from "./view/sorting.js";
import TaskListView from "./view/task-list.js";
import TaskView from "./view/task.js";
import EditTaskView from "./view/edit-task.js";
import NoTaskView from "./view/no-task.js";

import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./utils.js";

const TASK_AMOUNT = 20;
const TASK_AMOUNT_PER_STEP = 8;

const tasks = new Array(TASK_AMOUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const editTaskComponent = new EditTaskView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(editTaskComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), editTaskComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editTaskComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTaskView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.getElement(), new SortingView().getElement(), RenderPosition.AFTERBEGIN);

  boardTasks
  .slice(0, Math.min(tasks.length, TASK_AMOUNT_PER_STEP))
  .forEach((task) => renderTask(taskListComponent.getElement(), task));

  if (boardTasks.length > TASK_AMOUNT_PER_STEP) {
    let renderedTaskCount = TASK_AMOUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_AMOUNT_PER_STEP)
        .forEach((task) => renderTask(taskListComponent.getElement(), task));

      renderedTaskCount += TASK_AMOUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);
render(mainControl, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(main, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
renderBoard(main, tasks);
