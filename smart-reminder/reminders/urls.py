from django.urls import path
from .views import ReminderListCreateView, ReminderDetailView, get_notifications

urlpatterns = [
    path('', ReminderListCreateView.as_view()),
    path('<int:pk>/', ReminderDetailView.as_view()),
    path('notifications/', get_notifications),
]

# from django.urls import path
# from .views import ReminderListCreateView, ReminderDetailView

# urlpatterns = [
#     path('', ReminderListCreateView.as_view(), name='reminder-list-create'),
#     path('<int:pk>/', ReminderDetailView.as_view(), name='reminder-detail'),
# ]