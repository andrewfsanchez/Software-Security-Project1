from flask import Flask, request, redirect, render_template, json
from flask_jwt_extended import (create_access_token, create_refresh_token, JWTManager, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from flask_cors import CORS

import sqlite3
import bcrypt
import json
import demjson

app = Flask(__name__, template_folder='http')
CORS(app, support_credentials=True)


app.config['JWT_SECRET_KEY']= 'monkeygang'
jwt = JWTManager(app)

@app.route('/register', methods= ['POST'])
def register():
    connection = sqlite3.connect('fakebank.db')
    cursor = connection.cursor()
 
    #email = request.data.email
    #username = request.data.username
    #funds = request.data.funds
    #password = bytes(request.data.password, 'utf-8')
    #pepper = bytes("sneezeSauce", 'utf-8')

    requestData = demjson.decode(request.data)
    email = requestData['email']
    username = requestData['username']
    funds = requestData['funds']
    password = bytes(requestData['password'].encode('utf-8'))

    
    pepper = bytes("sneezeSauce".encode('utf-8'))

    salt = bcrypt.gensalt()
    encryptedPass= bcrypt.hashpw(password + pepper, salt)

    try:
        querry="""INSERT INTO accounts 
                (email, username, funds, password)
                VALUES (?,?,?,?)"""
        cursor.execute(querry, (email,username,funds,encryptedPass))

        connection.commit()
        connection.close()

        access_token = create_access_token(identity=email)
        #refresh_token = create_refresh_token(identity=email)
        return (json.dumps({'access_token': access_token}), 200, {'content-type':'application/json'})   
    except:
        "Registration Error"
        print("error")
        return (json.dumps({'error': 'registration failed'}), 404, {'content-type':'application/json'})

@app.route('/login', methods= ['POST'])
def login():

    connection = sqlite3.connect('fakebank.db')
    cursor= connection.cursor()

    #print(request.headers.get('email'))
    #email= request.headers.get('email', None)
    
    #password=bytes(request.headers.get('password'), 'utf-8')

    requestData = demjson.decode(request.data)
    email = requestData['email']
    password = bytes(requestData['password'].encode('utf-8'))

    try:
            
        cursor.execute("SELECT * FROM accounts WHERE email= ?", (email,))

        connection.commit()
        user=cursor.fetchone()
        hashedpass=''

        try:
            hashedpass= user[3]
        except:
            hashedpass=''
        #pepper = bytes("sneezeSauce", 'utf-8')
        pepper = bytes("sneezeSauce".encode('utf-8'))

        pepperedPass = password + pepper
        if hashedpass!='' and bcrypt.checkpw(pepperedPass.encode('utf-8'), hashedpass.encode('utf-8')):
            #login token stuff
            access_token = create_access_token(identity=email)

            #refresh_token = create_refresh_token(identity=email)
            return (json.dumps({'access_token': access_token}), 200, {'content-type':'application/json'})
        else:
            #wrong password
            return (json.dumps({'error': 'invalid username or password'}), 404, {'content-type':'application/json'})

    except:
        #print('error')
        return (json.dumps({'error': 'login error'}), 404, {'content-type':'application/json'})


if __name__ == '__main__':
    app.run(debug=True)