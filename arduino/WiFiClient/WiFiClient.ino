#include <WiFi.h>;
#include <HTTPClient.h>;
#include <ArduinoJson.h>;

const char* ssid = "muhendisler2.4";
const char* password = "gucluturkiye2024";
const char* authToken = "BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjExLCJ1c2VybmFtZSI6ImFmeW9ubHUiLCJjaXR5IjoiQWZ5b25rYXJhaGlzYXIiLCJwcm92aW5jZSI6Ik1lcmtleiIsImlhdCI6MTcwNTMzNzc3MywiZXhwIjoxNzA1NTEwNTczfQ.HoucLTF9wldDtPFfaCEIevZI9gNsPlGfW6B2DjNk85w";

void setup(){
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  WiFi.begin(ssid,password);
  Serial.print("Connecting to Wifi");

  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected to Wifi Network");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop(){
  if(WiFi.status() == WL_CONNECTED){

    HTTPClient client;

    client.begin("https://api.fecriati.com.tr/check");
    client.addHeader("Authorization", authToken);
    Serial.println("İstek atılıyor...");
    int httpCode = client.GET();

    if(httpCode == 201 || httpCode == 200){
      String payload = client.getString();
      Serial.println("\nStatusCode: " + String(httpCode));
      Serial.println(payload);
      digitalWrite(LED_BUILTIN, LOW);
    }else if(httpCode == 401){
      digitalWrite(LED_BUILTIN, HIGH);  // turn the LED on (HIGH is the voltage level)
      String payload = client.getString();
      Serial.println("\nStatusCode: " + String(httpCode));
      Serial.println(payload);
    }else{
      digitalWrite(LED_BUILTIN, HIGH);  // turn the LED on (HIGH is the voltage level)
      String payload = client.getString();
      Serial.println("\nStatusCode: " + String(httpCode));
      Serial.println(payload);
    }


  }else{
    Serial.println("Connection Lost");
  }
  delay(3000);
}


