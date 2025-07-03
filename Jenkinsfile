pipeline {
    agent any

    environment {
        IMAGE_NAME = 'ocr-question-extractor'
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
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME ."
            }
        }

        stage('Run Docker Container') {
            steps {
                sh "docker run -d -p 3000:3000 --name ocr_app $IMAGE_NAME"
            }
        }
    }

    post {
        always {
            echo '🚀 Pipeline Completed!'
        }
    }
}
