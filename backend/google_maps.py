import googlemaps

gmaps = googlemaps.Client(key="AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ")  # Replace with your actual API key

def get_geocoded_address(lat, lng):
    result = gmaps.reverse_geocode((lat, lng))
    return result[0]["formatted_address"] if result else "Address not found"

def get_directions(agent_location, user_location):
    directions = gmaps.directions(
        origin=f"{agent_location.latitude},{agent_location.longitude}",
        destination=f"{user_location.latitude},{user_location.longitude}"
    )
    return directions

def get_distance_matrix(agent_location, user_location):
    distance_matrix = gmaps.distance_matrix(
        origins=[f"{agent_location.latitude},{agent_location.longitude}"],
        destinations=[f"{user_location.latitude},{user_location.longitude}"]
    )
    return distance_matrix["rows"][0]["elements"][0]
