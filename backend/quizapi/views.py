import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView
from .models import Question, Category, LeaderboardEntry, QuizResult
from .serializers import (
    QuestionSerializer,
    CategorySerializer,
    LeaderboardEntrySerializer,
    RegisterSerializer,
    QuizResultSerializer,
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def question_list(request):
    """
    GET /api/questions/
    Optional query params:
      - category (id)
      - difficulty (easy | medium | hard)
      - shuffle (true)
    """
    queryset = Question.objects.all()

    category = request.query_params.get('category')
    difficulty = request.query_params.get('difficulty')
    shuffle = request.query_params.get('shuffle', 'false').lower() == 'true'

    if category:
        queryset = queryset.filter(category__id=category)
    if difficulty:
        queryset = queryset.filter(difficulty=difficulty)

    questions = list(queryset)
    if shuffle:
        random.shuffle(questions)

    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def category_list(request):
    """GET /api/categories/"""
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def leaderboard(request):
    """
    GET  /api/leaderboard/  — top 10 entries
    POST /api/leaderboard/  — submit a new entry
    """
    if request.method == 'GET':
        entries = LeaderboardEntry.objects.all()[:10]
        serializer = LeaderboardEntrySerializer(entries, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = LeaderboardEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(CreateAPIView):
    """
    POST /api/register/ — register a new user
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_result(request):
    """
    POST /api/result/ — save quiz result for authenticated user
    """
    serializer = QuizResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_results(request):
    """
    GET /api/my-results/ — get all quiz results for authenticated user
    """
    results = QuizResult.objects.filter(user=request.user)
    serializer = QuizResultSerializer(results, many=True)
    return Response(serializer.data)
