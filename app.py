from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

tasks = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/add", methods=["POST"])
def add_task():
    data = request.get_json()
    task = {
        "id": len(tasks) + 1,
        "text": data["text"],
        "done": False
    }
    tasks.append(task)
    return jsonify(task)

@app.route("/tasks")
def get_tasks():
    return jsonify(tasks)

@app.route("/done/<int:task_id>", methods=["POST"])
def mark_done(task_id):
    for task in tasks:
        if task["id"] == task_id:
            task["done"] = True
    return jsonify({"status": "updated"})

@app.route("/delete/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return jsonify({"status": "deleted"})

@app.route("/stats")
def stats():
    total = len(tasks)
    done = len([t for t in tasks if t["done"]])
    pending = total - done
    return jsonify({
        "total": total,
        "done": done,
        "pending": pending
    })

if __name__ == "__main__":
    app.run(debug=True)