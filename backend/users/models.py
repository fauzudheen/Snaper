from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.

    This model replaces the default username field with an email field,
    ensuring that the email is unique and required for user authentication.
    """
    email = models.EmailField(max_length=255, unique=True, blank=False, null=False)  

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
