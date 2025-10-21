from django.contrib import admin
from .models import Producto, Categoria

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "slug")
    search_fields = ("nombre",)
    prepopulated_fields = {"slug": ("nombre",)}

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categoria", "precio", "oferta", "popular")
    list_filter = ("categoria", "oferta", "popular")
    search_fields = ("nombre", "descripcion")
