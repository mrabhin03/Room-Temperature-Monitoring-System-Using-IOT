#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

const char* ssid = "Wifi-Name";
const char* password = "**********";

WiFiClientSecure client;

#define DHTPIN D4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  randomSeed(analogRead(A0));
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  dht.begin();
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  client.setInsecure();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {

    int humidity = dht.readHumidity();
    int temperature = dht.readTemperature();  

    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }
    setData(humidity, temperature);
    delay(300000);
  } else {
    Serial.println("WiFi not connected");
  }
}

void setData(int humidity, int temperature) {
  Serial.println("Temperature: "+String(temperature)+", Humidity: "+String(humidity) );
  HTTPClient https;
  if (https.begin(client, "https://TheServer.com/setValues.php?humidity=" + String(humidity) + "&temperature=" + String(temperature))) {  // HTTPS URL
    int httpCode = https.GET();

    if (httpCode > 0) {
      Serial.printf("HTTP Response code: %d\n", httpCode);
      String payload = https.getString();
      Serial.print("Payload: ");
      Serial.println(payload);
    } else {
      Serial.printf("GET request failed: %s\n", https.errorToString(httpCode).c_str());
    }

    https.end();
  } else {
    Serial.println("Unable to connect");
  }
}
