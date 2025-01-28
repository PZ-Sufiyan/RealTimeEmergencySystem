from firebase_admin import messaging

def send_fcm_notification(title, body, device_token):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        token=device_token
    )
    response = messaging.send(message)
    return response
