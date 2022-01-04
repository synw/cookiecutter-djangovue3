"""
Application URLs
"""
from django.urls import path{% if cookiecutter.enable_drf|lower == 'true' %}, include{% endif %}
from django.contrib.auth.decorators import login_required

from .views.auth import login_view, logout_view
{% if cookiecutter.enable_drf|lower == 'true' %}
from .routers import router{% endif %}


app_name = "{{ cookiecutter.app_name }}"


urlpatterns = [
    path("auth/login/", login_view),
    path("auth/logout/", login_required(logout_view)),
    {% if cookiecutter.enable_drf|lower == 'true' %}path("api/", include(router.urls)),{% endif %}
]
