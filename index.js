const employeesList = document.getElementById("employeesList");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const employeeForm = document.getElementById("employeeForm");
const overlay = document.getElementById("overlay");
const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");
const putEmployeeBtn = document.getElementById("putEmployeeBtn");
const patchEmployeeBtn = document.getElementById("patchEmployeeBtn");
const toast = document.getElementById("toast");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const pagination = document.getElementById("pagination");

const employeeCountElement = document.getElementById("employeeCount");
const totalSalaryElement = document.getElementById("totalSalary");
const averageSalaryElement = document.getElementById("averageSalary");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const positionInput = document.getElementById("position");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const emailInput = document.getElementById("email");


let editEmployeeId = null;
let employees = [];

function validateEmployee(employeeData) {
  if (
    !employeeData.firstName ||
    !employeeData.lastName ||
    !employeeData.position ||
    !employeeData.department ||
    !employeeData.email
  ) {
    return {
      isValid: false,
      message: "Iltimos, barcha maydonlarni to'ldiring!"
    };
  }

  if (
    !Number.isInteger(employeeData.age) ||
    employeeData.age < 18 ||
    employeeData.age > 100
  ) {
    return {
      isValid: false,
      message: "Yosh 18 dan 100 gacha bo'lishi kerak!"
    };
  }

  if (
    !Number.isFinite(employeeData.salary) ||
    employeeData.salary <= 0
  ) {
    return {
      isValid: false,
      message: "Maosh 0 dan katta bo'lishi kerak!"
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(employeeData.email)) {
    return {
      isValid: false,
      message: "Iltimos, to'g'ri email manzilini kiriting!"
    };
  }

  return {
    isValid: true
  }
}


// OOP
// CLASS
class Employee {
  #salary;

  constructor(firstName, lastName, age, position, department, salary, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.position = position;
    this.department = department;
    this.#salary = salary;
    this.email = email;
  }
  get salary() {
    return this.#salary;
  }

  set salary(value) {
    if(value > 0) {
      this.#salary = value;
    }
  }

  increaseSalary(amount) {
    if(amount > 0) {
      this.#salary += amount;
    }
  }

  decreaseSalary(amount) {
    if(amount > 0 && amount < this.#salary) {
      this.#salary -= amount;
    }
  }

  getInfo() {
    return `${this.firstName} ${this.lastName} ${this.age} ${this.position} ${this.department} ${this.#salary} ${this.email}`
  }

  getRole() {
    throw new Error("getRole() metodi voris klassda yozilishi kerak");
  }
}

const employee1 = new Employee(
  "Akmal",
  "Akmaly",
   43,
  "Fullstack developer",
  "IT",
  5000000,
  "akmaljonakmaly01@gmail.com"
);

const employee2 = new Employee(
  "Nazokat",
  "Nozimova",
  25,
  "Web designer",
  "LG",
  3800000,
  "nozi@gmail.com"
)

employee1.increaseSalary(500000);
employee2.decreaseSalary(300000);


// INHERITANCE
class Manager extends Employee {
  constructor(firstName, lastName, age, position, department, salary, email, teamSize) {
    super(firstName, lastName, age, position, department, salary, email);

    this.teamSize = teamSize;
  }

  getInfo() {
    return `${super.getInfo()} ${this.teamSize}`
  }

  getRole() {
    return "IT Manager";
  }
}

const manager1 = new Manager(
  "Ali",
  "Valiyev",
  35,
  "IT Manager",
  "IT",
  8000000,
  "ali@gmail.com",
  14
);

const manager2 = new Manager(
  "Sardor",
  "Karimov",
  38,
  "IT Manager",
  "IT",
  9000000,
  "sardor@gmail.com",
  12
);

class Developer extends Employee {
  constructor(firstName, lastName, age, position, department, salary, email) {
    super(firstName, lastName, age, position, department, salary, email);
  }
  getRole() {
    return "Developer";
  }
}

const developer1 = new Developer(
  "Akmal",
  "Buribekov",
  43,
  "Frontend Developer",
  "IT",
  6000000,
  "akmal@gmail.com"
)
console.log(developer1.getRole());

class Designer extends Employee {
  constructor(firstName, lastName, age, position, department, salary, email) {
    super(firstName, lastName, age, position, department, salary, email)
  }

  getRole() {
    return "Designer";
  }
}

const designer = new Designer(
  "Adham",
  "Jo'rayev",
  40,
  "Frontend Developer",
  "IT",
  6800000,
  "asqar@gmail.com"
)

console.log(designer.getRole());

const employeList = [
  developer1,
  designer
]

employeList.forEach(employee => {
  console.log(employee.getRole());
})

// POLYMORPHISM
const employeeList = [
  employee1,
  employee2,
  manager2
];

employeeList.forEach(employee => {
  console.log(employee.getInfo());
});


// GET EMPLOYES
function renderEmployees(employeeArray) {
  employeesList.innerHTML = "";

  if (employeeArray.length === 0) {
    employeesList.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">
          Hozircha xodimlar mavjud emas
        </td>
      </tr>
    `;
    return;
  }

  // SEARCHING
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;

  const paginatedEmployees = employeeArray.slice(startIndex, endIndex);

  const totalPages = Math.ceil(
    employeeArray.length / employeesPerPage
  );
  renderPagination(totalPages, employeeArray);

  paginatedEmployees.forEach((employee) => {
  const row = document.createElement("tr");

    row.innerHTML = `
      <td>${employee.id}</td>
      <td>${employee.first_name}</td>
      <td>${employee.last_name}</td>
      <td>${employee.age}</td>
      <td>${employee.position}</td>
      <td>${employee.department}</td>
      <td>${employee.salary}</td>
      <td>${employee.email}</td>
      <td>
        <button class="editBtn" data-id="${employee.id}">
          Edit
        </button>
        <button class="deleteBtn" data-id="${employee.id}">
          Delete
        </button>
      </td>
    `;

    employeesList.appendChild(row);
  });
}

// PAGINATION
function renderPagination(totalPages, employeeArray) {
  pagination.innerHTML = "";

  const prevButton = document.createElement("button");

prevButton.textContent = "Previous";
prevButton.disabled = currentPage === 1;

prevButton.addEventListener("click", () => {
  currentPage--;
  renderEmployees(employeeArray);
});

pagination.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
  
    button.textContent = i;
    button.classList.add("page-btn");

    if (i === currentPage) {
    button.classList.add("active");
}

    button.addEventListener("click", () => {
      currentPage = i;
      renderEmployees(employeeArray);
    });
  
    pagination.appendChild(button);
  }

  const nextButton = document.createElement("button");

nextButton.textContent = "Next";
nextButton.disabled = currentPage === totalPages;

nextButton.addEventListener("click", () => {
  currentPage++;
  renderEmployees(employeeArray);
});

pagination.appendChild(nextButton);

}

// METHOD GET
async function getEmployees() {
  try {
    showLoading();
    const response = await fetch("http://localhost:3000/employees/");

    if (!response.ok) {
      throw new Error("Xodimlarni yuklashda xatolik yuz berdi");
    }

    employees = await response.json();
    calculateEmployeeStatistics();

    renderEmployees(employees);

  } catch (error) {
    console.error(error);
    showToast("Xodimlarni yuklashda xatolik yuz berdi!", "error");
  } finally {
    hideLoading();
  }
}

getEmployees();

// STATISTIKA
function calculateEmployeeStatistics() {
  const totalSalary = employees.reduce((total, employee) => {
    return total + Number(employee.salary);
  }, 0);

  const averageSalary = employees.length
    ? totalSalary / employees.length
    : 0;

  const employeeCount = employees.length;

  console.log("Jami maosh:", totalSalary);
  console.log("O‘rtacha maosh:", averageSalary);
  console.log("Xodimlar soni:", employeeCount);

  employeeCountElement.textContent = employeeCount;
  totalSalaryElement.textContent = totalSalary;
  averageSalaryElement.textContent = averageSalary.toFixed(2);
}



// METHOD POST
addEmployeeBtn.addEventListener("click", () => {
  const isHidden = employeeForm.hidden;

  employeeForm.reset();
  employeeForm.hidden = !isHidden;
  overlay.hidden = !isHidden;
  firstNameInput.focus();

  saveEmployeeBtn.hidden = false;
  putEmployeeBtn.hidden = true;
  patchEmployeeBtn.hidden = true;
});


overlay.addEventListener("click", () => {
  employeeForm.hidden = true;
  overlay.hidden = true;
});


employeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const employeeData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    age: Number(ageInput.value),
    position: positionInput.value.trim(),
    department: departmentInput.value.trim(),
    salary: Number(salaryInput.value),
    email: emailInput.value.trim()
  };

  // INPUT VALIDATION
  const validation = validateEmployee(employeeData);

if (!validation.isValid) {
  alert(validation.message);
  return;
}
  
  try {
    showLoading();
    const response = await fetch("http://localhost:3000/employees/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employeeData)
    });
  
    if (!response.ok) {
      throw new Error("Xodimni qo'shishda xatolik yuz berdi");
    }
  
    const result = await response.json();

    employeeForm.reset();

   employeeForm.hidden = true;
   overlay.hidden = true;
   await getEmployees();
  
   showToast("Xodim muvaffaqiyatli qo'shildi!");
  
  } catch (error) {
    console.error(error);
    showToast("Xodimni qo'shishda xatolik yuz berdi!", "error");
  } finally {
    hideLoading();
  }

});



// METHOD PUT
async function updateEmployee() {
  const employeeId = editEmployeeId;

  const employeeData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    age: Number(ageInput.value),
    position: positionInput.value.trim(),
    department: departmentInput.value.trim(),
    salary: Number(salaryInput.value),
    email: emailInput.value.trim()
  };

    const validation = validateEmployee(employeeData);

  if (!validation.isValid) {
    alert(validation.message);
    return;
  }

  try {
    showLoading();
    const response = await fetch(
      `http://localhost:3000/employees/${employeeId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employeeData)
      }
    );
    if (!response.ok) {
      throw new Error("Xodim ma'lumotlarini yangilashda xatolik yuz berdi");
    }
    
    const result = await response.json();
    
    console.log(result);

    employeeForm.reset();

    employeeForm.hidden = true;
    overlay.hidden = true;

    await getEmployees();
  }
  catch (error) {
    console.error(error);
    showToast("Xodim ma'lumotlarini yangilashda xatolik yuz berdi!", "error");
  }  finally {
    hideLoading();
  }
  
}

