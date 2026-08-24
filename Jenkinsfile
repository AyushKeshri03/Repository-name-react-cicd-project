pipeline {
    agent any

    tools {
        jdk 'JDK25'
    }

    environment {
        IMAGE_NAME = 'react-cicd-project'
        JAVA_HOME = 'C:\\Users\\keshr\\AppData\\Local\\Programs\\Eclipse Adoptium\\jdk-25.0.4.101-hotspot'
        PATH = "${JAVA_HOME}\\bin;${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Check Java') {
            steps {
                bat '''
                    echo ========================================
                    echo Checking Java installation...
                    echo ========================================

                    echo JAVA_HOME = %JAVA_HOME%
                    java -version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    npm ci
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner'

                    withSonarQubeEnv('SonarQube') {
                        bat """
                            "${scannerHome}\\bin\\sonar-scanner.bat" ^
                            -Dsonar.projectKey=react-cicd-project ^
                            -Dsonar.projectName=react-cicd-project ^
                            -Dsonar.sources=src
                        """
                    }
                }
            }
        }

        stage('Build Application') {
            steps {
                bat '''
                    npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                bat '''
                    docker build -t %IMAGE_NAME%:latest .
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                bat '''
                    trivy image --severity HIGH,CRITICAL --exit-code 0 %IMAGE_NAME%:latest
                '''
            }
        }
    }

    post {

        success {
            echo '========================================'
            echo 'CI/CD Pipeline completed successfully!'
            echo 'SonarQube analysis completed.'
            echo 'Application build completed.'
            echo 'Docker image built successfully.'
            echo 'Trivy security scan completed.'
            echo '========================================'
        }

        failure {
            echo '========================================'
            echo 'Pipeline failed! Check the console output.'
            echo '========================================'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}