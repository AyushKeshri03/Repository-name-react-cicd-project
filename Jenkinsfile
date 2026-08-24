pipeline {
    agent any

    tools {
        // This name must exactly match the JDK name in Jenkins:
        // Manage Jenkins -> Tools -> JDK installations
        jdk 'JDK25'
    }

    environment {
        IMAGE_NAME = 'react-cicd-project'
        IMAGE_TAG = 'latest'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
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
                    def scannerHome = tool(
                        name: 'SonarQube_Scanner',
                        type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    )

                    withSonarQubeEnv('SonarQube') {
                        bat """
                            echo JAVA_HOME=%JAVA_HOME%
                            java -version

                            "${scannerHome}\\bin\\sonar-scanner.bat" ^
                            -Dsonar.projectKey=react-cicd-project ^
                            -Dsonar.projectName=react-cicd-project ^
                            -Dsonar.sources=src ^
                            -Dsonar.sourceEncoding=UTF-8
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
                    docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                script {
                    def trivyPath = ''

                    // Try to find Trivy from Jenkins' environment
                    def result = bat(
                        script: '@where trivy',
                        returnStatus: true
                    )

                    if (result == 0) {
                        trivyPath = 'trivy'
                    } else {
                        error '''
Trivy was not found by the Jenkins service.

Make sure Trivy is installed and available in the Windows system PATH.
After adding Trivy to PATH, restart the Jenkins service and run the pipeline again.
                        '''
                    }

                    bat """
                        ${trivyPath} image ^
                        --scanners vuln ^
                        --severity HIGH,CRITICAL ^
                        --exit-code 0 ^
                        %IMAGE_NAME%:%IMAGE_TAG%
                    """
                }
            }
        }
    }

    post {
        success {
            echo '========================================'
            echo 'CI/CD Pipeline completed successfully!'
            echo 'SonarQube analysis completed.'
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