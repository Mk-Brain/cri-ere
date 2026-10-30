import firebase_admin
from firebase_admin import credentials
from backend_cri_ere.core.config import settings

print(settings.GOOGLE_APPLICATION_CREDENTIALS)
cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)

firebase_admin.initialize_app(cred)
