from rest_framework import serializers
from .models import Question, Category, LeaderboardEntry


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name', read_only=True
    )

    class Meta:
        model = Question
        fields = [
            'id', 'category', 'category_name',
            'difficulty', 'question',
            'option1', 'option2', 'option3', 'option4',
            'correct_answer',
        ]


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = '__all__'
