from firebase_admin import db
from googlemaps import Client as GoogleMapsClient

# Firebase Realtime Database Reference
def get_firebase_reference(path):
    return db.reference(path)

# Function to fetch data from Firebase Realtime Database
def fetch_from_firebase(path):
    ref = get_firebase_reference(path)
    return ref.get()

# Google Maps Client
gmaps = GoogleMapsClient(key="YOUR_GOOGLE_MAPS_API_KEY")
