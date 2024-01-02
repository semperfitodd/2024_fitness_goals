import boto3
import os
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Get DynamoDB table name from environment variable
    table_name = os.environ['DYNAMO_TABLE']

    # Initialize a DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    # Define the exercise types
    exercise_types = ["Pullup", "Pushup", "Squat"]

    # Function to scan the table and sum the counts for an exercise type
    def sum_counts(exercise_type):
        try:
            response = table.scan(
                FilterExpression=boto3.dynamodb.conditions.Attr('ExerciseType').eq(exercise_type)
            )
            items = response.get('Items', [])
            total = sum(int(item['Count']) for item in items)
            return total
        except ClientError as e:
            print(e.response['Error']['Message'])
            return 0

    # Sum the totals for each exercise type
    totals = {exercise: sum_counts(exercise) for exercise in exercise_types}

    return {
        'statusCode': 200,
        'body': totals
    }
