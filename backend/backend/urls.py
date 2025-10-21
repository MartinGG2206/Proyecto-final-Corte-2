from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter
from productos.views import ProductoViewSet, ReviewViewSet

# SimpleJWT (login/refresh)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Vista de registro (la creamos en el paso 2)
from .views import RegisterView

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('admin/', admin.site.urls),

    # API REST de tu app
    path('api/', include(router.urls)),

    # ==== AUTH ====
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
