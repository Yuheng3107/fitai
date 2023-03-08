[![Django CI](https://github.com/Yuheng3107/fitai/actions/workflows/django.yml/badge.svg?branch=main)](https://github.com/Yuheng3107/fitai/actions/workflows/django.yml) [![React CI using Jest](https://github.com/Yuheng3107/fitai/actions/workflows/node.js.yml/badge.svg)](https://github.com/Yuheng3107/fitai/actions/workflows/node.js.yml)
## To use virtual environment

do `pip install pipenv` to get pipenv
to activate virtual environment: `pipenv shell`
to install dependencies: `pipenv install`

To make sure sessions are active in view, make sure that GET or POST AJAX requests have
credentials included and also csrf token, for example:

## To prevent import error from showing up
`#type: ignore` to ignore the line
