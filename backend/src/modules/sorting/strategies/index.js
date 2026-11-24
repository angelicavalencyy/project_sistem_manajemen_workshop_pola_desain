const SortByDeadline = require('./SortByDeadline');
const SortByPriority = require('./SortByPriority');
const SortByAssignee = require('./SortByAssignee');

const SORT_OPTIONS = Object.freeze([
  { value: 'deadline', label: 'Deadline Terdekat' },
  { value: 'priority', label: 'Prioritas (High ke Low)' },
  { value: 'assignee', label: 'Nama Assignee (A-Z)' },
]);

function createSortStrategies() {
  return {
    deadline: new SortByDeadline(),
    priority: new SortByPriority(),
    assignee: new SortByAssignee(),
  };
}

module.exports = { SORT_OPTIONS, createSortStrategies };
