"""
Run once to create a test Supabase auth user and insert their profile row.
Usage: python create_test_user.py
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])

EMAIL = "testuser@drexel.edu"
PASSWORD = "DFFtest2026!"

response = supabase.auth.admin.create_user({
    "email": EMAIL,
    "password": PASSWORD,
    "email_confirm": True,
    "user_metadata": {"first_name": "Test", "last_name": "User"},
})

user_id = response.user.id

supabase.table("Users").insert({
    "id": user_id,
    "first_name": "Test",
    "last_name": "User",
    "email": EMAIL,
    "notifications": False,
    "vegetarian": False,
    "vegan": False,
    "halal": False,
}).execute()

print("Test user created.")
print(f"  Email:    {EMAIL}")
print(f"  Password: {PASSWORD}")
print(f"  User ID:  {user_id}")
