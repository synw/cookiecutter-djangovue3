# Django Vuejs 3 cookiecutter

A [cookiecutter](https://github.com/audreyr/cookiecutter) for Django with a Vuejs 3 setup

- Django cors, session and csrf settings for a single page app frontend
- Local ssl support
- Session authentication and csrf support

Packages installed:

- [django-sslserver](https://github.com/teddziuba/django-sslserver)
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers)
- [django-extensions](https://github.com/django-extensions/django-extensions)
- [django-vitevue](https://github.com/synw/django-vitevue)

Optional packages:

- [django-rest-framework](https://www.django-rest-framework.org/)
- [django-filter](https://github.com/carltongibson/django-filter)

## Install

   ```bash
   cookiecutter https://github.com/sveetch/cookiecutter-sveetch-djangoapp.git
   ```

Once the project created cd in the directory and install the backend:

   ```bash
   make install
   ```

Install the frontend

   ```bash
   cd frontend
   yarn
   ```

## Run

Create a superuser:

   ```bash
   make superuser
   ```

Run the backend:

   ```bash
   make srun
   ```

The backend runs on https://localhost:8000

Run the frontend:

   ```bash
   make frontend
   ```

The frontend runs on https://localhost:3000
