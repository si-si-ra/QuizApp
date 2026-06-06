"""
Run this to populate sample data:
    python seed_data.py
Make sure you run it from the backend/ folder with the venv active.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quizproject.settings')
django.setup()

from quizapi.models import Category, Question

# Clear existing
Question.objects.all().delete()
Category.objects.all().delete()

# Categories
python_cat  = Category.objects.create(name="Python")
react_cat   = Category.objects.create(name="React")
general_cat = Category.objects.create(name="General Programming")

# Python – Easy
Question.objects.create(
    category=python_cat, difficulty='easy',
    question="What is Python?",
    option1="Snake", option2="Programming Language",
    option3="Game", option4="Movie",
    correct_answer="Programming Language"
)
Question.objects.create(
    category=python_cat, difficulty='easy',
    question="Which keyword defines a function in Python?",
    option1="function", option2="define",
    option3="def", option4="func",
    correct_answer="def"
)
Question.objects.create(
    category=python_cat, difficulty='easy',
    question="What does len() do?",
    option1="Returns max value", option2="Returns length of an object",
    option3="Deletes a list", option4="Sorts a list",
    correct_answer="Returns length of an object"
)

# Python – Medium
Question.objects.create(
    category=python_cat, difficulty='medium',
    question="What is a decorator in Python?",
    option1="A design pattern", option2="A function that wraps another function",
    option3="A class method", option4="A type hint",
    correct_answer="A function that wraps another function"
)
Question.objects.create(
    category=python_cat, difficulty='medium',
    question="What does *args allow in a function?",
    option1="Keyword arguments only", option2="No arguments",
    option3="Variable number of positional arguments", option4="Named arguments only",
    correct_answer="Variable number of positional arguments"
)

# Python – Hard
Question.objects.create(
    category=python_cat, difficulty='hard',
    question="What is the output of: list(map(lambda x: x**2, range(4)))?",
    option1="[1, 4, 9, 16]", option2="[0, 1, 4, 9]",
    option3="[0, 1, 2, 3]", option4="[1, 2, 3, 4]",
    correct_answer="[0, 1, 4, 9]"
)
Question.objects.create(
    category=python_cat, difficulty='hard',
    question="What is the MRO in Python?",
    option1="Method Resolution Order", option2="Memory Read Operation",
    option3="Module Runtime Object", option4="Multiple Return Output",
    correct_answer="Method Resolution Order"
)

# React – Easy
Question.objects.create(
    category=react_cat, difficulty='easy',
    question="React is developed by?",
    option1="Google", option2="Microsoft",
    option3="Meta", option4="Amazon",
    correct_answer="Meta"
)
Question.objects.create(
    category=react_cat, difficulty='easy',
    question="What is JSX?",
    option1="A JavaScript framework", option2="A database query language",
    option3="A syntax extension for JavaScript", option4="A CSS preprocessor",
    correct_answer="A syntax extension for JavaScript"
)

# React – Medium
Question.objects.create(
    category=react_cat, difficulty='medium',
    question="Which hook is used to manage state in a functional component?",
    option1="useEffect", option2="useContext",
    option3="useState", option4="useRef",
    correct_answer="useState"
)
Question.objects.create(
    category=react_cat, difficulty='medium',
    question="What does useEffect with an empty dependency array do?",
    option1="Runs on every render", option2="Runs only once after mount",
    option3="Runs before unmount only", option4="Never runs",
    correct_answer="Runs only once after mount"
)

# General – Easy
Question.objects.create(
    category=general_cat, difficulty='easy',
    question="What does HTTP stand for?",
    option1="HyperText Transfer Protocol", option2="High Transfer Text Protocol",
    option3="Hyperlink Text Tool Protocol", option4="Home Text Transport Protocol",
    correct_answer="HyperText Transfer Protocol"
)
Question.objects.create(
    category=general_cat, difficulty='easy',
    question="What does CSS stand for?",
    option1="Computer Style Sheets", option2="Cascading Style Sheets",
    option3="Creative Style System", option4="Colorful Style Syntax",
    correct_answer="Cascading Style Sheets"
)
Question.objects.create(
    category=general_cat, difficulty='medium',
    question="What is a REST API?",
    option1="A database system", option2="A type of frontend framework",
    option3="An architectural style for networked applications", option4="A Python package manager",
    correct_answer="An architectural style for networked applications"
)

print(f"✅ Seeded {Question.objects.count()} questions across {Category.objects.count()} categories.")
