import http from "http";
import pool from "./db.js";

// const employees = [
//   {
//     id: 1,
//     firstName: "Ali",
//     lastName: "Valiyev",
//     age: 28,
//     position: "Frontend Developer",
//     department: "IT",
//     salary: 5000000,
//     email: "ali@gmail.com",
//     createdAt: new Date()
//   },
//   {
//     id: 2,
//     firstName: "Anvar",
//     lastName: "Hasanov",
//     age: 30,
//     position: "Backend Developer",
//     department: "IT",
//     salary: 4500000,
//     email: "anvar@gmail.com",
//     createdAt: new Date()
//   },
//   {
//     id: 3,
//     firstName: "Sardor",
//     lastName: "Luqmonov",
//     age: 22,
//     position: "Web Designer",
//     department: "IT",
//     salary: 3800000,
//     email: "sardor@gmail.com",
//     createdAt: new Date()
//   }
// ]

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const server = http.createServer(async (req, res) => {

  console.log(req.url, req.method);
  console.log("CORS:", corsHeaders);

  // OPTIONS METODI
if (req.method === "OPTIONS") {
  res.writeHead(204, corsHeaders);
  res.end();
  return;
}
 
  console.log(req.url, req.method);

 // GET METHOD
if (req.url === "/employees/" && req.method === "GET") {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY id ASC"
    );

    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify(result.rows));

  } catch (error) {
    console.error(error);

    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({
      status: "error",
      message: error.message
    }));
  }

  return;
}


  
       // POST SO'ROVI
  if (req.url === "/employees/" && req.method === "POST") {
    console.log("METHOD:", req.method);
console.log("URL:", req.url);
     let body = "";

     req.on("data", (chunk) => {
       body += chunk;
     })
     req.on("end", async () => {
      try {

        let addUser;

        try {
            addUser = JSON.parse(body);
          } catch (error) {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({
              message: "Noto'g'ri JSON ma'lumot"
            }));
            return;
          }

// firstName
if (typeof addUser.firstName !== "string" || addUser.firstName.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Ism kiritilmagan yoki noto'g'ri" }));
  return;
}

// lastName
if (typeof addUser.lastName !== "string" || addUser.lastName.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Familiya kiritilmagan yoki noto'g'ri" }));
  return;
}

// age
if (!Number.isInteger(addUser.age) || addUser.age <= 0) {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Yosh noto'g'ri kiritilgan" }));
  return;
}

// position
if (typeof addUser.position !== "string" || addUser.position.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Lavozim kiritilmagan yoki noto'g'ri" }));
  return;
}

// department
if (typeof addUser.department !== "string" || addUser.department.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Bo'lim kiritilmagan yoki noto'g'ri" }));
  return;
}

// salary
if (typeof addUser.salary !== "number" || addUser.salary <= 0) {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Maosh noto'g'ri kiritilgan" }));
  return;
}

// email
if (typeof addUser.email !== "string" || !addUser.email.includes("@") || !addUser.email.includes(".")) {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Email noto'g'ri kiritilgan" }));
  return;
}

        const result = await pool.query(
  `INSERT INTO employees
  (first_name, last_name, age, position, department, salary, email)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *`,
  [
    addUser.firstName,
    addUser.lastName,
    addUser.age,
    addUser.position,
    addUser.department,
    addUser.salary,
    addUser.email
  ]
);

res.writeHead(201, corsHeaders);
res.end(JSON.stringify(result.rows[0]));
      }  catch (error) {
        console.error(error);
      
        if (!res.headersSent) {
          res.writeHead(500, corsHeaders);
          res.end(JSON.stringify({
            message: "Serverda xatolik yuz berdi"
          }));
        }
      }
    });
    return;
}



      // PUT METODI 
  if (req.method === "PUT" && req.url.startsWith("/employees/")) {

    const parts = req.url.split("/");

    if (parts.length !== 3 || parts[1] !== "employees") {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({message: "ID noto'g'ri kiritilgan"}))
      return;
    }

    const userId = Number(parts[2]);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({message: "URL noto'g'ri kiritilgan"}))
      return;
    }

    const result = await pool.query(
      "SELECT * FROM employees WHERE id = $1",
      [userId]
    );
    
    if (result.rows.length === 0) {
      res.writeHead(404, corsHeaders);
      res.end(JSON.stringify({message: "Xodim topilmadi"}));
      return;
    }
  
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      })
      req.on("end", async () => {
        try {

          const updateData = JSON.parse(body);

// firstName
if (typeof updateData.firstName !== "string" || updateData.firstName.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Ism kiritilmagan yoki noto'g'ri" }));
  return;
}

// lastName
if (typeof updateData.lastName !== "string" || updateData.lastName.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Familiya kiritilmagan yoki noto'g'ri" }));
  return;
}

// age
if (!Number.isInteger(updateData.age) || updateData.age <= 0) {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Yosh noto'g'ri kiritilgan" }));
  return;
}

// position
if (typeof updateData.position !== "string" || updateData.position.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Lavozim kiritilmagan yoki noto'g'ri" }));
  return;
}

// department
if (typeof updateData.department !== "string" || updateData.department.trim() === "") {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Bo'lim kiritilmagan yoki noto'g'ri" }));
  return;
}

// salary
if (typeof updateData.salary !== "number" || updateData.salary <= 0) {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Maosh noto'g'ri kiritilgan" }));
  return;
}

// email
if (
  typeof updateData.email !== "string" ||
  !updateData.email.includes("@") ||
  !updateData.email.includes(".")
) {
  res.writeHead(400, corsHeaders);
  res.end(JSON.stringify({ message: "Email noto'g'ri kiritilgan" }));
  return;
}

        // ID ni yangilashga ruxsat bermaymiz
        const result = await pool.query(
          `UPDATE employees
           SET first_name = $1,
               last_name = $2,
               age = $3,
               position = $4,
               department = $5,
               salary = $6,
               email = $7
           WHERE id = $8
           RETURNING *`,
          [
            updateData.firstName,
            updateData.lastName,
            updateData.age,
            updateData.position,
            updateData.department,
            updateData.salary,
            updateData.email,
            userId
          ]
        );
        
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify(result.rows[0]));
        } catch (error) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({message: "Noto'g'ri JSON ma'lumot"}))
        }
      })
      return;
  }


  // PATCH METODI
