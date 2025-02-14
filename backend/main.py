from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from firebase_admin import messaging
from fastapi.middleware.cors import CORSMiddleware
from google_maps import get_geocoded_address, get_directions, get_distance_matrix
from firebase import send_alert_to_contacts, fetch_user_data
from fastapi import FastAPI, HTTPException, Depends
import firebase_admin
from firebase_admin import credentials, auth, db
from pydantic import BaseModel
from datetime import datetime
import uuid
import traceback
from geopy.distance import geodesic
from twilio.rest import Client




# Check if Firebase is already initialized
def get_firebase_app():
    if not firebase_admin._apps:  # Check if Firebase is already initialized
        cred = credentials.Certificate("C:\\Users\\sufik\\OneDrive\\Documents\\GitHub\\RealTimeEmergencySystem\\backend\\firebase\\service-account.json")
        firebase_admin.initialize_app(cred, {
            'databaseURL': "https://elisasentry-default-rtdb.asia-southeast1.firebasedatabase.app"
        })
        print("hhrrrrrrrrr")
    else:
        print(f"gghghhg {str(firebase_admin._apps)}")
    return firebase_admin.get_app()
    

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from all origins. Change to specific origins for security.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all headers.
)

# Define request model
class UserNotificationRequest(BaseModel):
    fcm_token: str
    itype: str  # Incident type
    location: str  # Changed from str to float

