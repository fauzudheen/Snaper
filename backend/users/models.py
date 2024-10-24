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

class Album(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200) 

class Image(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_file = models.ImageField(upload_to='images/')
    title = models.CharField(max_length=200, default='Untitled')
    order = models.IntegerField()
    album = models.ForeignKey(Album, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) 
 

