pipeline {
    agent any

    environment {
        JAVA_HOME = 'C:\\Users\\keshr\\AppData\\Local\\Programs\\Eclipse Adoptium\\jdk-25.0.4.101-hotspot'
        PATH = "${JAVA_HOME}\\bin;${env.PATH}"

        IMAGE_NAME = 'react-cicd-project'
        IMAGE_TAG = 'latest'

        // CHANGE THIS ONLY IF YOUR TRIVY.EXE IS IN A DIFFERENT LOCATION
        TRIVY_PATH = 'C:\\ProgramData\\chocolatey\\bin\\trivy.exe'
    }

    tools {
        nodejs 'NodeJS'
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

                if not exist "%JAVA_HOME%\\bin\\java.exe" (
                    echo ERROR: Java executable not found!
                    exit /b 1
                )

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
                    def scannerHome = tool 'SonarQube_Scanner'

                    withSonarQubeEnv('SonarQube') {
                        bat """
                        "${scannerHome}\\bin\\sonar-scanner.bat" ^
                        -Dsonar.projectKey=react-cicd-project ^
                        -Dsonar.projectName=react-cicd-project ^
                        -Dsonar.sources=src ^
                        -Dsonar.sourceEncoding=UTF-8 ^
                        -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.svg
                        """
                    }
                }
            }
        }

        stage('Build Application') {
            steps {
                bat '''
                echo ========================================
                echo Building React application...
                echo ========================================

                npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                bat '''
                echo ========================================
                echo Building Docker image...
                echo ========================================

                docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                bat '''
                echo ========================================
                echo Checking Trivy installation...
                echo ========================================

                if not exist "%TRIVY_PATH%" (
                    echo ERROR: Trivy executable not found at:
                    echo %TRIVY_PATH%
                    echo.
                    echo Please update TRIVY_PATH in Jenkinsfile.
                    exit /b 1
                )

                "%TRIVY_PATH%" --version

                echo ========================================
                echo Scanning Docker image for vulnerabilities...
                echo ========================================

                "%TRIVY_PATH%" image --severity HIGH,CRITICAL --exit-code 0 %IMAGE_NAME%:%IMAGE_TAG%
                '''
            }
        }
    }

    post {

        success {
            echo '========================================'
            echo 'CI/CD PIPELINE COMPLETED SUCCESSFULLY!'
            echo '========================================'
            echo 'Source code checked out successfully.'
            echo 'Dependencies installed successfully.'
            echo 'SonarQube analysis completed successfully.'
            echo 'React application built successfully.'
            echo 'Docker image built successfully.'
            echo 'Trivy security scan completed successfully.'
        }

        failure {
            echo '========================================'
            echo 'PIPELINE FAILED!'
            echo 'Check the Jenkins console output.'
            echo '========================================'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}