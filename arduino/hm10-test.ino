#define HM10 Serial1

void setup() {
  // Start the hardware serial communication for the Serial Monitor at 9600 baud rate
  Serial.begin(9600);
  // Start the hardware serial communication for the HM-10 module at 9600 baud rate
  HM10.begin(9600); // The HM-10 default baud rate is 9600

  delay(1000); // Allow time for initialization

  Serial.println("Getting HM-10 module information...");

  // Test connection with AT command
  sendATCommand("AT", 2000);

  // Get module name
  sendATCommand("AT+NAME?", 2000);

  // Get module version
  sendATCommand("AT+VERR?", 2000);

  // Get baud rate
  sendATCommand("AT+BAUD?", 2000);

  // Get role of the module
  sendATCommand("AT+ROLE?", 2000);

  // Get service UUID
  sendATCommand("AT+UUID?", 2000);

  // Get characteristic UUID
  sendATCommand("AT+CHAR?", 2000);

  // Get MAC address
  sendATCommand("AT+ADDR?", 2000);

  // Get power level
  sendATCommand("AT+POWE?", 2000);
}

void loop() {
  // Do nothing in loop
}

void sendATCommand(const char* command, int delayTime) {
  Serial.print("Sending command: ");
  Serial.println(command);
  HM10.println(command);
  delay(delayTime);

  // Read and print response
  while (HM10.available()) {
    char c = HM10.read();
    Serial.write(c);
  }
  Serial.println();
}
