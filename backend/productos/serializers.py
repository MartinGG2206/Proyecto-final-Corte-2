from rest_framework import serializers
from .models import Producto, Review

class ProductoSerializer(serializers.ModelSerializer):
    categoria_slug = serializers.ReadOnlyField()
    categoria_nombre = serializers.ReadOnlyField()
    imagen_url = serializers.ReadOnlyField()

    class Meta:
        model = Producto
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    usuario_username = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ("usuario", "fecha")
