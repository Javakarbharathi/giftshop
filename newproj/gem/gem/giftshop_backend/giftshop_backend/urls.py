from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Custom Gifts Shop API",
      default_version='v1',
      description="API for Custom Photo Frames, Keychains & E-commerce System",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# giftshop_backend/urls.py

# ... (keep existing imports) ...

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/catalog/', include('catalog.urls')),  # <--- ADD THIS LINE
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

# ... (keep existing media static config) ...

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)