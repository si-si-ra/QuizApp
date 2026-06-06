from rest_framework import serializers
from .models import Question, Category, LeaderboardEntry, QuizResult
from django.contrib.auth.models import User


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


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class QuizResultSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username', read_only=True
    )
    category_name = serializers.CharField(
        source='category.name', read_only=True, allow_null=True
    )

    class Meta:
        model = QuizResult
        fields = [
            'id', 'user', 'username', 'score', 'total_questions',
            'category', 'category_name', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'username', 'category_name', 'created_at']
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'score': {'required': True},
            'total_questions': {'required': True},
        }
