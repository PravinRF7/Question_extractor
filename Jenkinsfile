pipeline {
    agent any

    environment {
        IMAGE_NAME = 'ocr-question-extractor'
        CONTAINER_NAME = 'ocr_app'
        DOCKER_HUB_USERNAME = 'your_dockerhub_username'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/PravinRF7/Question_extractor.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Clean Old Container') {
            steps {
                bat """
                docker stop %CONTAINER_NAME% || exit 0
                docker rm %CONTAINER_NAME% || exit 0
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                bat "docker run -d -p 3000:3000 --name %CONTAINER_NAME% %IMAGE_NAME%"
            }
        }
    }

    post {
        always {
            echo '🚀 Pipeline Completed!'
        }
    }
}
