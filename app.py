from flask import Flask, request, redirect, render_template
import sqlite3
import bcrypt
import json

app = Flask(__name__, template_folder='http')

@app.route('/register', methods= ['POST','GET'])
def register():
    connection = sqlite3.connect('fakebank.db')
    cursor = connection.cursor()

    if (request.method == 'POST'):
        email = request.form["email"]
        username = request.form["username"]
        funds = request.form["funds"]
        password = bytes(request.form["password"], 'utf-8')
        pepper = bytes("sneezeSauce", 'utf-8')
        salt = bcrypt.gensalt()
        encryptedPass= bcrypt.hashpw(password + pepper, salt)

        try:
            querry="""INSERT INTO accounts 
                    (email, username, funds, password)
                    VALUES (?,?,?,?)"""
            cursor.execute(querry, (email,username,funds,encryptedPass))
            connection.commit()
            connection.close()
            return redirect('/login')
        except:
            "Registration Error"
            print("error")
            return redirect('/error')
    else:
        return render_template("register.html")

@app.route('/login', methods= ['POST', 'GET'])
def login():

    connection = sqlite3.connect('fakebank.db')
    cursor= connection.cursor()

    if (request.method == 'POST'):
        email= request.form["email"]
        password=bytes(request.form["password"], 'utf-8')
        try:
            
            cursor.execute("SELECT * FROM accounts WHERE email= ?", (email,))
           
            connection.commit()
            
            hashedpass= cursor.fetchone()[3]
            pepper = bytes("sneezeSauce", 'utf-8')
            if bcrypt.checkpw(password + pepper, hashedpass):
                #login token stuff
                return redirect('/')
            else:
                #err
                return redirect('/login')

        except:
            "querry error"
            print('error')


    else:
        return render_template("login.html")


if __name__ == '__main__':
    app.run(debug=True)