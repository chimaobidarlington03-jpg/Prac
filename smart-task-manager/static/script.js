async function loadTasks() {
    let res = await fetch("/tasks");
    let tasks = await res.json();

    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        let li = document.createElement("li");

        li.innerHTML = `
            ${task.text} ${task.done ? "✅" : ""}
            <div>
                <button onclick="doneTask(${task.id})">Done</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });

    updateChart();
}

async function addTask() {
    let text = document.getElementById("taskInput").value;

    await fetch("/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text})
    });

    document.getElementById("taskInput").value = "";
    loadTasks();
}

async function doneTask(id) {
    await fetch(`/done/${id}`, {method: "POST"});
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/delete/${id}`, {method: "DELETE"});
    loadTasks();
}

async function updateChart() {
    let res = await fetch("/stats");
    let stats = await res.json();

    new Chart(document.getElementById("chart"), {
        type: "pie",
        data: {
            labels: ["Done", "Pending"],
            datasets: [{
                data: [stats.done, stats.pending]
            }]
        }
    });
}

loadTasks();