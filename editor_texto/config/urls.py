from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path("", RedirectView.as_view(pattern_name="doc_list", permanent=False)),
    path("admin/", admin.site.urls),
    path("editor/", include("editor.urls")),
]
