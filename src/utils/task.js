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

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return taskA.dueDate.getTime() - taskB.dueDate.getTime();
};

export const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return taskB.dueDate.getTime() - taskA.dueDate.getTime();
};
