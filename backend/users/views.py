from . import models, serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from .mail import send_signup_verification_email, send_password_reset_email, send_resend_otp_email
from django.contrib.auth.hashers import make_password




class UserList(generics.ListCreateAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [IsAuthenticated] 

class SignIn(APIView):
    def post(self, request):
        serializer = serializers.UserSignIn(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(email=email, password=password)

            if user:
                refresh = RefreshToken.for_user(user)
                user_data = {
                    'id': user.id,
                    'username': user.username
                }
                response_data  =  {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': user_data
                }

                return Response(response_data , status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = serializers.CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class ImageList(generics.ListAPIView):
    serializer_class = serializers.ImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.Image.objects.filter(user=self.request.user)


class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.Image.objects.filter(user=self.request.user)
    
class BulkImageUpload(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        max_order = models.Image.objects.filter(user=request.user).count()

        uploaded_images = []
        titles = request.data.getlist('titles')
        files = request.FILES.getlist('files')  # Access all files in `files`

        for index, (image_file, title) in enumerate(zip(files, titles)):
            new_image = models.Image.objects.create(
                user=request.user,
                image_file=image_file,
                title=title or 'Untitled',
                order=max_order + index + 1
            )
            uploaded_images.append(serializers.ImageSerializer(new_image).data) 

        return Response(uploaded_images, status=status.HTTP_201_CREATED)
    

class UpdateImageOrders(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        images_data = request.data.get('images', [])
        
        with transaction.atomic():
            for image_data in images_data:
                image_id = image_data.get('id')
                new_order = image_data.get('order')
                
                try:
                    image = models.Image.objects.get(
                        id=image_id,
                        user=request.user
                    )
                    image.order = new_order
                    image.save()
                except models.Image.DoesNotExist:
                    continue

        return Response(status=status.HTTP_204_NO_CONTENT) 
    

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            with transaction.atomic():
                # Check for existing temporary user and update if exists
                temp_user = models.TemporaryUser.objects.filter(email=email).first()
                otp = models.TemporaryUser.generate_otp()

                if temp_user:
                    temp_user.username = serializer.validated_data['username']
                    temp_user.password = serializer.validated_data['password']
                    temp_user.otp = otp
                    temp_user.otp_created_at = datetime.now()
                    temp_user.save()
                else:
                    temp_user = models.TemporaryUser.objects.create(
                        email=email,
                        username=serializer.validated_data['username'],
                        password=serializer.validated_data['password'],
                        otp=otp,
                        otp_created_at=datetime.now()
                    )

                try:
                    # Send verification email
                    send_signup_verification_email(email, otp) 
                except Exception as e:
                    # Cleanup if email fails
                    temp_user.delete()
                    return Response(
                        {'error': 'Failed to send verification email'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                return Response({
                    'message': 'Verification code sent to your email',
                    'email': email
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': 'Registration failed. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(generics.CreateAPIView):
    
    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            raise ValidationError({'error': 'Email and OTP are required'})

        try:
            with transaction.atomic():
                temp_user = models.TemporaryUser.objects.get(email=email)

                if not temp_user.is_otp_valid():
                    return Response({
                        'error': 'OTP has expired. Please request a new one.'
                    }, status=status.HTTP_400_BAD_REQUEST)

                if temp_user.otp != otp:
                    return Response({
                        'error': 'Invalid OTP'
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Create actual user
                user = models.User.objects.create_user(
                    username=temp_user.username,
                    email=temp_user.email,
                    password=temp_user.password
                )

                # Clean up temporary user
                temp_user.delete()

                return Response({
                    'message': 'Email verified successfully',
                    'user_id': user.id
                }, status=status.HTTP_200_OK)

        except models.TemporaryUser.DoesNotExist:
            return Response({
                'error': 'Invalid email or registration expired'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Verification failed. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(generics.CreateAPIView):

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')

        if not email:
            raise ValidationError({'error': 'Email is required'})

        try:
            with transaction.atomic():
                temp_user = models.TemporaryUser.objects.get(email=email)

                # Generate new OTP
                new_otp = models.TemporaryUser.generate_otp()
                temp_user.otp = new_otp
                temp_user.otp_created_at = datetime.now()
                temp_user.save()

                try:
                    send_resend_otp_email(email, new_otp)
                except Exception as e:
                    return Response({
                        'error': 'Failed to send verification email'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                return Response({
                    'message': 'New verification code sent to your email',
                    'email': email
                }, status=status.HTTP_200_OK)

        except models.TemporaryUser.DoesNotExist:
            return Response({
                'error': 'No pending registration found for this email'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Failed to resend OTP. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(generics.CreateAPIView):
    def create(self, request, *args, **kwargs):
        email = request.data.get('email')


        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = models.User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

        try:
            with transaction.atomic():
                temp_user = models.TemporaryUser.objects.filter(email=email).first()
                otp = models.TemporaryUser.generate_otp()

                if temp_user:
                    temp_user.otp = otp
                    temp_user.otp_created_at = datetime.now()
                    temp_user.save()
                else:
                    temp_user = models.TemporaryUser.objects.create(
                        email=email,
                        otp=otp,
                        otp_created_at=datetime.now()
                    )

                try:
                    # Send verification email
                    send_password_reset_email(email, otp)
                except Exception as e:
                    # Cleanup if email fails
                    temp_user.delete()
                    return Response(
                        {'error': 'Failed to send verification email'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                return Response({
                    'message': 'Verification code sent to your email',
                    'email': email
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': 'Registration failed. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        


class VerifyEmailForgotPasswordView(generics.CreateAPIView):
    
    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            raise ValidationError({'error': 'Email and OTP are required'})

        try:
            with transaction.atomic():
                temp_user = models.TemporaryUser.objects.get(email=email)

                if not temp_user.is_otp_valid():
                    return Response({
                        'error': 'OTP has expired. Please request a new one.'
                    }, status=status.HTTP_400_BAD_REQUEST)

                if temp_user.otp != otp:
                    return Response({
                        'error': 'Invalid OTP'
                    }, status=status.HTTP_400_BAD_REQUEST)

                
                temp_user.delete()

                user = models.User.objects.get(email=email)
                refresh = RefreshToken.for_user(user)

                return Response({
                    'message': 'Email verified successfully',
                    'access': str(refresh.access_token)
                }, status=status.HTTP_200_OK)

        except models.TemporaryUser.DoesNotExist:
            return Response({
                'error': 'Invalid email or registration expired'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Verification failed. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        try:
            new_password = request.data.get('new_password')
            if not new_password:
                return Response({
                    'error': 'New password is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            
            user.password = make_password(new_password)
            user.save()
            
            return Response({
                'message': 'Password reset successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Failed to reset password'
            }, status=status.HTTP_400_BAD_REQUEST)


