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

function handleSubmit(e) {
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
}

form.addEventListener("submit", handleSubmit);

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.date}</td>
        <td>${student.grade.toFixed(1)}</td>
        <td><button class="delete-btn">Eliminar</button> <button class="edit-btn">Editar</button></td>`;
    
    row.querySelector(".delete-btn").addEventListener("click", function() {
        deleteEstudiante(student, row);
    });
    
    row.querySelector(".edit-btn").addEventListener("click", function() {
        editarEstudiante(student, row);
    });
    
    tableBody.appendChild(row);
}

function editarEstudiante(student, row) {
    // Llenar el formulario con los datos del estudiante
    document.getElementById("name").value = student.name;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("date").value = student.date;
    document.getElementById("grade").value = student.grade;

    // Cambiar el texto y estilo del botón
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.textContent = "Actualizar Alumno";
    submitButton.classList.add("updating");

    // Guardar el índice del estudiante que se está editando
    form.dataset.editingIndex = students.indexOf(student);

    // Cambiar temporalmente el manejador del evento submit
    form.removeEventListener("submit", handleSubmit);
    
    function handleUpdate(e) {
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

        if (isNaN(grade) || grade < 1 || grade > 7) {
            gradeError.style.display = "block";
            isValid = false;
        } else {
            gradeError.style.display = "none";
        }

        if (!isValid) return;

        // Actualizar el estudiante
        const index = parseInt(form.dataset.editingIndex);
        if (index >= 0 && index < students.length) {
            students[index] = { name, lastName, date, grade };
            
            // Actualizar la fila en la tabla
            row.innerHTML = `
                <td>${name}</td>
                <td>${lastName}</td>
                <td>${date}</td>
                <td>${grade.toFixed(1)}</td>
                <td><button class="delete-btn">Eliminar</button> <button class="edit-btn">Editar</button></td>`;
            
            // Volver a agregar los event listeners
            row.querySelector(".delete-btn").addEventListener("click", function() {
                deleteEstudiante(students[index], row);
            });
            row.querySelector(".edit-btn").addEventListener("click", function() {
                editarEstudiante(students[index], row);
            });
        }

        // Restaurar el formulario
        form.reset();
        submitButton.textContent = "Guardar Alumno";
        submitButton.classList.remove("updating");
        delete form.dataset.editingIndex;
        calcularPromedio();

        // Restaurar el manejador original
        form.removeEventListener("submit", handleUpdate);
        form.addEventListener("submit", handleSubmit);
    }

    form.addEventListener("submit", handleUpdate);
}

function deleteEstudiante(student, row) {
    const index = students.indexOf(student);
    if (index > -1) {
        students.splice(index, 1);
        calcularPromedio();
        row.remove();
    }
}

function calcularPromedio() {
    if (students.length === 0) {
        averageDiv.textContent = "Promedio General del Curso: N/A";
        averageDiv.style.backgroundColor = "#e3f2fd";
        averageDiv.style.color = "#0d47a1";
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