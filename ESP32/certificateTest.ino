#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <EEPROM.h>
#include <ArduinoJson.h>

const char* ssid = "Totalplay-86A5";
const char* password = "86A5ED567Wg8ReVT";

const char* server = "www.api.tarjeto.app";  // Use www subdomain directly
String nexoId = "";  // Will store the nexoId after registration

// EEPROM configuration
#define EEPROM_SIZE 512
#define NEXO_ID_ADDR 0

// Google Trust Services Root R4 Certificate
const char* root_ca = \
"-----BEGIN CERTIFICATE-----\n" \
"MIIDejCCAmKgAwIBAgIQf+UwvzMTQ77dghYQST2KGzANBgkqhkiG9w0BAQsFADBX\n" \
"MQswCQYDVQQGEwJCRTEZMBcGA1UEChMQR2xvYmFsU2lnbiBudi1zYTEQMA4GA1UE\n" \
"CxMHUm9vdCBDQTEbMBkGA1UEAxMSR2xvYmFsU2lnbiBSb290IENBMB4XDTIzMTEx\n" \
"NTAzNDMyMVoXDTI4MDEyODAwMDA0MlowRzELMAkGA1UEBhMCVVMxIjAgBgNVBAoT\n" \
"GUdvb2dsZSBUcnVzdCBTZXJ2aWNlcyBMTEMxFDASBgNVBAMTC0dUUyBSb290IFI0\n" \
"MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAE83Rzp2iLYK5DuDXFgTB7S0md+8Fhzube\n" \
"Rr1r1WEYNa5A3XP3iZEwWus87oV8okB2O6nGuEfYKueSkWpz6bFyOZ8pn6KY019e\n" \
"WIZlD6GEZQbR3IvJx3PIjGov5cSr0R2Ko4H/MIH8MA4GA1UdDwEB/wQEAwIBhjAd\n" \
"BgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDwYDVR0TAQH/BAUwAwEB/zAd\n" \
"BgNVHQ4EFgQUgEzW63T/STaj1dj8tT7FavCUHYwwHwYDVR0jBBgwFoAUYHtmGkUN\n" \
"l8qJUC99BM00qP/8/UswNgYIKwYBBQUHAQEEKjAoMCYGCCsGAQUFBzAChhpodHRw\n" \
"Oi8vaS5wa2kuZ29vZy9nc3IxLmNydDAtBgNVHR8EJjAkMCKgIKAehhxodHRwOi8v\n" \
"Yy5wa2kuZ29vZy9yL2dzcjEuY3JsMBMGA1UdIAQMMAowCAYGZ4EMAQIBMA0GCSqG\n" \
"SIb3DQEBCwUAA4IBAQAYQrsPBtYDh5bjP2OBDwmkoWhIDDkic574y04tfzHpn+cJ\n" \
"odI2D4SseesQ6bDrarZ7C30ddLibZatoKiws3UL9xnELz4ct92vID24FfVbiI1hY\n" \
"+SW6FoVHkNeWIP0GCbaM4C6uVdF5dTUsMVs/ZbzNnIdCp5Gxmx5ejvEau8otR/Cs\n" \
"kGN+hr/W5GvT1tMBjgWKZ1i4//emhA1JG1BbPzoLJQvyEotc03lXjTaCzv8mEbep\n" \
"8RqZ7a2CPsgRbuvTPBwcOMBBmuFeU88+FSBX6+7iP0il8b4Z0QFqIwwMHfs/L6K1\n" \
"vepuoxtGzi4CZ68zJpiq1UvSqTbFJjtbD4seiMHl\n" \
"-----END CERTIFICATE-----\n";

WiFiClientSecure client;

// Function declarations
void showMenu();
void handleConnectionCode();
bool registerNexo(String connectionCode);
void loadNexoId();
void saveNexoId(String id);

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Initialize EEPROM
  EEPROM.begin(EEPROM_SIZE);
  
  // Load saved nexoId if exists
  loadNexoId();

  Serial.println("Connecting to SSID: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  Serial.println("\nConnecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println("\nConnected to WiFi");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  client.setCACert(root_ca);  // Use Google Trust Services certificate
  
  showMenu();
}

void loop() {
  if (Serial.available()) {
    char input = Serial.read();
    
    switch (input) {
      case '1':
        handleConnectionCode();
        break;
      case '2':
        if (nexoId.length() > 0) {
          Serial.println("Current Nexo ID: " + nexoId);
        } else {
          Serial.println("No Nexo ID stored");
        }
        break;
      case '3':
        nexoId = "";
        saveNexoId("");
        Serial.println("Nexo ID cleared");
        break;
      case 'm':
      case 'M':
        showMenu();
        break;
    }
  }
}

void showMenu() {
  Serial.println("\n=== Tarjeto Nexo Test Menu ===");
  Serial.println("1. Register Nexo (Enter Connection Code)");
  Serial.println("2. Show current Nexo ID");
  Serial.println("3. Clear stored Nexo ID");
  Serial.println("M. Show this menu");
  Serial.println("========================");
}

