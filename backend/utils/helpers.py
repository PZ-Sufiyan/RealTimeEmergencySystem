import json

def parse_json_request(request_body):
    return json.loads(request_body)

def generate_response(success, message, data=None):
    return {
        "success": success,
        "message": message,
        "data": data
    }
