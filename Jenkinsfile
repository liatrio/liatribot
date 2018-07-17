#!groovy
pipeline {
  agent {
    docker {
      image 'node:alpine'
      args '-u 0:0'
    }
  }
  environment {
    // https://jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials
    SLACK_VERIFICATION_TOKEN = credentials('liatribot-slack-verification-token')
    SLACK_CLIENT_ID = credentials('liatribot-slack-client-id')
    SLACK_CLIENT_SECRET = credentials('liatribot-slack-client-secret')
    AWS_ACCESS_KEY_ID = credentials('shanem-aws-secret-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('shanem-aws-secret-access-key')
    DARKSKY_SECRET = credentials('shanem-darksky-secret')
  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        echo "testing"
        //sh 'npm test'
      }
    }
    stage('Deploy') {
      steps {
        // latest version breaks env vars that are not strings, revert back
        sh 'npm install -g serverless@1.27.3'
        sh 'serverless deploy'
      }
    }
    stage('Destroy') {
      steps {
        echo "not destroying"
        //serverless remove
      }
    }
  }
}
