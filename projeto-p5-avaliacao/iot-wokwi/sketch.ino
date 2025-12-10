#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.hivemq.com";

#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
  
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    String clientId = "ESP32-" + String(random(0xffff), HEX);
    client.connect(clientId.c_str());
  }
  client.loop();

  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  if (!isnan(temp)) {
    String payload = "{\"temperatura\":" + String(temp) + ",\"umidade\":" + String(hum) + "}";
    client.publish("esp32/sensors", payload.c_str());
    Serial.println(payload);
  }
  
  delay(5000);
}
