from rest_framework import viewsets, filters, permissions
from .models import Producto, Review
from .serializers import ProductoSerializer, ReviewSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().select_related('categoria')
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["nombre", "descripcion", "categoria__nombre"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        cat = self.request.query_params.get("categoria")
        if cat:
            qs = qs.filter(categoria__slug=cat)
        return qs

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related('producto', 'usuario').all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(usuario=user)
