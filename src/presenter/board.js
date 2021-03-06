import BoardView from "../view/board.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import SortingView from "../view/sorting.js";
import TaskListView from "../view/task-list.js";
import TaskView from "../view/task.js";
import EditTaskView from "../view/edit-task.js";
import NoTaskView from "../view/no-task.js";

import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import {SortType} from "../const.js";

const TASK_AMOUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_AMOUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new BoardView();
    this._sortingComponent = new SortingView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }

  _renderSorting() {
    render(this._boardComponent, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTask(task) {
    const taskComponent = new TaskView(task);
    const editTaskComponent = new EditTaskView(task);

    const replaceCardToForm = () => {
      replace(editTaskComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, editTaskComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    editTaskComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._taskListComponent, taskComponent, RenderPosition.BEFOREEND);
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_AMOUNT_PER_STEP);

    this._renderedTaskCount += TASK_AMOUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _clearTaskList() {
    this._taskListComponent.getElement().innerHTML = ``;
    this._renderedTaskCount = TASK_AMOUNT_PER_STEP;
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_AMOUNT_PER_STEP));

    if (this._boardTasks.length > TASK_AMOUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSorting();

    this._renderTaskList();
  }
}
