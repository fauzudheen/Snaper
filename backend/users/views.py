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