employeesList.addEventListener("click", (event) => {
  if (event.target.classList.contains("editBtn")) {
    const employeeId = event.target.dataset.id;

    editEmployeeId = employeeId;

   const selectedEmployee = employees.find(
  (employee) => employee.id === Number(employeeId)
);

firstNameInput.value = selectedEmployee.first_name;
lastNameInput.value = selectedEmployee.last_name;
ageInput.value = selectedEmployee.age;
positionInput.value = selectedEmployee.position;
departmentInput.value = selectedEmployee.department;
salaryInput.value = selectedEmployee.salary;
emailInput.value = selectedEmployee.email;

employeeForm.hidden = false;
overlay.hidden = false;

firstNameInput.focus();

saveEmployeeBtn.hidden = true;
putEmployeeBtn.hidden = false;
patchEmployeeBtn.hidden = false;
  }
});

putEmployeeBtn.addEventListener("click", updateEmployee);


// METHOD PATCH
async function updateEmployeePartially() {
  const employeeId = editEmployeeId;

  const employeeData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    age: Number(ageInput.value),
    position: positionInput.value.trim(),
    department: departmentInput.value.trim(),
    salary: Number(salaryInput.value),
    email: emailInput.value.trim()
  };
  
  const validation = validateEmployee(employeeData);

