from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'username y password requeridos'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'el usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create_user(username=username, password=password)
    return Response({'detail': 'ok'}, status=status.HTTP_201_CREATED)