if (req.method === "PATCH" && req.url.startsWith("/employees/")) {

  const parts = req.url.split("/");

  if (parts.length !== 3 || parts[1] !== "employees") {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ message: "URL noto'g'ri kiritilgan" }));
    return;
  }

  const userId = Number(parts[2]);

  if (!Number.isInteger(userId) || userId <= 0) {
    res.writeHead(400, corsHeaders);
    res.end(JSON.stringify({ message: "ID noto'g'ri kiritilgan" }));
    return;
  }
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const updateData = JSON.parse(body);

      if (
        typeof updateData !== "object" ||
        updateData === null ||
        Array.isArray(updateData)
      ) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ message: "Noto'g'ri ma'lumot" }));
        return;
      }

      const allowedFields = {
        firstName: "first_name",
        lastName: "last_name",
        age: "age",
        position: "position",
        department: "department",
        salary: "salary",
        email: "email"
      };

      const entries = Object.entries(updateData);

      if (entries.length === 0) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ message: "Yangilanadigan ma'lumot yo'q" }));
        return;
      }

      for (const [key, value] of entries) {
        if (!allowedFields[key]) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ message: "Noto'g'ri maydon: " + key }));
          return;
        }

        if (["firstName", "lastName", "position", "department"].includes(key)) {
          if (typeof value !== "string" || value.trim() === "") {
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({ message: key + " noto'g'ri kiritilgan" }));
            return;
          }
        }

        if (key === "age" && (!Number.isInteger(value) || value <= 0)) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ message: "Yosh noto'g'ri kiritilgan" }));
          return;
        }

        if (key === "salary" && (typeof value !== "number" || !Number.isFinite(value) || value <= 0)) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ message: "Maosh noto'g'ri kiritilgan" }));
          return;
        }

        if (key === "email" && (
          typeof value !== "string" ||
          !value.includes("@") ||
          !value.includes(".")
        )) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ message: "Email noto'g'ri kiritilgan" }));
          return;
        }
      }
      const values = entries.map(([key, value]) => value);

      const setClause = entries
        .map(([key], index) => `${allowedFields[key]} = $${index + 1}`)
        .join(", ");

      values.push(userId);

      const result = await pool.query(
        `UPDATE employees
         SET ${setClause}
         WHERE id = $${values.length}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({ message: "Xodim topilmadi" }));
        return;
      }

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(result.rows[0]));

    } catch (error) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ message: "Noto'g'ri JSON ma'lumot" }));
    }
  });

  return;
}


      // DELETE METODI
    if (req.method === "DELETE" && req.url.startsWith("/employees/")) {
      
      const parts = req.url.split("/");

    if (parts.length !== 3 || parts[1] !== "employees") {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({message: "URL noto'g'ri kiritilgan"}))
      return;
    }

    const userId = Number(parts[2]);

      if (!Number.isInteger(userId) || userId <= 0) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({message: "ID noto'g'ri kiritilgan"}))
        return;
      }
      const result = await pool.query(
        "DELETE FROM employees WHERE id = $1 RETURNING *",
        [userId]
      );
      
      if (result.rows.length === 0) {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({message: "Xodim topilmadi"}));
        return;
      }


      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({message: "Xodim muvaffaqiyatli o'chirildi"}));
      return
    }

    if (req.url === "/employees/" || req.url.startsWith("/employees/")) {
      res.writeHead(405, corsHeaders);
      res.end(JSON.stringify({message: "Method not allowed"}));
      return;
    }

    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({message: "URL topilmadi"}));
});


server.listen(3000, () => {
  console.log("Server 3000-portda ishga tushdi");
});