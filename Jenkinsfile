pipeline {
    agent any

    environment {
        JAVA_HOME = 'C:\\Users\\keshr\\AppData\\Local\\Programs\\Eclipse Adoptium\\jdk-25.0.4.101-hotspot'

        IMAGE_NAME = 'react-cicd-project'
        IMAGE_TAG = 'latest'

        TRIVY_PATH = 'C:\\Users\\keshr\\AppData\\Local\\Microsoft\\WinGet\\Packages\\AquaSecurity.Trivy_Microsoft.Winget.Source_8wekyb3d8bbwe\\trivy.exe'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Check Java and Node') {
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

                "%JAVA_HOME%\\bin\\java.exe" -version

                echo.
                echo ========================================
                echo Checking Node.js installation...
                echo ========================================

                node --version
                npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                echo Installing project dependencies...
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

        stage('Check Trivy') {
            steps {
                bat '''
                echo ========================================
                echo Checking Trivy installation...
                echo ========================================

                if not exist "%TRIVY_PATH%" (
                    echo ERROR: Trivy executable was not found.
                    echo Expected location:
                    echo %TRIVY_PATH%
                    exit /b 1
                )

                "%TRIVY_PATH%" --version
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                bat '''
                echo ========================================
                echo Scanning Docker image...
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
            echo 'Checkout completed.'
            echo 'Java and Node.js verified.'
            echo 'Dependencies installed.'
            echo 'SonarQube analysis completed.'
            echo 'React application built.'
            echo 'Docker image built.'
            echo 'Trivy security scan completed.'
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