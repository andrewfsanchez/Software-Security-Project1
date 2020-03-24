from flask import Flask, request, redirect, render_template, json
from flask_jwt_extended import (create_access_token, create_refresh_token, JWTManager, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from flask_restful import Api
from flask_cors import CORS

import sqlite3
import bcrypt
import json
import demjson

app = Flask(__name__, template_folder='http')
CORS(app, supports_credentials=True)

app.config['JWT_TOKEN_LOCATION'] = ['cookies', 'headers']
app.config['JWT_SECRET_KEY']= 'monkeygang'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
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
        a="SELECT * FROM accounts WHERE email= '%s';" % email
        cursor.execute(a)
        
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



        if hashedpass!='' and bcrypt.checkpw(pepperedPass, hashedpass):
            #login token stuff
            access_token = create_access_token(identity=email)
            
            #refresh_token = create_refresh_token(identity=email)
            return (json.dumps({'access_token': access_token}), 200, {'content-type':'application/json'})
        else:
            #wrong password
            return (json.dumps({'error': 'invalid username or password'}), 404, {'content-type':'application/json'})

    except:
        #print('error')
        return (json.dumps({'error': 'login error'}), 400, {'content-type':'application/json'})


@app.route('/home', methods=['GET', 'POST'])
@jwt_required
def get():
    connection = sqlite3.connect('fakebank.db')
    cursor= connection.cursor()
    
    #current_user=demjson.decode(request.data)["email"]

    try:
        current_user=get_jwt_identity()
        cursor.execute("SELECT * FROM accounts WHERE email= ?", (current_user,))
        connection.commit()

        user=cursor.fetchone()

        return (json.dumps({'username':user[1], 'funds':user[2]}), 200, {'content-type':'application/json'})

    except:
        return (json.dumps({'error': 'querry error'}), 400, {'content-type':'application/json'})
    

@app.route('/home-insecure', methods=['POST'])
@jwt_required
def get_secure():
    connection = sqlite3.connect('fakebank.db')
    cursor= connection.cursor()
    
    current_user=demjson.decode(request.data)["email"]

    try:
        #current_user=get_jwt_identity()
        cursor.execute("SELECT * FROM accounts WHERE email= ?", (current_user,))
        connection.commit()

        user=cursor.fetchone()

        return (json.dumps({'username':user[1], 'funds':user[2]}), 200, {'content-type':'application/json'})

    except:
        return (json.dumps({'error': 'querry error'}), 400, {'content-type':'application/json'})
    

@app.route('/transfer', methods=['POST', 'GET'])
@jwt_required
def transfer():
    print('hey')
    connection = sqlite3.connect('fakebank.db')
    cursor= connection.cursor()

    requestData = demjson.decode(request.data)
    sender= requestData['sender']
    receiver= requestData['receiver']
    transferAmount= requestData['transferAmount']

    try:
        cursor.execute("SELECT * FROM accounts WHERE email= ?", (sender,))
        
        senderInfo=cursor.fetchone()
        

        if (int(senderInfo[2])<int(transferAmount)):
            return (json.dumps({'error': 'invalid amount given'}), 400, {'content-type':'application/json'})
        print(receiver)
        cursor.execute("UPDATE accounts SET funds= funds+? WHERE email = ?", (int(transferAmount), receiver,))
        cursor.execute("UPDATE accounts SET funds= funds-? WHERE email = ?", (int(transferAmount), sender,))
        
        connection.commit()

        

        return (json.dumps({'success': 'funds transfered'}), 200, {'content-type':'application/json'})
    except:
        return (json.dumps({'error': 'querry error'}), 400, {'content-type':'application/json'})



@app.route('/search-insecure', methods=['POST'])
def search():
    connection = sqlite3.connect('fakebank.db')
    cursor= connection.cursor()

    requestData = demjson.decode(request.data)
    username = requestData['username']

    cursor.execute("SELECT * FROM accounts WHERE username= '%s';" % username)
    
    connection.commit()

    users=[]
    for row in cursor.fetchall():
        users.append({'email':row[0],'funds':row[2]})

    print(users)
    return (json.dumps({'users': users}), 200, {'content-type':'application/json'})


@app.route('/search', methods=['POST'])
def search_secure():
    connection = sqlite3.connect('fakebank.db')
    cursor= connection.cursor()

    requestData = demjson.decode(request.data)
    username = requestData['username']

    cursor.execute("SELECT * FROM accounts WHERE username= ?;" , (username,))
    
    connection.commit()

    users=[]
    for row in cursor.fetchall():
        users.append({'email':row[0],'funds':row[2]})

    print(users)
    return (json.dumps({'users': users}), 200, {'content-type':'application/json'})

if __name__ == '__main__':
    app.run(debug=True)