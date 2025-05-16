'use strict';

// #region CommonVariables

const body = document.body;
const headers = document.querySelector('thead tr');
let employeesList = document.querySelectorAll('tbody tr');
const tableBody = document.querySelector('tbody');

let employees = null;

// #endregion

// #region CreateEmployees
function createEmployees() {
  employees = Array.from(employeesList).map((employee) => {
    return {
      table: employee,
      Name: employee.children[0].textContent,
      Position: employee.children[1].textContent,
      Office: employee.children[2].textContent,
      Age: convertValue(employee.children[3].textContent),
      Salary: convertValue(employee.children[4].textContent),
    };
  });
}

createEmployees();

function convertValue(value) {
  if (parseInt(value)) {
    return parseInt(value);
  }

  return parseInt(value.slice(1).split(',').join(''));
}
// #endregion

// #region SortTable
Array.from(headers.children).forEach((headline) => {
  headline.addEventListener('click', () => {
    sortTable(headline.textContent);
  });
});

let prevValue = '';
let sortType = 'ASC';

function sortTable(sortBy) {
  if (prevValue === sortBy) {
    sortType = sortType === 'ASC' ? 'DESC' : 'ASC';
  } else {
    prevValue = sortBy;
    sortType = 'ASC';
  }

  employees.sort((employee1, employee2) => {
    if (sortType === 'ASC') {
      if (typeof employee1[sortBy] === 'string') {
        return employee1[sortBy].localeCompare(employee2[sortBy]);
      }

      return employee1[sortBy] - employee2[sortBy];
    }

    if (typeof employee1[sortBy] === 'string') {
      return employee2[sortBy].localeCompare(employee1[sortBy]);
    }

    return employee2[sortBy] - employee1[sortBy];
  });

  employees.forEach((employee) => {
    tableBody.append(employee['table']);
  });
}
// #endregion

// #region selectTable

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  Array.from(tableBody.children).forEach((item) => {
    item.classList.remove('active');
  });

  row.classList.add('active');
});

// #endregion

// #region formAdd

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');
body.append(form);

for (const employeeHeader in employees[0]) {
  if (employeeHeader === 'table') {
    continue;
  }

  if (employeeHeader === 'Office') {
    const selectLabel = document.createElement('label');

    selectLabel.innerText = employeeHeader;
    selectLabel.append(createSelectionInput());
    form.append(selectLabel);
    continue;
  }

  const label = document.createElement('label');
  const input = document.createElement('input');

  label.innerText = employeeHeader;
  input.setAttribute('name', employeeHeader.toLowerCase());
  input.setAttribute('data-qa', employeeHeader.toLowerCase());
  input.setAttribute('required', '');

  input.setAttribute(
    'type',
    typeof employees[0][employeeHeader] === 'string'
      ? 'text'
      : typeof employees[0][employeeHeader],
  );

  label.append(input);
  form.append(label);
}

function createSelectionInput() {
  const cities = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  const select = document.createElement('select');

  select.setAttribute('data-qa', 'office');
  select.setAttribute('required', '');

  for (const city of cities) {
    const option = document.createElement('option');

    option.innerText = city;
    select.append(option);
  }

  return select;
}

const button = document.createElement('button');

button.innerText = 'Save to table';
form.append(button);

const employeeForm = document.querySelector('form');

button.addEventListener('click', (e) => {
  e.preventDefault();

  // debugger;

  const newEmployeeName =
    employeeForm.children[0].querySelector('[name="name"]')?.value || '';
  const newEmployeePosition =
    employeeForm.children[1].querySelector('[name="position"]')?.value || '';
  const newEmployeeAge =
    employeeForm.children[3].querySelector('[name="age"]')?.value || '';

  const regEx = /[a-zA-Z]{4,}/i;

  document
    .querySelectorAll('[data-qa="notification"]')
    .forEach((el) => el.remove());

  const showError = (value, k) => {
    const errorNotification = document.createElement('div');

    errorNotification.setAttribute('data-qa', 'notification');
    errorNotification.setAttribute('class', 'error');
    errorNotification.textContent = `${value || 'Empty value'} is invalid`;
    employeeForm.children[k].append(errorNotification);
  };

  let isError = false;

  if (!regEx.test(newEmployeeName.trim())) {
    showError(newEmployeeName, 0);
    isError = true;
  }

  if (!regEx.test(newEmployeePosition.trim())) {
    showError(newEmployeePosition, 1);
    isError = true;
  }

  if (newEmployeeAge < 18 || newEmployeeAge > 90) {
    showError(newEmployeeAge, 3);
    isError = true;
  }

  if (isError) {
    return;
  }

  const tr = document.createElement('tr');

  for (let i = 0; i < employeeForm.children.length - 1; i++) {
    const td = document.createElement('td');

    if (employeeForm.children[i].textContent === 'Salary') {
      td.innerText =
        '$' + Number(employeeForm.children[i].lastChild.value).toLocaleString();
      tr.append(td);
      continue;
    }

    td.innerText = employeeForm.children[i].lastChild.value;
    tr.append(td);
  }

  tableBody.append(tr);
  employeesList = document.querySelectorAll('tbody tr');
  createEmployees();

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.setAttribute('class', 'success');
  notification.textContent = 'Successfully added new employee';
  body.append(notification);
});
// #endregion
