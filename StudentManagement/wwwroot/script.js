const apiUrl = "https://localhost:7179/api/Students";

// Elements
const form = document.getElementById("studentForm");
const studentsTableBody = document.querySelector("#studentsTable tbody");
const formTitle = document.getElementById("formTitle");
const cancelBtn = document.getElementById("cancelBtn");
const studentIdInput = document.getElementById("studentId");

// Fetch all students
async function fetchStudents() {
    studentsTableBody.innerHTML = "";
    try {
        const res = await fetch(apiUrl);
        const students = await res.json();

        students.forEach(s => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.age}</td>
                <td>
                    <button onclick="editStudent(${s.id}, '${s.name}', '${s.email}', ${s.age})">Edit</button>
                    <button onclick="deleteStudent(${s.id})">Delete</button>
                </td>
            `;
            studentsTableBody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
    }
}

// Add or Update student
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        age: parseInt(document.getElementById("age").value)
    };

    const id = studentIdInput.value;

    try {
        if (id) {
            // Update
            student.id = parseInt(id);
            await fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });
        } else {
            // Add
            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });
        }

        form.reset();
        studentIdInput.value = "";
        formTitle.innerText = "Add Student";
        cancelBtn.style.display = "none";
        fetchStudents();
    } catch (err) {
        console.error(err);
    }
});

// Edit student
function editStudent(id, name, email, age) {
    studentIdInput.value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("age").value = age;
    formTitle.innerText = "Edit Student";
    cancelBtn.style.display = "inline-block";
}

// Cancel edit
cancelBtn.addEventListener("click", () => {
    form.reset();
    studentIdInput.value = "";
    formTitle.innerText = "Add Student";
    cancelBtn.style.display = "none";
});

// Delete student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        fetchStudents();
    } catch (err) {
        console.error(err);
    }
}

// Initial fetch
fetchStudents();
