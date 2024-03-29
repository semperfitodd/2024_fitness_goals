import json
import os
from calendar import isleap
from datetime import datetime

import boto3
import pytz
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    # Environment variables
    table_name = os.environ['DYNAMO_TABLE']
    exercise_types = os.environ['EXERCISE_TYPES'].split(',')
    daily_goals = {exercise: int(os.environ[exercise.upper() + '_DAILY_GOAL']) for exercise in exercise_types}
    yearly_goals = {exercise: int(os.environ[exercise.upper() + '_YEAR_GOAL']) for exercise in exercise_types}

    # Calculate current year metrics
    eastern = pytz.timezone('America/New_York')
    current_time_eastern = datetime.now(eastern)
    current_year = current_time_eastern.year
    year_days = 366 if isleap(current_year) else 365
    current_day_of_year = current_time_eastern.timetuple().tm_yday
    current_date = current_time_eastern.strftime('%Y-%m-%d')
    percent_year_complete = round(current_day_of_year / year_days * 100, 2)

    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    # Function to scan table and calculate totals
    def calculate_totals():
        try:
            response = table.scan()
            items = response.get('Items', [])
            totals = {exercise: 0 for exercise in exercise_types}
            days_data = {}
            daily_counts = {exercise: [] for exercise in exercise_types}  # Initialize daily counts
            cumulative_counts = {exercise: 0 for exercise in exercise_types}  # Initialize cumulative counts

            for item in items:
                exercise = item['ExerciseType']
                count = int(item['Count'])
                totals[exercise] += count
                date = item['Date']
                if date not in days_data:
                    days_data[date] = {ex: 0 for ex in exercise_types}
                days_data[date][exercise] += count

            # Populate daily counts and calculate cumulative counts
            for date in sorted(days_data.keys()):
                for exercise in exercise_types:
                    cumulative_counts[exercise] += days_data[date].get(exercise, 0)
                    daily_counts[exercise].append(cumulative_counts[exercise])

            # Calculate days missed
            days_missed = {
                exercise: sum(
                    1 for date, counts in days_data.items()
                    if counts.get(exercise, 0) < daily_goals[exercise] and date != current_date
                )
                for exercise in exercise_types
            }

            return totals, days_missed, daily_counts
        except ClientError as e:
            print(e.response['Error']['Message'])
            return {}, {}, {}

    totals, days_missed, daily_counts = calculate_totals()

    # Construct the results
    results = {
        'Current Day of Year': current_day_of_year,
        'Percent Year Complete': percent_year_complete,
        'Exercises': {
            exercise: {
                'Total': totals[exercise],
                'Remaining': yearly_goals[exercise] - totals[exercise],
                'Days Missed': days_missed[exercise],
                'Ahead of Schedule': round((totals[exercise] / yearly_goals[exercise] * 100) - percent_year_complete,
                                           2),
                'Percent Exercise Complete': round((totals[exercise] / yearly_goals[exercise]) * 100, 2),
                'Average per Day': round(totals[exercise] / current_day_of_year, 2),
                'Projected Total': round((totals[exercise] / current_day_of_year) * year_days, 2),
                'Yearly Goal': yearly_goals[exercise],
                'Daily Counts': ','.join(map(str, daily_counts[exercise]))
            } for exercise in exercise_types
        }
    }

    return {
        'statusCode': 200,
        'body': json.dumps(results),
        'headers': {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
    }
