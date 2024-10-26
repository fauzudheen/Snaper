from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenVerifyView,
    TokenRefreshView,
)

urlpatterns = [
    path('signin/', views.SignIn.as_view()),
    path('signup/', views.UserRegistrationView.as_view()),
    path('verify-email/', views.VerifyEmailView.as_view()),
    path('resend-otp/', views.ResendOTPView.as_view()),
    path('forgot-password/', views.ForgotPasswordView.as_view()),
    path('verify-email-forgot-password/', views.VerifyEmailForgotPasswordView.as_view()),
    path('reset-password/', views.ResetPasswordView.as_view()),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('token/verify/', TokenVerifyView.as_view()),
    path('token/refresh/', views.CustomTokenRefreshView.as_view()),
    path('images/', views.ImageList.as_view()),
    path('images/<int:pk>/', views.ImageDetail.as_view()),
    path('images/upload-multiple/', views.BulkImageUpload.as_view()),
    path('images/update-orders/', views.UpdateImageOrders.as_view()),
]
