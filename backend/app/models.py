from app import mongo
from werkzeug.security import generate_password_hash

class User:
    def __init__(self, email, password, hashed=False, checklist=None, budget=None, guests=None):
        self.email = email
        self.password = password if hashed else generate_password_hash(password)
        self.checklist = checklist
        self.budget = budget
        self.guests = guests
        
    def save(self):
        if not mongo:
            raise RuntimeError("MongoDB connection is not initialized. Please check your configuration.")
        
        print(f">>> Saving user to MongoDB: {self.email}")
        
        # Default data for new users
        default_checklist = [
            {"id": 1, "text": "Book the wedding venue", "completed": False, "dueDate": "2025-05-30"},
            {"id": 2, "text": "Choose a wedding date", "completed": True, "dueDate": "2025-05-10"},
            {"id": 3, "text": "Send out save-the-dates", "completed": False, "dueDate": "2025-06-15"},
            {"id": 4, "text": "Hire a photographer", "completed": False, "dueDate": "2025-07-15"},
            {"id": 5, "text": "Select wedding dress", "completed": False, "dueDate": "2025-08-01"}
        ]
        
        default_budget = {
            "venueRental": 12000,
            "catering": 9000,
            "photography": 5000,
            "videography": 3000,
            "weddingAttire": 7000,
            "flowersAndDecor": 6000,
            "stationery": 2500,
            "rings": 4000,
            "officiant": 500,
            "musicAndEntertainment": 4500,
            "transportation": 1000,
            "favorsAndGifts": 1500,
            "honeymoonFund": 5000,
            "miscellaneous": 2000
        }
        
        default_guests = {
            "JohnDoe": {"name": "John Doe", "attending": True},
            "JaneSmith": {"name": "Jane Smith", "attending": False}
        }
        
        user_data = {
            "email": self.email, 
            "password": self.password,
            "checklist": self.checklist if self.checklist else default_checklist,
            "budget": self.budget if self.budget else default_budget,
            "guests": self.guests if self.guests else default_guests
        }
        
        mongo.db.users.insert_one(user_data)
        
    @staticmethod
    def get_by_email(email):
        if not mongo:
            raise RuntimeError("MongoDB connection is not initialized. Please check your configuration.")
            
        user_data = mongo.db.users.find_one({"email": email})
        if user_data:
            print(f">>> Found user in DB: {email}")
            return User(
                email=user_data["email"], 
                password=user_data["password"], 
                hashed=True,
                checklist=user_data.get("checklist"),
                budget=user_data.get("budget"),
                guests=user_data.get("guests")
            )
            
        print(f">>> User not found in DB: {email}")
        return None