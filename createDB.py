import sqlite3

connection = sqlite3.connect('fakebank.db')
cursor= connection.cursor()

cursor.execute("CREATE TABLE IF NOT EXISTS accounts (email TEXT, username TEXT, funds INTEGER, password TEXT, PRIMARY KEY(email))")
connection.commit()
connection.close()