void handleConnectionCode() {
  Serial.println("\nEnter the 5-digit connection code:");
  
  String code = "";
  while (true) {
    if (Serial.available()) {
      char c = Serial.read();
      
      // If enter key is pressed
      if (c == '\n' || c == '\r') {
        if (code.length() > 0) {
          break;
        }
      }
      // Only add digit characters
      else if (isDigit(c)) {
        code += c;
        Serial.print(c); // Echo the character
      }
    }
  }
  
  Serial.println(); // New line after input
  
  if (code.length() != 5) {
    Serial.println("Invalid code format. Please enter a 5-digit number.");
    showMenu();
    return;
  }

  Serial.println("Attempting to register with code: " + code);
  if (registerNexo(code)) {
    Serial.println("Registration successful!");
    showMenu();
  } else {
    Serial.println("Registration failed. Please try again.");
    showMenu();
  }
}

bool registerNexo(String connectionCode) {
  Serial.println("Connecting to server...");
  
  bool success = false;
  int maxRedirects = 5;
  int redirectCount = 0;
  String currentHost = server;
  String currentPath = "/api/nexo/register";
  
  while (redirectCount < maxRedirects) {
    if (!client.connect(currentHost.c_str(), 443)) {
      int err = client.lastError(nullptr, 0);
      Serial.print("Connection failed! Error code: ");
      Serial.println(err);
      char error_buf[100];
      client.lastError(error_buf, 100);
      Serial.print("Detailed error: ");
      Serial.println(error_buf);
      return false;
    }

    // Prepare JSON payload
    StaticJsonDocument<200> doc;
    doc["connectionCode"] = connectionCode;
    String jsonString;
    serializeJson(doc, jsonString);

    Serial.println("Sending request with payload: " + jsonString);
    Serial.println("To host: " + currentHost + currentPath);

    // Prepare HTTP request
    String request = String("POST ") + currentPath + " HTTP/1.1\r\n" +
                    "Host: " + currentHost + "\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Content-Length: " + jsonString.length() + "\r\n" +
                    "Connection: close\r\n\r\n" +
                    jsonString;

    Serial.println("Sending request: ");
    Serial.println(request);
    client.print(request);

    // Read status line
    String statusLine = client.readStringUntil('\n');
    Serial.println("Status: " + statusLine);

    // Parse status code
    int statusCode = statusLine.substring(9, 12).toInt();

    // Read headers
    String location = "";
    bool chunked = false;
    Serial.println("Reading response headers:");
    
    while (client.connected()) {
      String line = client.readStringUntil('\n');
      Serial.println("Header: " + line);
      
      // Check for redirect location
      if (line.startsWith("location: ")) {
        location = line.substring(10);
        location.trim();
      }
      
      if (line.startsWith("Transfer-Encoding: chunked")) {
        chunked = true;
      }
      
      if (line == "\r") {
        Serial.println("End of headers");
        break;
      }
    }

    // Handle redirects (status codes 301, 302, 303, 307, 308)
    if (statusCode >= 300 && statusCode < 400 && location.length() > 0) {
      Serial.println("Following redirect to: " + location);
      
      // Parse the redirect URL
      String newHost = location;
      String newPath = "/";
      
      // Remove protocol
      if (newHost.startsWith("https://")) {
        newHost = newHost.substring(8);
      }
      
      // Split host and path
      int pathStart = newHost.indexOf('/');
      if (pathStart > 0) {
        newPath = newHost.substring(pathStart);
        newHost = newHost.substring(0, pathStart);
      }
      
      currentHost = newHost;
      currentPath = newPath;
      redirectCount++;
      client.stop();
      continue;
    }

    // Read response body
    Serial.println("Reading response body:");
    String responseBody = "";
    
    if (chunked) {
      while (client.available()) {
        String chunkSize = client.readStringUntil('\r');
        client.readStringUntil('\n');
        int size = strtol(chunkSize.c_str(), NULL, 16);
        
        if (size <= 0) break;
        
        while (size > 0) {
          char c = client.read();
          if (c != -1) {
            responseBody += c;
            size--;
          }
        }
        client.readStringUntil('\n');
      }
    } else {
      while (client.available()) {
        char c = client.read();
        responseBody += c;
      }
    }
    
    Serial.println("Raw response body: " + responseBody);

    // Parse response if we have a body
    if (responseBody.length() > 0) {
      StaticJsonDocument<512> response;
      DeserializationError error = deserializeJson(response, responseBody);
      
      if (error) {
        Serial.print("JSON Parse error: ");
        Serial.println(error.c_str());
        client.stop();
        return false;
      }

      if (response["success"]) {
        Serial.println("Success response detected");
        nexoId = response["data"]["nexoId"].as<String>();
        Serial.println("Extracted nexoId: " + nexoId);
        saveNexoId(nexoId);
        success = true;
      } else if (response.containsKey("message")) {
        Serial.println("Error message: " + response["message"].as<String>());
      }
    }

    client.stop();
    break;
  }

  if (redirectCount >= maxRedirects) {
    Serial.println("Too many redirects");
    return false;
  }

  return success;
}

void loadNexoId() {
  nexoId = "";
  for (int i = 0; i < 24; i++) {  // Assuming MongoDB ObjectId length
    char c = EEPROM.read(NEXO_ID_ADDR + i);
    if (c == 0) break;
    nexoId += c;
  }
}

void saveNexoId(String id) {
  for (int i = 0; i < id.length(); i++) {
    EEPROM.write(NEXO_ID_ADDR + i, id[i]);
  }
  EEPROM.write(NEXO_ID_ADDR + id.length(), 0);  // Null terminator
  EEPROM.commit();
}