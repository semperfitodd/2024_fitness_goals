import boto3
import json
import os
import pytz
from botocore.exceptions import ClientError
from calendar import isleap
from datetime import datetime

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

            for item in items:
                exercise = item['ExerciseType']
                count = int(item['Count'])
                totals[exercise] += count
                date = item['Date']
                if date not in days_data:
                    days_data[date] = {ex: 0 for ex in exercise_types}
                days_data[date][exercise] += count

            # Sort days and populate daily counts
            for date in sorted(days_data.keys()):
                for exercise in exercise_types:
                    daily_counts[exercise].append(days_data[date].get(exercise, 0))  # Append count or 0 if no data

            # Calculate days missed
            days_missed = {
                exercise: sum(1 for counts in days_data.values() if counts.get(exercise, 0) < daily_goals[exercise])
                for exercise in exercise_types}

            return totals, days_missed, daily_counts
        except ClientError as e:
            print(e.response['Error']['Message'])
            return {}, {}, {}
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
