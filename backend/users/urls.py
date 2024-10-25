from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenVerifyView,
    TokenRefreshView,
)

urlpatterns = [
    path('signin/', views.SignIn.as_view()),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('token/verify/', TokenVerifyView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('images/', views.ImageList.as_view()),
    path('images/<int:pk>/', views.ImageDetail.as_view()),
    path('images/upload-multiple/', views.BulkImageUpload.as_view()),
    path('images/update-orders/', views.UpdateImageOrders.as_view()),
]
