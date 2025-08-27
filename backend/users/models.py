from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)

    ROLE_CHOICES = [
        ("super_admin", "Super Admin"),
        ("admin", "Admin"),
        ("staff", "Staff"),
        ("student", "Student"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="super_admin")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  # keep username for admin compatibility
