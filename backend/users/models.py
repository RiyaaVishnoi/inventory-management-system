from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid

class CustomUserManager(BaseUserManager):
    """
    Custom user manager that allows creating users without username.
    """
    
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        
        # Normalize email
        email = self.normalize_email(email)
        
        # Create user instance
        user = self.model(email=email, **extra_fields)
        
        # Set password
        if password:
            user.set_password(password)
        
        # Save user
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'super_admin')
        extra_fields.setdefault('approval_status', 'approved')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    # Make username optional and auto-generate if not provided
    username = models.CharField(
        max_length=150, 
        unique=True, 
        blank=True, 
        null=True,
        verbose_name="Username"
    )
    
    # Make first_name and last_name required
    first_name = models.CharField(max_length=150, verbose_name="First Name")
    last_name = models.CharField(max_length=150, verbose_name="Last Name")

    ROLE_CHOICES = [
        ("super_admin", "Super Admin"),
        ("admin", "Admin"),
        ("staff", "Staff"),
        ("student", "Student"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")

    # New fields to be added
    unitec_id = models.CharField(max_length=20, blank=True, null=True, verbose_name="Unitec Student ID")
    
    APPROVAL_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("denied", "Denied"),
    ]
    approval_status = models.CharField(
        max_length=20, 
        choices=APPROVAL_STATUS_CHOICES, 
        default="pending",
        verbose_name="Approval Status"
    )
    
    year_group = models.CharField(max_length=10, blank=True, null=True, verbose_name="Year Group")
    graduation_date = models.DateField(blank=True, null=True, verbose_name="Graduation Date")
    is_unitec_email = models.BooleanField(default=False, verbose_name="Is Unitec Email")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # Remove username from required fields
    
    # Use custom manager
    objects = CustomUserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.email} ({self.get_approval_status_display()})"
    
    def save(self, *args, **kwargs):
        # Auto-generate username if not provided
        if not self.username:
            self.username = f"user_{uuid.uuid4().hex[:8]}"
        
        # Auto-set is_unitec_email and approval_status based on email
        from .utils import is_unitec_email, get_approval_status_by_email
        
        # Only set these if they haven't been explicitly set
        if not hasattr(self, '_is_unitec_email_set') or not self._is_unitec_email_set:
            self.is_unitec_email = is_unitec_email(self.email)
            self._is_unitec_email_set = True
        
        # Only auto-set approval_status if it's still the default value and hasn't been manually changed
        if self.approval_status == 'pending' and (not hasattr(self, '_approval_status_set') or not self._approval_status_set):
            self.approval_status = get_approval_status_by_email(self.email)
            self._approval_status_set = True
        
        super().save(*args, **kwargs)
