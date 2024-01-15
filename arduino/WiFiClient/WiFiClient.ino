#include <WiFi.h>;
#include <HTTPClient.h>;
#include <ArduinoJson.h>;

const char* ssid = "muhendisler2.4";
const char* password = "gucluturkiye2024";
const char* authToken = "BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjExLCJ1c2VybmFtZSI6ImFmeW9ubHUiLCJjaXR5IjoiQWZ5b25rYXJhaGlzYXIiLCJwcm92aW5jZSI6Ik1lcmtleiIsImlhdCI6MTcwNTMzNzc3MywiZXhwIjoxNzA1NTEwNTczfQ.HoucLTF9wldDtPFfaCEIevZI9gNsPlGfW6B2DjNk85w";
const int pinD2 = 2;

void setup(){
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(pinD2, OUTPUT);


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
      char json[1024];
      payload.replace(" ","");
      payload.replace("\n","");
      payload.trim();
      payload.toCharArray(json, 1024);
      Serial.println(payload);
      StaticJsonDocument<200> doc;
      deserializeJson(doc,json);
      int shutdown = doc["shutdown"];
      if(String(shutdown) == "0"){
        Serial.println("Shutdown Değeri(open): " + String(shutdown) + "\n");
        digitalWrite(pinD2, HIGH);
        digitalWrite(LED_BUILTIN, HIGH);
      }else{
        Serial.println("Shutdown Değeri(off): " + String(shutdown) + "\n");
        digitalWrite(pinD2, LOW);
        digitalWrite(LED_BUILTIN, LOW);
      }
      
      client.end();

    }else if(httpCode == 401){
      //digitalWrite(LED_BUILTIN, HIGH);  // turn the LED on (HIGH is the voltage level)
      String payload = client.getString();
      Serial.println("\nStatusCode: " + String(httpCode));
      Serial.println(payload);
    }else{
      //digitalWrite(LED_BUILTIN, HIGH);  // turn the LED on (HIGH is the voltage level)
      String payload = client.getString();
      Serial.println("\nStatusCode: " + String(httpCode));
      Serial.println(payload);
    }


  }else{
    Serial.println("Connection Lost");
  }
  
  delay(10000);
}


