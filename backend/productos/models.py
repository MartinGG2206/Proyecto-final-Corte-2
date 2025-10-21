from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User

class Categoria(models.Model):
    nombre = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ["nombre"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    imagen = models.ImageField(upload_to="productos/", blank=True, null=True)

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name="productos",
        null=True, blank=True,
    )

    oferta = models.BooleanField(default=False)
    popular = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.nombre

    # helpers para el frontend
    @property
    def categoria_slug(self):
        return self.categoria.slug if self.categoria else None

    @property
    def categoria_nombre(self):
        return self.categoria.nombre if self.categoria else None

    @property
    def imagen_url(self):
        return self.imagen.url if self.imagen else None


class Review(models.Model):
    producto = models.ForeignKey(Producto, related_name='reviews', on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    estrellas = models.PositiveSmallIntegerField(default=5)  # 1-5
    comentario = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        user = self.usuario.username if self.usuario else "anónimo"
        return f"{user} – {self.estrellas}★ a {self.producto.nombre}"
