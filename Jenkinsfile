pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    environment {
        IMAGE_NAME = 'cesarbotas/colinhodaca-frontend'
        VERSION = "1.0.${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Código fonte baixado ✅'
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                docker build -t ${IMAGE_NAME}:${VERSION} .
                docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
                """
                echo "Imagem criada: ${VERSION} ✅"
            }
        }
        
        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    docker push ${IMAGE_NAME}:${VERSION}
                    docker push ${IMAGE_NAME}:latest
                    """
                }
                echo 'Imagem enviada ao Docker Hub 🚀'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finalizado'
            sh 'docker system prune -f || true'
        }
        success {
            echo '🚀 Pipeline executado com sucesso!'
        }
        failure {
            echo '❌ Falha no pipeline'
        }
    }
}