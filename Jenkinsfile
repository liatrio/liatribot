#!groovy
pipeline {
  agent {
    docker {
      image 'node:alpine'
      args '-u 0:0'
    }
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
        echo "deploy"
      }
    }
  }
}
