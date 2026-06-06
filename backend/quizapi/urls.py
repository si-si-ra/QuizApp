from django.urls import path
from . import views

urlpatterns = [
    path('questions/', views.question_list, name='question-list'),
    path('categories/', views.category_list, name='category-list'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
]
