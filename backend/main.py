from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import messaging
from google_maps import get_geocoded_address, get_directions, get_distance_matrix
from firebase import send_alert_to_contacts, fetch_user_data

app = FastAPI()

class Location(BaseModel):
    latitude: float
    longitude: float

class EmergencyAlert(BaseModel):
    user_id: str
    location: Location
    emergency_type: str

@app.post("/geocode/")
async def geocode_location(location: Location):
    return {"address": get_geocoded_address(location.latitude, location.longitude)}

@app.post("/directions/")
async def get_directions_to_user(agent_location: Location, user_location: Location):
    return get_directions(agent_location, user_location)

@app.post("/distance/")
async def calculate_distance(agent_location: Location, user_location: Location):
    return get_distance_matrix(agent_location, user_location)

@app.post("/alert/")
async def send_emergency_alert(alert: EmergencyAlert):
    try:
        contacts = fetch_user_data(alert.user_id)["emergency_contacts"]
        send_alert_to_contacts(alert, contacts)
        return {"message": "Alerts sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
