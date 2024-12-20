from . import models
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    """
    This serializer handles user data validation and serialization,
    including password hashing during user creation.
    """
    password = serializers.CharField(write_only=True)
    class Meta:
        model = models.User
        fields = ['id', 'username', 'password', 'email']  

class TemporaryUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TemporaryUser
        fields = ['email', 'username', 'password']


class UserSignIn(serializers.Serializer):
    """
    This serializer validates the email and password provided by the user
    during the sign-in process.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True) 


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    """
    This serializer extends the default TokenRefreshSerializer to include user
    information in the response after a successful token refresh.
    """
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = RefreshToken(attrs['refresh'])
        user = models.User.objects.get(id=refresh['user_id'])  
        data['user'] = {
            'id': user.id,
            'username': user.username,
        }

        return data

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Image
        fields = ['id', 'image_file', 'title', 'order', 'created_at']

class ImageUploadSerializer(serializers.Serializer):
    file = serializers.ImageField()
    title = serializers.CharField(max_length=200)

class MultipleImageUploadSerializer(serializers.Serializer):
    images = ImageUploadSerializer(many=True)