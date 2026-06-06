from django.contrib import admin
from .models import Question, Category, LeaderboardEntry, QuizResult


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'question', 'category', 'difficulty', 'correct_answer']
    list_filter = ['category', 'difficulty']
    search_fields = ['question']


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ['name', 'score', 'total', 'category', 'difficulty', 'created_at']


@admin.register(QuizResult)
class QuizResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'score', 'total_questions', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['user__username']
