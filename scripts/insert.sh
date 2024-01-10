#!/bin/bash

# Table name
TABLE_NAME="2024_fitness_daily"

# Get the current date in YYYY-MM-DD format
DEFAULT_DATE=$(date +%F)

# AWS Region being used
AWS_REGION=us-east-1

# Ask user for the date or use today's date by default
read -p "Enter date (YYYY-MM-DD) or press Enter for today's date [$DEFAULT_DATE]: " input_date
TODAY=${input_date:-$DEFAULT_DATE}

# Ask user for the number of pullups, pushups, squats, and HSPUs
read -p "Enter number of pullups: " pullups
read -p "Enter number of pushups: " pushups
read -p "Enter number of squats: " squats
read -p "Enter number of HSPUs: " hspus  # Added prompt for HSPUs

# Function to insert an item into the DynamoDB table
insert_exercise() {
    local exercise_type=$1
    local count=$2

    aws dynamodb put-item \
        --table-name "$TABLE_NAME" \
        --region $AWS_REGION \
        --item '{
            "Date": {"S": "'"$TODAY"'"},
            "ExerciseType": {"S": "'"$exercise_type"'"},
            "Count": {"N": "'"$count"'"}
        }'
}

# Insert data into DynamoDB
insert_exercise "Pullup" $pullups
insert_exercise "Pushup" $pushups
insert_exercise "Squat" $squats
insert_exercise "HSPU" $hspus  # Inserting HSPU data

echo "Data inserted into DynamoDB for $TODAY"
