import json
from typing import Union

from django.contrib.auth import login, authenticate, logout

# from django.contrib.auth.models import Group
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseForbidden, HttpRequest
from django.middleware.csrf import rotate_token
from django.conf import settings


def _get_response(request: HttpRequest) -> HttpResponse:
    """Format the json response for a login request

    :param request: a standard request
    :type request: HttpRequest
    :return: a json response with connection info
    :rtype: HttpResponse
    """
    # groups: QuerySet[Group] = request.user.groups.all()  # type: ignore
    return JsonResponse(
        {
            "username": request.user.username,  # type: ignore
        }
    )


@csrf_exempt
def login_view(request: HttpRequest) -> HttpResponse:
    """
    Login user from username/password and get information about
    the authorized orgs for this user. If the user is already logged
    in return this information. If the user has only a session cookie
    and no csrf cookie set a csrf cookie
    """
    # print("Login view", request.method)
    if request.method == "POST":
        if request.user.is_authenticated:
            """print(
                (
                    f"The user {request.user.username}",  # type: ignore
                    " is already athenticated",
                )
            )"""
            csrf: Union[str, None] = request.COOKIES.get(
                settings.CSRF_COOKIE_NAME, None
            )
            # print("Csrf:", csrf)
            # reset the csrf token cookie if needed
            if csrf is None:
                print("Renewing csrf token because user does not have any csrf cookie")
                rotate_token(request)
            return _get_response(request)
        # print("POST", request.body)
        json_data = json.loads(request.body)
        # print("LOGIN", json_data)
        username = json_data["username"]
        password = json_data["password"]
        # print("Authenticate", username, password)
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return _get_response(request)
    return HttpResponseForbidden()


def logout_view(request: HttpRequest) -> HttpResponse:
    """
    Logout a user
    """
    if request.user.is_authenticated is True:
        logout(request)
    return JsonResponse({"ok": 1})
