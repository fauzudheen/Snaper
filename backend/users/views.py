from . import models, serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView
from django.db import transaction

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

class BulkImage(APIView):
    def post(self, request):
        files = request.FILES.getlist('image_file')

        image_data_list = []
        errors = []

        with transaction.atomic():
            savepoint = transaction.savepoint()  # Create a savepoint to rollback partial changes
            for file in files:
                image_data = {
                    'user': request.user,
                    'image_file': file,
                    'title': request.data.get('title', None),
                    'order': request.data.get('order', None),
                    'album': request.data.get('album', None)
                }

                serializer = serializers.ImageSerializer(data=image_data)
                if serializer.is_valid():
                    serializer.save()
                    image_data_list.append(serializer.data)
                else:
                    errors.append(serializer.errors)
                    # Rollback only this savepoint, continue processing other images
                    transaction.savepoint_rollback(savepoint)
                    # Create a new savepoint after the rollback for future iterations
                    savepoint = transaction.savepoint()

            # If there were errors, rollback the entire transaction
            if errors:
                transaction.savepoint_rollback(savepoint)
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

            # Commit the transaction
            transaction.savepoint_commit(savepoint)

        return Response(image_data_list, status=status.HTTP_201_CREATED)
    
    def delete(self, request):
        image_ids = request.data['ids']
        models.Image.objects.filter(id__in=image_ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class BulkAddToAlbum(APIView):
    def patch(self, request):
        image_ids = request.data['ids']
        album_id = request.data['album_id']
        models.Image.objects.filter(id__in=image_ids).update(album=album_id)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
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