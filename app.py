from flask import Flask, request, redirect, render_template
import sqlite3
import bcrypt
import json

app = Flask(__name__, template_folder='template')

@app.route('/register', methods= ['POST','GET'])
def register():
    connection = sqlite3.connect('fakebank.db')
    cursor = connection.cursor()

    if (request.method == 'POST'):
        email = request.form["email"]
        username = request.form["username"]
        funds = request.form["funds"]
        password = request.form["password"]

        salt = bcrypt.gensalt()
        encryptedPass= bcrypt.hashpw(password.encode('utf8'), salt)

        try:
            querry="""INSERT INTO accounts 
                    (email, username, funds, password)
                    Values (?,?,?,?);"""
            cursor.execute(querry, (email,username,funds,password))
            connection.commit()
            return redirect('/')
        except:
            "Registration Error"
    else:
        return render_template("register.html")

if __name__ == '__main__':
    app.run(debug=True)