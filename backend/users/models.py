from django.db import models
from django.contrib.auth.models import AbstractUser
import random
from datetime import datetime, timedelta
from django.utils import timezone

class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.

    This model replaces the default username field with an email field,
    ensuring that the email is unique and required for user authentication.
    """
    email = models.EmailField(max_length=255, unique=True, blank=False, null=False)  

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class TemporaryUser(models.Model):
    """
    Temporary storage for user data during verification process
    """
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=150, null=True, blank=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    otp = models.CharField(max_length=6)
    otp_created_at = models.DateTimeField(auto_now_add=True)
    
    def is_otp_valid(self):
        now = timezone.now()
        expiration_time = self.otp_created_at + timedelta(minutes=5)
        return now <= expiration_time

    @staticmethod
    def generate_otp():
        return ''.join([str(random.randint(0, 9)) for _ in range(6)])

class Image(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_file = models.ImageField(upload_to='images/')
    title = models.CharField(max_length=200, default='Untitled')
    order = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True) 
 
