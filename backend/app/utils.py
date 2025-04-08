import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key_here')

def generate_jwt(payload):
    expiration = datetime.utcnow() + timedelta(hours=1)
    payload['exp'] = expiration
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def decode_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
