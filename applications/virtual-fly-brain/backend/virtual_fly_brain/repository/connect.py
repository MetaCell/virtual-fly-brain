from cloudharness import applications
import psycopg2

def get_connection():
   
    return psycopg2.connect(applications.get_current_configuration().get_db_connection_string())