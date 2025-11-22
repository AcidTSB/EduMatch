"""
Script để test WebSocket Chat Service
Kiểm tra kết nối và gửi tin nhắn
"""

import websocket
import json
import time
import threading

# Cấu hình
WS_URL = "ws://localhost:8080/api/ws"
TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbXBsb3llciIsInJvbGVzIjoiUk9MRV9FTVBMT1lFUiIsImlhdCI6MTczMjI4Mjg4NCwiZXhwIjoxNzMyMzY5Mjg0fQ.jHRMDjDzqrG9vEYUbHEsVXP2DgLYkDQv7Vm71jM3Wk4"

def on_message(ws, message):
    """Callback khi nhận tin nhắn từ server"""
    print(f"\n📨 Received: {message}")
    try:
        data = json.loads(message)
        print(f"   Parsed: {json.dumps(data, indent=2)}")
    except:
        print(f"   (Not JSON)")

def on_error(ws, error):
    """Callback khi có lỗi"""
    print(f"\n❌ Error: {error}")

def on_close(ws, close_status_code, close_msg):
    """Callback khi đóng kết nối"""
    print(f"\n🔌 Connection closed")
    print(f"   Status: {close_status_code}")
    print(f"   Message: {close_msg}")

def on_open(ws):
    """Callback khi kết nối thành công"""
    print(f"\n✅ Connected to {WS_URL}")
    
    # Gửi STOMP CONNECT frame
    connect_frame = f"""CONNECT
TOKEN_AUTH:Bearer {TOKEN}
accept-version:1.1,1.0
heart-beat:10000,10000

\0"""
    
    print("\n📤 Sending CONNECT frame...")
    ws.send(connect_frame)
    
    # Đợi 2 giây để nhận CONNECTED
    time.sleep(2)
    
    # Subscribe to topic
    subscribe_frame = """SUBSCRIBE
id:sub-0
destination:/topic/messages/2

\0"""
    
    print("\n📤 Subscribing to /topic/messages/2...")
    ws.send(subscribe_frame)
    
    # Đợi 1 giây
    time.sleep(1)
    
    # Gửi tin nhắn
    message_payload = json.dumps({
        "receiverId": 3,
        "content": "Hello from Python test!"
    })
    
    send_frame = f"""SEND
destination:/app/chat.send
content-type:application/json
content-length:{len(message_payload)}

{message_payload}\0"""
    
    print(f"\n📤 Sending message...")
    print(f"   Payload: {message_payload}")
    ws.send(send_frame)
    
    print("\n⏳ Waiting for response (10 seconds)...")
    time.sleep(10)
    
    # Đóng kết nối
    print("\n👋 Disconnecting...")
    ws.close()

def test_websocket():
    """Test WebSocket connection"""
    print("="*70)
    print("Testing WebSocket Chat Service")
    print("="*70)
    print(f"URL: {WS_URL}")
    print(f"Token: {TOKEN[:50]}...")
    print("="*70)
    
    # Tạo WebSocket connection
    ws = websocket.WebSocketApp(
        WS_URL,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    
    # Chạy WebSocket trong thread riêng
    ws.run_forever()

if __name__ == "__main__":
    try:
        test_websocket()
    except KeyboardInterrupt:
        print("\n\n⚠️ Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Test failed: {e}")
