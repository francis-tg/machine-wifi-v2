#!/usr/bin/env python
# -*- coding: utf-8 -*-
import OPi.GPIO as GPIO
from time import sleep       # this lets us have a time delay
import sys,requests,socket,json
count = 0
GPIO.setboard(GPIO.H616)    # Orange Pi ZERO 2 processor H616 board
GPIO.setmode(GPIO.BOARD)        # set up BOARD BCM numbering
GPIO.setup(int(sys.argv[2]), GPIO.IN,pull_up_down=GPIO.PUD_UP) # Monnayeur
GPIO.setup(int(sys.argv[1]), GPIO.IN,pull_up_down=GPIO.PUD_UP) #button
def send_post_request(url, json_data):
    try:
        headers = {'Content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(json_data), headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print("Failed to send POST request. Status code: %s" % response.status_code)
    except requests.RequestException as e:
        print("An error occurred: %s" % e)
    return None
def get_local_ip():
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except socket.error as e:
        print("An error occurred: %s" % e)
    return None
def detecter_piece(channel):
    global count
    if GPIO.input(int(sys.argv[2])):
        count +=10
        print("Pièce détectée! "+str(count))
    else:
        print("Aucune pièce détectée.")
# Configuration de l'interruption sur la broche du monnayeur

def detectBtnPush(channel):
    global count
    #subprocess.Popen(["node","ticketVending.js",str(count)])
    send_post_request(url="http://"+get_local_ip()+":4000/api/tickets/buy", json_data={"price":count})
    count = 0

GPIO.add_event_detect(int(sys.argv[2]), GPIO.BOTH, callback=detecter_piece)
GPIO.add_event_detect(int(sys.argv[1]), GPIO.BOTH, callback=detectBtnPush,bouncetime=200)
try:
    print ("Press CTRL+C to exit")
    while True:
        """ if GPIO.input(int(sys.argv[1]))==GPIO.LOW:
            sleep(0.1) """
#            print("press")
        pass
        

except KeyboardInterrupt:
    GPIO.cleanup()              # Clean GPIO
    print ("Bye.")        # set BCM7 (pin 26) as an output (LED)

