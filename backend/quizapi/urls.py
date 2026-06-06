from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    # Auth endpoints
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # Quiz endpoints
    path('questions/', views.question_list, name='question-list'),
    path('categories/', views.category_list, name='category-list'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    
    # Result endpoints
    path('result/', views.save_result, name='save-result'),
    path('my-results/', views.user_results, name='user-results'),
]
