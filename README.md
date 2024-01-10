# 2024 Fitness Goals Tracker
## Overview
The 2024 Fitness Goals Tracker is a personal project to track my fitness goals for the year 2024, which include completing 25,000 pullups, 50,000 pushups, 40,000 squats, and 1,200 HSPU without missing a day. This repository contains all the necessary code and infrastructure setup for tracking these fitness activities.

The system architecture is built using Terraform for infrastructure provisioning. It includes a React frontend hosted on AWS S3 and CloudFront, with a backend API built using AWS Lambda and API Gateway, interfacing with a DynamoDB database.
![2024_fitness_goals_architecture.png](images%2F2024_fitness_goals_architecture.png)
**Flow:** User (me) > CloudFront/S3 > API Gateway > Lambda > DynamoDB > back to me


## Repository Structure
2024_fitness_goals
```bash
2024_fitness_goals
├── scripts
│   └── today.sh         # Shell script to view today's records
├── terraform
│   ├── *.tf             # Terraform configuration files
│   └── static-site
│       ├── src
│       │   ├── InsertForm.js  # New React component for inserting records
│       │   └── ...            # Other React application files
│       └── ...
└── totals
    ├── requirements.txt
    └── totals.py    # Python script for Lambda function
```
## Features
**Daily Tracking:** Ability to track daily pull-ups, push-ups, and squats.

**React Frontend:** A user-friendly interface to display progress.

**Data Persistence:** Using DynamoDB to store daily records.

**Automated Infrastructure:** Entire setup provisioned using Terraform.
## Setup and Installation
Prerequisites
AWS CLI configured with appropriate permissions.
Terraform installed.
Node.js and npm for running the React application.
## Step-by-Step Guide
### 1. Clone the Repository

    git clone https://github.com/semperfitodd/2024_fitness_goals.git
    cd 2024_fitness_goals
### 2. Provision Infrastructure using Terraform

    cd terraform
    terraform init
    terraform apply

### 3. Deploy React Frontend

* Navigate to the static-site directory.
* Install dependencies and build the project.

    ```bash
    npm install
    npm run build
    ```
* Deploy the build to S3 (configured via Terraform).
### 4. Insert and View Data

Use the insert feature at the bottom of the application
![insert.png](images%2Finsert.png)

  ![website.png](images%2Fwebsite.png)