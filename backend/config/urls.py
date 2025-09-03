from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from users.views import me

urlpatterns = [
    path("admin/", admin.site.urls),

    # Djoser auth
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),

    # OpenAPI schema + Swagger UI (drf-spectacular)
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    # Test protected endpoint
    path("me/", me),
]