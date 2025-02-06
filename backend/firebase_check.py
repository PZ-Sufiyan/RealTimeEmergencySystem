# import firebase_admin
# from firebase_admin import credentials, db

# # Initialize Firebase
# cred = credentials.Certificate("C:\\Users\\sufik\\OneDrive\\Documents\\GitHub\\RealTimeEmergencySystem\\backend\\elisasentry-firebase-adminsdk.json")
# firebase_admin.initialize_app(cred, {
#     'databaseURL': "https://elisasentry-default-rtdb.asia-southeast1.firebasedatabase.app"
# })

# # Test writing a user with a generated UID
# try:
#     test_uid = "odv43604TFgfApiWskUTIive0R63"
#     ref = db.reference(f"/users/{test_uid}")
#     ref.set({
#         "id": test_uid,
#         "name": "Manual Debug User",
#         "email": "manual@example.com",
#         "phone": "9876543210",
#         "location": {"latitude": 37.7749, "longitude": -122.4194},
#         "status": "active",
#         "type": "user"
#     })
#     print(f"✅ Manually created user at path: /users/{test_uid}")
# except Exception as e:
#     print(f"🔥 Firebase write failed: {str(e)}")

