from flask import Flask, render_template
import sqlite3
from datetime import date, datetime

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def home():
    return "Hello Dayflow!"

@app.route('/attendance')
def attendance():
    db = get_db()
    history = db.execute(
        "SELECT * FROM attendance WHERE user_id=? ORDER BY id DESC", (1,)
    ).fetchall()
    db.close()
    return render_template('attendance.html', history=history)

@app.route('/checkin', methods=['POST'])
def checkin():
    today = date.today().isoformat()
    now = datetime.now().strftime('%H:%M:%S')

    conn = sqlite3.connect('database.db')
    conn.execute(
        "INSERT INTO attendance (user_id, date, check_in) VALUES (?, ?, ?)",
        (1, today, now)
    )
    conn.commit()
    conn.close()

    return f"Checked in at {now}! <a href='/attendance'>Go back</a>"

@app.route('/checkout', methods=['POST'])
def checkout():
    today = date.today().isoformat()
    now = datetime.now().strftime('%H:%M:%S')

    conn = sqlite3.connect('database.db')
    conn.execute(
        "UPDATE attendance SET check_out=? WHERE user_id=? AND date=?",
        (now, 1, today)
    )
    conn.commit()
    conn.close()

    return f"Checked out at {now}! <a href='/attendance'>Go back</a>"

if __name__ == '__main__':
    app.run(debug=True)