@app.post("/send-notification-agent/")
async def send_notification(request: UserNotificationRequest):
    try:
        # Create Firebase message
        message = messaging.Message(
            token=request.fcm_token,
            notification=messaging.Notification(
                title="New Incident Assigned",
                body=f"You have been assigned to a new incident: {request.itype} \n"
                     f"Location: {request.location}. \n"
                     f"Check your app for details.",
            ),
            data={"itype": request.itype},  # Use request.itype
        )

        # Send message
        response = messaging.send(message)
        return {"success": True, "message_id": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AgentNotificationRequest(BaseModel):
    fcm_token: str
    agentName: str  # Incident type
    agentContact: str  # Changed from str to float

@app.post("/send-notification-user/")
async def send_notification(request: AgentNotificationRequest):
    try:
        # Create Firebase message
        message = messaging.Message(
            token=request.fcm_token,
            notification=messaging.Notification(
                title="Agent Assigned",
                body=f"Your Agent has been assigned.\n"
                     f"Name: {request.agentName}. \n"
                     f"Contact Number: {request.agentContact}.",
            ),
            data={"agentName": request.agentName},  # Use request.itype
        )

        # Send message
        response = messaging.send(message)
        return {"success": True, "message_id": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SmsRequest(BaseModel):
    to_number: str
    message: str



class Location(BaseModel):
    latitude: float
    longitude: float

class EmergencyAlert(BaseModel):
    user_id: str
    location: Location
    emergency_type: str



class UserSignin(BaseModel):
    email: str
    password: str


class SignInRequest(BaseModel):
    email: str
    password: str

class FCMTokenRequest(BaseModel):
    email: str
    fcmToken: str

@app.post("/api/signin")
async def sign_in(request: SignInRequest):
    try:
        user = auth.get_user_by_email(request.email)
        token = auth.create_custom_token(user.uid)
        return {"token": token}  # Removed decode
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")



@app.post("/api/store-fcm-token")
async def store_fcm_token(request: FCMTokenRequest):
    try:
        user = auth.get_user_by_email(request.email)
        user_id = user.uid
        
        # Store FCM token in Realtime Database
        ref = db.reference(f'users/{user_id}')
        ref.set({
            'email': request.email,
            'id': user_id,
            'fcmToken': request.fcmToken
        })
        return {"message": "FCM token stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
class IncidentReport(BaseModel):
    type: str
    location: Location
    user_id: str
    time: str
    priority: str
    assigned_agent: str
    status: str


# Report an incident
@app.post("/report-incident")
async def report_incident(incident: IncidentReport):
    try:
        ref = db.reference("incidents")
        incident_id = str(uuid.uuid4())
        incident_data = {
            "id": incident_id,
            "type": incident.type,
            "location": {
                "latitude": incident.location.latitude,
                "longitude": incident.location.longitude,
            },
            "user_id": incident.user_id,
            "time": incident.time,
            "priority": incident.priority,
            "assigned_agent": incident.assigned_agent,
            "status": incident.status,
        }
        ref.child(incident_id).set(incident_data)

        return {"message": "Incident reported successfully", "incident_id": incident_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reporting incident: {e}")

# Get nearby unresolved incidents for a specific user
@app.get("/incidents/nearby")
async def get_nearby_incidents(user_id: str, latitude: float, longitude: float):
    try:
        # Get reference to the incidents path in Firebase
        ref = db.reference("incidents")
        
        # Fetch unresolved incidents for the user and within 50-meter radius
        all_incidents = ref.order_by_child("status").equal_to("Unresolved").get()

        nearby_incidents = []
        if all_incidents:
            for incident_id, incident_data in all_incidents.items():
                if incident_data.get("user_id") == user_id:  # Ensure we're checking for the correct user
                    incident_lat = incident_data["location"]["latitude"]
                    incident_lon = incident_data["location"]["longitude"]
                    incident_coords = (incident_lat, incident_lon)
                    user_coords = (latitude, longitude)

                    # Check if the incident is within a 50 meter radius
                    distance = geodesic(user_coords, incident_coords).meters
                    if distance <= 50:
                        incident_data["id"] = incident_id
                        nearby_incidents.append(incident_data)

        return {"message": "Nearby incidents retrieved successfully", "incidents": nearby_incidents}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching nearby incidents: {str(e)}")

# Resolve (or cancel) an incident
@app.put("/incidents/{incident_id}/resolve")
async def resolve_incident(incident_id: str):
    try:
        ref = db.reference(f"incidents/{incident_id}")
        incident_data = ref.get()

        if not incident_data:
            raise HTTPException(status_code=404, detail="Incident not found.")

        # Update the incident status to "Resolved"
        ref.update({"status": "Resolved"})

        return {"message": "Incident has been resolved successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resolving incident: {e}")

# class IncidentReport(BaseModel):
#     type: str
#     location: Location
#     time: str
#     priority: str
#     assigned_agent: str = "N/A"
#     status: str = "Unresolved"

# @app.post("/report-incident")
# async def report_incident(incident: IncidentReport):
#     try:
#         # Create unique incident ID
#         incident_id = str(uuid.uuid4())
        
#         # Get the incident data
#         incident_data = {
#             "id": incident_id,
#             "type": incident.type,
#             "location": incident.location.dict(),
#             "time": incident.time,
#             "priority": incident.priority,
#             "assigned_agent": incident.assigned_agent,
#             "status": incident.status
#         }

#         # Store the incident in Firebase Realtime Database
#         db.reference(f"incidents/{incident_id}").set(incident_data)

#         return {"message": "Incident reported successfully", "incident": incident_data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/incidents/")
# async def get_all_incidents():
#     try:
#         print(f"🔍 Fetching all incidents...")

#         ref = db.reference("incidents")
#         all_incidents = ref.get()

#         if not all_incidents:
#             print("⚠️ No incidents found in Firebase.")
#             return {"message": "No incidents found", "incidents": {}}

#         print(f"✅ Total Incidents Retrieved: {len(all_incidents)}")
#         print("📡 Firebase Data:", all_incidents)  # ✅ Debugging Line

#         return {"message": "Incidents retrieved successfully", "incidents": all_incidents}

#     except Exception as e:
#         print(f"🔥 Error fetching incidents: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving incidents: {str(e)}")
@app.get("/incidents/")
async def get_all_incidents():
    try:
        ref = db.reference("incidents")
        all_incidents = ref.get()
        if not all_incidents:
            return {"message": "No incidents found", "incidents": {}}
        return {"message": "Incidents retrieved successfully", "incidents": all_incidents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving incidents: {str(e)}")

class AssignAgentRequest(BaseModel):
    incident_id: str
    assigned_agent: str

@app.post("/assign-agent")
async def update_assigned_agent(request: AssignAgentRequest):
    try:
        # Reference to the specific incident in Firebase
        incident_ref = db.reference(f"incidents/{request.incident_id}")
        
        # Fetch the incident data
        incident_data = incident_ref.get()
        
        if not incident_data:
            raise HTTPException(status_code=404, detail="Incident not found")

        # Update the assigned_agent field
        incident_ref.update({"assigned_agent": request.assigned_agent})

        return {"message": "Assigned agent updated successfully", "incident_id": request.incident_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating assigned agent: {str(e)}")

class UpdateStatusRequest(BaseModel):
    incident_id: str
    status: str

@app.post("/update-status")
async def update_status(request: UpdateStatusRequest):
    try:
        # Reference to the specific incident in Firebase
        incident_ref = db.reference(f"incidents/{request.incident_id}")
        
        # Fetch the incident data
        incident_data = incident_ref.get()
        
        if not incident_data:
            raise HTTPException(status_code=404, detail="Incident not found")

        # Update the status field
        incident_ref.update({"status": request.status})

        return {"message": "Status updated successfully", "incident_id": request.incident_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating status: {str(e)}")



# Pydantic models
class UserSignup(BaseModel):
    name: str
    email: str
    phone: str
    location: Location  # Change this to Location instead of dict
    password: str
    types: str
    status: str

@app.post("/signup")
def register_user(user: UserSignup):
    try:
        get_firebase_app();
        print(f"📨 Received user signup request: {user}")

        # Step 1: Create the user in Firebase Authentication
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        print(f"✅ User created in Firebase Auth with UID: {user_record.uid}")

        # Step 2: Convert location properly
        location_data = user.location.model_dump()  # Pydantic v2 fix
        print(f"📍 Location data: {location_data}")

        # Step 3: Prepare user data
        user_data = {
            "id": user_record.uid,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "location": location_data,
            "status": user.status,
            "type": user.types
        }
        print(f"📤 User data to be saved: {user_data}")

        # Step 4: Debug Firebase reference
        ref = db.reference(f"/users/{user_record.uid}")
        print(f"🔥 Writing data to Firebase at path: {ref.path}")

        # Step 5: Test writing user data
        ref.set(user_data)  # <-- If it fails, we will know
        print(f"✅ Data successfully written to: {ref.path}")

        return {"message": "User registered successfully", "user": user_data}

    except Exception as e:
        print(f"🔥 Firebase write error: {str(e)}")  # Print error message
        print(f"🔥 Exception Type: {type(e).__name__}")  # Print exception type
        print(f"🔥 Full Exception Stack Trace:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error writing data: {str(e)}")


@app.get("/agents")
def get_all_agents():
    try:
        print(f"🔍 Fetching all users from Firebase")

        # Reference to the users' node in Firebase
        ref = db.reference("/users")

        # Fetch all users' data
        users_data = ref.get()

        if not users_data:
            raise HTTPException(status_code=404, detail="No users found")

        # Filter users with type "agent"
        agents = {key: user for key, user in users_data.items() if user.get("type") == "agent"}

        if not agents:
            return {"message": "No agents found", "agents": {}}

        print(f"✅ Total agents retrieved: {len(agents)}")
        return {"message": "Agents retrieved successfully", "agents": agents}

    except Exception as e:
        print(f"🔥 Firebase read error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving agents: {str(e)}")

@app.get("/type_users")
def get_all_users():
    try:
        print(f"🔍 Fetching all users from Firebase")

        # Reference to the users' node in Firebase
        ref = db.reference("/users")

        # Fetch all users' data
        users_data = ref.get()

        if not users_data:
            raise HTTPException(status_code=404, detail="No users found")

        # Filter users with type "agent"
        users = {key: user for key, user in users_data.items() if user.get("type") == "user"}

        if not users:
            return {"message": "No users found", "users": {}}

        print(f"✅ Total users retrieved: {len(users)}")
        return {"message": "Users retrieved successfully", "users": users}

    except Exception as e:
        print(f"🔥 Firebase read error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")

class UpdateUserStatusRequest(BaseModel):
    user_id: str
    status: str

@app.post("/update-user-status")
async def update_status(request: UpdateUserStatusRequest):
    try:
        # Reference to the specific user in Firebase
        user_ref = db.reference(f"users/{request.user_id}")

        # Fetch the user data
        user_data = user_ref.get()

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        # Update the status field
        user_ref.update({"status": request.status})

        return {"message": "Status updated successfully", "user_id": request.user_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating status: {str(e)}")


# Request body model for updating the user status
class UpdateAgentStatusRequest(BaseModel):
    agent_id: str
    status: str

@app.post("/update-agent-status")
async def update_status(request: UpdateAgentStatusRequest):
    try:
        # Reference to the specific user in Firebase using the user_id
        user_ref = db.reference(f"users/{request.agent_id}")  # Adjust the path if needed for agents
        
        # Fetch the user data
        user_data = user_ref.get()

        if not user_data:
            raise HTTPException(status_code=404, detail="agent not found")

        # Update the status field
        user_ref.update({"status": request.status})

        return {"message": "Status updated successfully", "agent_id": request.agent_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating status: {str(e)}")

# ✅ API to Get All Users from Firebase
@app.get("/users")
def get_all_users():
    try:
        print(f"🔍 Fetching all users from Firebase")

        # Reference to the users' node in Firebase
        ref = db.reference("/users")

        # Fetch all users' data
        users_data = ref.get()

        if not users_data:
            raise HTTPException(status_code=404, detail="No users found")

        print(f"✅ Users data retrieved successfully")
        return {"message": "All users retrieved successfully", "users": users_data}

    except Exception as e:
        print(f"🔥 Firebase read error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")


@app.get("/users/{user_id}")
def get_user(user_id: str):
    try:
        print(f"🔍 Received request to fetch user data for UID: [{user_id}]")  # Added brackets for debugging

        # Reference to the user's data in Firebase
        ref = db.reference(f"/users/{user_id}")
        print(f"📂 Firebase reference path: {ref.path}")  # Print the path being queried

        # Fetch user data
        user_data = ref.get()
        print(f"📥 Raw Firebase Response: {user_data}")  # Print raw response

        if not user_data:
            print(f"⚠️ User with UID [{user_id}] not found in Firebase")
            raise HTTPException(status_code=404, detail="User not found")

        print(f"✅ User data retrieved successfully!")
        return {"message": "User data retrieved successfully", "user": user_data}

    except Exception as e:
        print(f"🔥 Firebase read error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")


# Sign in user
@app.post("/signin")
def login_user(user: UserSignin):
    try:
        user_ref = db.reference("users")
        users = user_ref.get()
        
        for uid, details in users.items():
            if details['email'] == user.email:
                return {"message": "Login successful", "user_type": details["type"]}
        
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/geocode/")
async def geocode_location(location: Location):
    return {"address": get_geocoded_address(location.latitude, location.longitude)}

@app.post("/directions/")
async def get_directions_to_user(agent_location: Location, user_location: Location):
    try:
        directions = get_directions(agent_location, user_location)
        return directions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/distance/")
async def calculate_distance(agent_location: Location, user_location: Location):
    try:
        distance_matrix = get_distance_matrix(agent_location, user_location)
        return distance_matrix["rows"][0]["elements"][0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alert/")
async def send_emergency_alert(alert: EmergencyAlert):
    try:
        contacts = fetch_user_data(alert.user_id)["emergency_contacts"]
        send_alert_to_contacts(alert, contacts)
        return {"message": "Alerts sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
