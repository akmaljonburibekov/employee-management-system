const employeesList = document.getElementById("employeesList");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const employeeForm = document.getElementById("employeeForm");
const overlay = document.getElementById("overlay");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const positionInput = document.getElementById("position");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const emailInput = document.getElementById("email");

let editEmployeeId = null;
let employees = [];

// METHOD GET
async function getEmployees() {
  try {
    const response = await fetch("http://localhost:3000/employees/");

    if (!response.ok) {
      throw new Error("Xodimlarni yuklashda xatolik yuz berdi");
    }

    employees = await response.json();

    employeesList.innerHTML = "";

    employees.forEach((employee) => {
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
        </td>
      `;

      employeesList.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

getEmployees();




// METHOD POST
addEmployeeBtn.addEventListener("click", () => {
  const isHidden = employeeForm.hidden;

  employeeForm.hidden = !isHidden;
  overlay.hidden = !isHidden;
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
  
  try {
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
  
    console.log(result);
  
  } catch (error) {
    console.error(error);
  }

});



// METHOD PUT
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
  }
});