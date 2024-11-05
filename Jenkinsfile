pipeline {
    agent any
    environment {
        DOCKER_REPO = "ghcr.io/animal-squad/project-s-be"
        GIT_BRANCH = "${env.BRANCH_NAME}"
        GIT_COMMIT_SHORT = ''
        GIT_COMMIT_MESSAGE = ''
        DEPLOYMENT_NAMESPACE = "${params.DEPLOYMENT_NAMESPACE}"
        DEPLOYMENT_NAME = "${params.DEPLOYMENT_NAME}"
        DEPLOYMENT_CONTAINER_NAME = "${params.DEPLOYMENT_CONTAINER_NAME}"
        KANIKO_POD_YAML = '/var/jenkins_home/kaniko/job-kaniko-backend.yaml' // Kaniko Pod YAML 파일 경로
        KANIKO_POD_NAME = 'kaniko-backend' // 값 설정할 부분
        JENKINS_NAMESPACE = 'devops' // Kaniko Pod를 실행할 네임스페이스
    }
    parameters {
        string(name: 'DEPLOYMENT_NAMESPACE', defaultValue: 'service', description: '배포할 Kubernetes 네임스페이스') // 설정
        string(name: 'DEPLOYMENT_NAME', defaultValue: 'backend-deployment', description: '배포할 Deployment 이름') // 설정  
        string(name: 'DEPLOYMENT_CONTAINER_NAME', defaultValue: 'backend-container', description: 'Deployment 내 컨테이너 이름') // 설
    }
    stages {ß
        stage('Checkout Source Code') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.GIT_COMMIT_MESSAGE = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    echo "Current Git Commit Short: ${env.GIT_COMMIT_SHORT}"
                    echo "Git Commit Message: ${env.GIT_COMMIT_MESSAGE}"
                }
            }
        // stage('Unit Tests') {
        //     steps {
        //         sh 'make test' // 유닛 테스트 실행 stage 현재 없음
        //     }
        // }
        stage('Update Kaniko YAML') {
            steps {
                script {
                    // Kaniko YAML 파일에서 이미지 태그 업데이트
                    sh """
                    sed -i 's|--destination=.*|--destination=${DOCKER_REPO}:${GIT_COMMIT_SHORT}",|' ${KANIKO_POD_YAML}
                    """
                }
            }
        }
        stage('Deploy Kaniko Pod') {
            steps {
                script {
                    // 기존 Kaniko Pod 삭제 후 새로운 Kaniko Pod 배포
                    sh """
                    kubectl delete job ${KANIKO_POD_NAME} -n ${JENKINS_NAMESPACE} --ignore-not-found
                    kubectl create -f ${KANIKO_POD_YAML} -n ${JENKINS_NAMESPACE}
                    """
                }
            }
        }
        stage('Wait for Kaniko Build') {
            steps {
                script {
                    // Kaniko Pod가 완료될 때까지 대기
                    timeout(time: 15, unit: 'MINUTES') {
                        waitUntil {
                            def status = sh(script: "kubectl get pod ${KANIKO_POD_NAME} -n ${JENKINS_NAMESPACE} -o jsonpath='{.status.phase}'", returnStdout: true).trim()
                            echo "Kaniko Pod Status: ${status}"
                            return (status == 'Succeeded') || (status == 'Failed')
                        }
                    }
                    // 최종 상태 확인
                    def finalStatus = sh(script: "kubectl get pod ${KANIKO_POD_NAME} -n ${JENKINS_NAMESPACE} -o jsonpath='{.status.phase}'", returnStdout: true).trim()
                    if (finalStatus != 'Succeeded') {
                        error "Kaniko build failed with status: ${finalStatus}"
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Kubernetes에 이미지 배포
                    sh """
                    kubectl set image deployment/${DEPLOYMENT_NAME} \
                    -n ${DEPLOYMENT_NAMESPACE} ${DEPLOYMENT_CONTAINER_NAME}=${DOCKER_REPO}:${GIT_COMMIT_SHORT}
                    kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${DEPLOYMENT_NAMESPACE}
                    """
                }
            }
        }
    }
    post {
        always {
            script {
                currentBuild.result = currentBuild.result ?: 'SUCCESS'
            }
            echo "Build Result: ${currentBuild.result}"
            withCredentials([string(credentialsId: 'Discord-Webhook', variable: 'DISCORD')]) {
                discordSend title: "빌드 결과: ${env.JOB_NAME}",
                            description: """
                            **커밋 메시지**: `${env.GIT_COMMIT_MESSAGE}`
                            **커밋 ID**: `${env.GIT_COMMIT_SHORT}`
                            **빌드 번호**: `#${env.BUILD_NUMBER}`
                            **상태**: ${currentBuild.result == 'SUCCESS' ? '🟢 **성공**' : '❌ **실패**'}
                            """,
                            webhookURL: DISCORD
            }
        }
    }
}
