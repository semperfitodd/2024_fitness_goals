import boto3
import json
import os
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    # Parse the input data from the event
    try:
        data = json.loads(event['body'])
    except (TypeError, json.JSONDecodeError) as error:
        return respond_with_error(400, "Invalid input format")

    try:
        date = data['date']
        pullups = int(data['pullups'])
        pushups = int(data['pushups'])
        squats = int(data['squats'])
        hspu = int(data['hspu'])
    except (ValueError, KeyError) as error:
        return respond_with_error(400, "Invalid data")

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DYNAMO_TABLE'])

    def insert_exercise(exercise_type, count):
        try:
            table.put_item(
                Item={
                    'Date': date,
                    'ExerciseType': exercise_type,
                    'Count': count
                }
            )
        except ClientError as e:
            print(e.response['Error']['Message'])
            return False
        return True

    success = all([
        insert_exercise("Pullup", pullups),
        insert_exercise("Pushup", pushups),
        insert_exercise("Squat", squats),
        insert_exercise("HSPU", hspu)
    ])

    if success:
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Data inserted into DynamoDB for ' + date}),
            'headers': get_cors_headers()
        }
    else:
        return respond_with_error(500, "Error inserting data")


def get_cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    }


def respond_with_error(status_code, message):
    return {
        'statusCode': status_code,
        'body': json.dumps({'error': message}),
        'headers': get_cors_headers()
    }
