"""
Utility functions for user management and email validation.
"""

import re
from typing import Optional


def is_unitec_email(email: str) -> bool:
    """
    Check if the email is from a Unitec domain.
    
    Args:
        email (str): Email address to check
        
    Returns:
        bool: True if email is from Unitec domain, False otherwise
    """
    if not email:
        return False
    
    # Extract domain from email
    domain = extract_domain(email)
    
    # List of Unitec email domains
    unitec_domains = [
        'unitec.ac.nz',
        'myunitec.ac.nz',
        'student.unitec.ac.nz',
        'staff.unitec.ac.nz',
        'faculty.unitec.ac.nz',
        # Add more Unitec domains if needed
    ]
    
    return domain.lower() in unitec_domains


def extract_domain(email: str) -> str:
    """
    Extract domain from email address.
    
    Args:
        email (str): Email address
        
    Returns:
        str: Domain part of the email
    """
    if not email or '@' not in email:
        return ''
    
    return email.split('@')[1]


def validate_unitec_id(unitec_id: str) -> bool:
    """
    Validate Unitec student ID format.
    
    Args:
        unitec_id (str): Unitec student ID to validate
        
    Returns:
        bool: True if valid format, False otherwise
    """
    if not unitec_id:
        return False
    
    # Remove any spaces or special characters
    clean_id = re.sub(r'[^a-zA-Z0-9]', '', unitec_id)
    
    # Basic validation - adjust pattern based on actual Unitec ID format
    # Example pattern: 7 digits format
    pattern = r'^[0-9]{7}$'  # 7 digits format
    
    return bool(re.match(pattern, clean_id))


def get_approval_status_by_email(email: str) -> str:
    """
    Determine approval status based on email domain.
    
    Args:
        email (str): Email address
        
    Returns:
        str: 'approved' for Unitec emails, 'pending' for others
    """
    if is_unitec_email(email):
        return 'approved'
    return 'pending'


def is_graduated_user(graduation_date, max_months: int = 12) -> bool:
    """
    Check if user is within the graduated user period (default 12 months).
    
    Args:
        graduation_date: User's graduation date
        max_months (int): Maximum months after graduation (default 12)
        
    Returns:
        bool: True if user is within graduated period, False otherwise
    """
    if not graduation_date:
        return False
    
    from datetime import datetime, timedelta
    from django.utils import timezone
    
    current_date = timezone.now().date()
    max_date = graduation_date + timedelta(days=max_months * 30)  # Approximate
    
    return current_date <= max_date