if (!validation.isValid) {
  alert(validation.message);
  return;
}

  const selectedEmployee = employees.find(
    (employee) => employee.id === Number(employeeId)
  );
  
  const changedData = {};

  if (employeeData.firstName !== selectedEmployee.first_name) {
    changedData.firstName = employeeData.firstName;
  }

  if (employeeData.lastName !== selectedEmployee.last_name) {
    changedData.lastName = employeeData.lastName;
  }

  if (employeeData.age !== Number(selectedEmployee.age)) {
    changedData.age = employeeData.age;
  }

  if (employeeData.position !== selectedEmployee.position) {
    changedData.position = employeeData.position;
  }

  if (employeeData.department !== selectedEmployee.department) {
    changedData.department = employeeData.department;
  }

  if (employeeData.salary !== Number(selectedEmployee.salary)) {
    changedData.salary = employeeData.salary;
  }

  if (employeeData.email !== selectedEmployee.email) {
    changedData.email = employeeData.email;
  }

  if (Object.keys(changedData).length === 0) {
    console.log("Hech qanday ma'lumot o'zgartirilmagan");
    return;
  }

  try {
    showLoading();
    const response = await fetch(
      `http://localhost:3000/employees/${employeeId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(changedData)
      }
    );

    if (!response.ok) {
      throw new Error("Xodim ma'lumotlarini yangilashda xatolik yuz berdi");
    }
    
    const result = await response.json();
    
    console.log(result);

    employeeForm.reset();
    employeeForm.hidden = true;
    overlay.hidden = true;

    await getEmployees();
  
  } catch (error) {
    console.error(error);
    showToast("Xodim ma'lumotlarini qisman yangilashda xatolik yuz berdi!", "error");
  }  finally {
    hideLoading();
  }

}

patchEmployeeBtn.addEventListener("click", updateEmployeePartially);



// METHOD DELETE
employeesList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("deleteBtn")) {
    const employeeId = event.target.dataset.id;

    const isConfirmed = confirm("Haqiqatan ham bu xodimni o'chirmoqchimisiz?");

    if (!isConfirmed) return;

    try {
      showLoading();
      const response = await fetch(
        `http://localhost:3000/employees/${employeeId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Xodimni o'chirishda xatolik yuz berdi");
      }
      
      await getEmployees();
    } catch (error) {
      console.error(error);
      showToast("Xodimni o'chirishda xatolik yuz berdi!", "error");
    }  finally {
      hideLoading();
    }
  }

});


function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = type;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}


// LOADING
function showLoading() {
  loading.style.display = "block";
}

function hideLoading() {
  loading.style.display = "none";
}


// DEBOUNCE
let searchTimer;

function debounce(callback, delay) {
  return function () {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      callback();
    }, delay);
  };
}


// SEARCHING
searchInput.addEventListener("input", debounce(() => {
  const searchValue = searchInput.value.toLowerCase().trim();

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.first_name.toLowerCase().startsWith(searchValue) ||
      employee.last_name.toLowerCase().startsWith(searchValue)
    );
  });

  currentPage = 1;
  renderEmployees(filteredEmployees);
}, 500));


// PAGINATION
const employeesPerPage = 5;
let currentPage = 1;

const startIndex = (currentPage - 1) * employeesPerPage;
const endIndex = startIndex + employeesPerPage;fshow