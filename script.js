const students = [];
const tableBody = document.querySelector("#studentsTable tbody");
const averageDiv = document.getElementById("average");
const form = document.getElementById("studentForm");

// Elementos de error
const nameError = document.getElementById("name-error");
const lastNameError = document.getElementById("lastName-error");
const dateError = document.getElementById("date-error");
const gradeError = document.getElementById("grade-error");

// Validación en tiempo real
document.getElementById("name").addEventListener("input", function() {
    nameError.style.display = this.value.trim() ? "none" : "block";
});

document.getElementById("lastName").addEventListener("input", function() {
    lastNameError.style.display = this.value.trim() ? "none" : "block";
});

document.getElementById("date").addEventListener("input", function() {
    dateError.style.display = this.value.trim() ? "none" : "block";
});

document.getElementById("grade").addEventListener("input", function() {
    const value = parseFloat(this.value);
    gradeError.style.display = (!isNaN(value) && value >= 1 && value <= 7) ? "none" : "block";
});

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const date = document.getElementById("date").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);

    // Validación de campos
    let isValid = true;

    if (!name) {
        nameError.style.display = "block";
        isValid = false;
    } else {
        nameError.style.display = "none";
    }

    if (!lastName) {
        lastNameError.style.display = "block";
        isValid = false;
    } else {
        lastNameError.style.display = "none";
    }

    if (!date) {
        dateError.style.display = "block";
        isValid = false;
    } else {
        dateError.style.display = "none";
    }

    if (isNaN(grade)) {
        gradeError.textContent = "Por favor ingrese una nota válida";
        gradeError.style.display = "block";
        isValid = false;
    } else if (grade < 1 || grade > 7) {
        gradeError.textContent = "La nota debe estar entre 1.0 y 7.0";
        gradeError.style.display = "block";
        isValid = false;
    } else {
        gradeError.style.display = "none";
    }

    if (!isValid) return;

    const student = { name, lastName, date, grade };
    students.push(student);
    addStudentToTable(student);
    calcularPromedio();
    this.reset();
});

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.date}</td>
        <td>${student.grade.toFixed(1)}</td>
        <td> <button class="delete-btn">Eliminar</button> <button class="edit-btn">Editar</button> </td>`;
        row.querySelector(".delete-btn").addEventListener("click",function(){
            deleteEstudiante(student,row);
        row.querySelector(".edit-btn").addEventListener("click",function(){
            editarEstudiante(student,row);
        })
        });
    tableBody.appendChild(row);
}

function editarEstudiante(){
    const row = document.replaceChild("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.date}</td>
        <td>${student.grade.toFixed(1)}</td>
        <td> <button class="delete-btn">Eliminar</button> <button class="edit-btn">Editar</button> </td>`;
        }
    tableBody.appendChild(row);





function deleteEstudiante(student,row){
    const index=students.indexOf(student);
    if(index>-1){
        students.splice(index,1);
        calcularPromedio();
        row.remove();
    }
}


function calcularPromedio() {
    if (students.length === 0) {
        averageDiv.textContent = "Promedio General del Curso: N/A";
        return;
    }
    
    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const prom = total / students.length;
    
    // Cambiar color según el promedio
    if (prom < 4.0) {
        averageDiv.style.backgroundColor = "#ffebee";
        averageDiv.style.color = "#c62828";
    } else if (prom >= 4.0 && prom < 5.0) {
        averageDiv.style.backgroundColor = "#fff8e1";
        averageDiv.style.color = "#ff8f00";
    } else {
        averageDiv.style.backgroundColor = "#e8f5e9";
        averageDiv.style.color = "#2e7d32";
    }
    
    averageDiv.textContent = `Promedio General del Curso: ${prom.toFixed(2)}`;
}