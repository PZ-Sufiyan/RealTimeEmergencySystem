from googlemaps import Client

gmaps = Client(key="YOUR_GOOGLE_MAPS_API_KEY")

def is_within_geofence(user_location, geofence_center, radius):
    """
    Check if user location is within the geofence radius
    """
    distance_result = gmaps.distance_matrix(
        origins=[f"{user_location['lat']},{user_location['lng']}"],
        destinations=[f"{geofence_center['lat']},{geofence_center['lng']}"]
    )
    distance = distance_result["rows"][0]["elements"][0]["distance"]["value"]
    return distance <= radius
