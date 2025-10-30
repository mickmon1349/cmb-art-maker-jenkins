pipeline {
    agent any

    environment {
        PROJECT_ID = "callme-op-419108"
        REGION = "asia-east1"
        REPO = "mickmon-repo"
        IMAGE_NAME = "callmeback-art-maker"
        SERVICE_NAME = "cmb-a4qrcodecard"
        DOCKER_IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE_NAME}:latest"
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-sa-json') // Jenkins憑證ID
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    submoduleCfg: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/mickmon1349/cmb-art-maker-jenkins.git',
                        credentialsId: ''  // 若 private repo 請填 credentialsId，public repo可不填
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
            post {
                success {
                    echo '✅ 所有測試通過！'
                }
                failure {
                    echo '❌ 測試失敗，停止 Pipeline！'
                    error('Tests failed. See logs above.')
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building Vite frontend...'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Login GCP Artifact Registry') {
            steps {
                echo 'Authenticating with Google Cloud...'
                sh "gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}"
                sh "gcloud auth configure-docker ${REGION}-docker.pkg.dev"
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing image to Artifact Registry...'
                sh "docker push ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                echo 'Deploying to Cloud Run...'
                sh """
                    gcloud run deploy ${SERVICE_NAME} \
                        --image ${DOCKER_IMAGE} \
                        --platform managed \
                        --region ${REGION} \
                        --allow-unauthenticated \
                        --ingress all
                """
            }
        }
    }

    post {
        success {
            echo '✅ 部署完成，Cloud Run 已成功更新版本！'
        }
        failure {
            echo '❌ Pipeline 執行失敗，請檢查日誌！'
        }
    }
}
