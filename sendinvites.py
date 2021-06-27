#!/usr/bin/env python3
import requests
import json
import sys

from urllib3.exceptions import InsecureRequestWarning
# Suppress only the single warning from urllib3 needed.
requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)


API_HOSTNAME = 'api-qa.codehall.in'
print(sys.argv)
if(len(sys.argv) == 2):
    o = int(sys.argv[1])
    if(o == 1):
        API_HOSTNAME = 'api-qa.codehall.in'
    if(o == 2):
        API_HOSTNAME = '192.168.43.232'
    if(o == 3):
        API_HOSTNAME = '192.168.43.233'

x_access_token = ''
x_refresh_token = ''

def token_req(fun):
    def tokenized_req(*args,**kwargs):
        if 'headers' not in kwargs:
            kwargs['headers'] = dict()
        kwargs['headers']['x-access-token'] = x_access_token
        kwargs['headers']['x-refresh-token'] = x_refresh_token
        return fun(*args,**kwargs)
    return tokenized_req

@token_req
def req(method,url,data,headers,**kwargs):
    loc_headers = {
        'Content-Type': "application/json",
        'cache-control': "no-cache",
    }
    for key in headers.keys():
        loc_headers[key] = headers[key]
    response = requests.request(method, url, data=data, headers=headers,verify=False,**kwargs)
    return response

def send_invites(test_id, email_template):
    url = "https://" +API_HOSTNAME+ ":8002/api/tests/" +test_id+ "/invites/"

    payload = [
        {
            'email_id':'srbcheema1@gmail.com',
            'expiry_datetime':'2020-08-03T10:51:52.990',
            'full_name':'Sarbjit Singh',
            'email_template':email_template,
        }
    ]
    payload = json.dumps(payload)
    headers={}

    return req("POST", url, data=payload, headers=headers)

def admin_login():
    url = "https://" +API_HOSTNAME+ ":8000/api/login/"

    payload = {
        'email':'sa0@x.com',
        'password':'hello123',
    }
    headers = {}

    return req("POST", url, data=payload, headers=headers)

def get_test_id():
    url = "https://" +API_HOSTNAME+ ":8001/api/tests/"

    payload = {}
    headers = {}

    return req("GET", url, data=payload, headers=headers)

def get_email_templates():
    url = "https://" +API_HOSTNAME+ ":8002/api/email_templates/"

    payload = {}
    headers = {}

    return req("GET", url, data=payload, headers=headers)


res = admin_login()
if(res.status_code != 200):
    print(res)
    print(res.text)
    sys.exit()
res = res.json()
x_access_token = res['access_token']
x_refresh_token = res['refresh_token']

res = get_test_id()
if(res.status_code != 200):
    print(res)
    print(res.text)
    sys.exit()
res = res.json()
test_id = res[0]['id']


res = get_email_templates()
if(res.status_code != 200):
    print(res)
    print(res.text)
    sys.exit()
res = res.json()
email_template = res[0]['id']


res = send_invites(test_id,email_template)
if(res.status_code != 201):
    print(res)
    print(res.text)
    sys.exit()
res = res.json()
print(res)
