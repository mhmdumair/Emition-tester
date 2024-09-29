import serial
import requests

# Update the serial port to the one you identified using 'ls /dev/tty.*'
ser = serial.Serial('/dev/tty.usbmodem101', 9600)

# Server details (the server running on your Mac with Express)
server_url = "http://localhost:3000/update_sensor"  # Your Express server's URL and port

while True:
    # Read a line from the serial input
    serial_data = ser.readline().decode('utf-8').strip()

    try:
        # Convert to float (temperature value)
        temperature = float(serial_data)
        print(f"Temperature: {temperature} C")

        # Send data to the server using an HTTP GET request
        params = {'temperature': temperature}
        response = requests.get(server_url, params=params)

        # Print server response
        print("Server response:", response.text)

    except Exception as e:
        print("Error reading or sending data:", e)
