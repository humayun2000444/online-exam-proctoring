import MySQLdb
import os

def get_db_connection():
    return MySQLdb.connect(
        host="localhost",
        user="root",
        # passwd="Takay1takaane$",
        db="exam_db"
    )
