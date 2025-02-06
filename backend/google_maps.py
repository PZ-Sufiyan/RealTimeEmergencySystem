import googlemaps

gmaps = googlemaps.Client(key="AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ")  # Replace with your actual API key

def get_geocoded_address(lat, lng):
    result = gmaps.reverse_geocode((lat, lng))
    return result[0]["formatted_address"] if result else "Address not found"
    
def get_directions(agent_location, user_location):
    directions = gmaps.directions(
        origin=(agent_location.latitude, agent_location.longitude),
        destination=(user_location.latitude, user_location.longitude)
    )
    if directions:
        # Extracting the polyline coordinates from the directions response
        polyline = directions[0]['legs'][0]['steps']
        route = []
        for step in polyline:
            route.append({
                'latitude': step['end_location']['lat'],
                'longitude': step['end_location']['lng']
            })
        return route
    return []

def get_distance_matrix(agent_location, user_location):
    distance_matrix = gmaps.distance_matrix(
        origins=[(agent_location.latitude, agent_location.longitude)],
        destinations=[(user_location.latitude, user_location.longitude)]
    )
    return distance_matrix["rows"][0]["elements"][0]