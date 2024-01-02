#!/bin/bash

# Table name
TABLE_NAME="2024_fitness"

# Get the current date in YYYY-MM-DD format
TODAY=$(date +%F)

# AWS Region being used
AWS_REGION=us-east-1

# Print the current date as the title
echo "Fitness Data for $TODAY"
echo "-------------------"


# Function to get an item from the DynamoDB table
aws dynamodb query \
    --table-name "$TABLE_NAME" \
    --region $AWS_REGION \
    --key-condition-expression "#D = :dateval" \
    --expression-attribute-names '{"#D":"Date"}' \
    --expression-attribute-values  '{":dateval":{"S":"'"$TODAY"'"}}' \
    --query "Items[*].[ExerciseType.S, Count.N]" \
    --output table