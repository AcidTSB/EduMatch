"""
Script để debug WebSocket connection issues
Kiểm tra token, connection, và message format
"""

import requests
import json
import base64
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8080"
TEST_USERS = {
    "employer": {
        "email": "employer@edumatch.com",
        "password": "employer123"
    },
    "user": {
        "email": "user@edumatch.com", 
        "password": "user123"
    }
}

def decode_jwt(token):
    """Decode JWT token để xem payload"""
    try:
        # JWT format: header.payload.signature
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        # Decode payload (part 2)
        payload = parts[1]
        # Add padding if needed
        padding = 4 - len(payload) % 4
        if padding != 4:
            payload += '=' * padding
        
        decoded = base64.urlsafe_b64decode(payload)
        return json.loads(decoded)
    except Exception as e:
        print(f"❌ Error decoding JWT: {e}")
        return None

def login_and_get_token(email, password):
    """Login và lấy token"""
    print(f"\n{'='*70}")
    print(f"Logging in as: {email}")
    print(f"{'='*70}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/signin",
            json={"username": email, "password": password},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('accessToken')
            
            print(f"✅ Login successful!")
            print(f"\nToken: {token[:50]}...")
            
            # Decode token
            payload = decode_jwt(token)
            if payload:
                print(f"\n📋 Token Payload:")
                print(f"   Subject (username): {payload.get('sub')}")
                print(f"   Roles: {payload.get('roles')}")
                print(f"   Issued At: {datetime.fromtimestamp(payload.get('iat', 0))}")
                print(f"   Expires At: {datetime.fromtimestamp(payload.get('exp', 0))}")
                
                # Check if expired
                exp = payload.get('exp', 0)
                now = datetime.now().timestamp()
                if exp < now:
                    print(f"\n⚠️ WARNING: Token is EXPIRED!")
                    print(f"   Expired {int(now - exp)} seconds ago")
                else:
                    print(f"\n✅ Token is VALID")
                    print(f"   Expires in {int(exp - now)} seconds ({int((exp - now)/60)} minutes)")
            
            return token
        else:
            print(f"❌ Login failed!")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_http_endpoints(token):
    """Test HTTP endpoints trước khi test WebSocket"""
    print(f"\n{'='*70}")
    print("Testing HTTP Endpoints")
    print(f"{'='*70}")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test /api/conversations
    print("\n1. GET /api/conversations")
    try:
        response = requests.get(f"{BASE_URL}/api/conversations", headers=headers, timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ Success: {len(response.json())} conversations")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test /api/fcm/register
    print("\n2. POST /api/fcm/register")
    try:
        response = requests.post(
            f"{BASE_URL}/api/fcm/register",
            headers=headers,
            json={"fcmToken": "test-token-123"},
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        if response.status_code in [200, 201]:
            print(f"   ✅ Success")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

def main():
    print("""
╔══════════════════════════════════════════════════════════════╗
║          WebSocket Chat Service Debug Tool                  ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    # Test với employer user
    employer_token = login_and_get_token(
        TEST_USERS["employer"]["email"],
        TEST_USERS["employer"]["password"]
    )
    
    if employer_token:
        test_http_endpoints(employer_token)
        
        print(f"\n{'='*70}")
        print("Token for WebSocket testing:")
        print(f"{'='*70}")
        print(f"\nconst TOKEN = \"{employer_token}\";")
        print(f"\n// Use this token in your Frontend localStorage:")
        print(f"localStorage.setItem('auth_token', '{employer_token}');")
    
    print(f"\n{'='*70}")
    print("Next Steps:")
    print(f"{'='*70}")
    print("""
1. Copy the token above
2. Open browser console on http://localhost:3000
3. Run: localStorage.setItem('auth_token', 'PASTE_TOKEN_HERE')
4. Refresh page
5. Try to send a chat message
6. Check browser console for STOMP debug logs
""")

if __name__ == "__main__":
    main()
