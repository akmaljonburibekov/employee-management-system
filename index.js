const employeesList = document.getElementById("employeesList");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const employeeForm = document.getElementById("employeeForm");
const overlay = document.getElementById("overlay");
const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");
const putEmployeeBtn = document.getElementById("putEmployeeBtn");
const patchEmployeeBtn = document.getElementById("patchEmployeeBtn");

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
          <button class="deleteBtn" data-id="${employee.id}">
             Delete
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

  try {
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
    }
    catch (error) {
      console.error(error);
    }
  }

});