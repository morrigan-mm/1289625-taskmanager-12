export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomBoolean = () => {
  return Boolean(getRandomInteger(0, 1));
};

export const normalizeDate = (date) => {
  const normalized = new Date(date);

  normalized.setHours(23, 59, 59, 999);

  return normalized;
};

export const isTaskExpired = (dueDate) => {
  if (!dueDate) {
    return false;
  }

  const normalizedNow = normalizeDate(new Date()).getTime();
  const normalizedDue = normalizeDate(dueDate).getTime();

  return normalizedNow > normalizedDue;
};

export const isTaskExpiringToday = (dueDate) => {
  if (!dueDate) {
    return false;
  }

  const normalizedNow = normalizeDate(new Date()).getTime();
  const normalizedDue = normalizeDate(dueDate).getTime();

  return normalizedNow === normalizedDue;
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

export const humanizeTaskDueDate = (dueDate) => {
  return dueDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`});
};
