pipeline {
    agent any
    tools {
        terraform 'terraform'
        nodejs 'node-lts'
    }

    stages {
        stage('dependencies') {
            steps {
                script {
                    withCredentials([file(credentialsId: env.contrast_yaml, variable: 'path')]) {
                        def contents = readFile(env.path)
                        writeFile file: 'contrast_security.yaml', text: "$contents"
                    }
                }
                sh '''
                terraform init -upgrade
                npm init playwright@latest -- --quiet --browser=chromium
                '''
            }
        }
        stage('provision') {
            steps {
                script {
                    withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                        try {
                            sh """
                            export ARM_CLIENT_ID=$AZURE_CLIENT_ID
                            export ARM_CLIENT_SECRET=$AZURE_CLIENT_SECRET
                            export ARM_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
                            export ARM_TENANT_ID=$AZURE_TENANT_ID
                            terraform apply -auto-approve -var 'location=$location' \
                                -var 'initials=$initials' \
                                -var 'environment=qa' \
                                -var 'servername=jenkins' \
                                -var 'session_metadata=branchName=qa,committer=Sanjay,buildNumber=${env.BUILD_NUMBER}'
                            """
                        } catch (Exception e) {
                            echo "Terraform refresh failed, deleting state"
                            sh "rm -rf terraform.tfstate"
                            currentBuild.result = "FAILURE"
                            error("Aborting the build.")
                        }
                    }
                }
            }
        }
        stage('sleeping') {
            steps {
                sleep 120
            }
        }
        stage('exercise - qa') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'ABORTED') {
                    timeout(20) {
                        sh """
                        FQDN=\$(terraform output --raw fqdn)
                        BASEURL=\$FQDN node exercise.js
                        """
                    }
                }
            }
        }
        stage('provision - dev') {
            steps {
                script {
                    withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                        try {
                            sh """
                            export ARM_CLIENT_ID=$AZURE_CLIENT_ID
                            export ARM_CLIENT_SECRET=$AZURE_CLIENT_SECRET
                            export ARM_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
                            export ARM_TENANT_ID=$AZURE_TENANT_ID
                            terraform apply -auto-approve -var 'location=$location' \
                                -var 'initials=$initials' \
                                -var 'environment=development' \
                                -var 'servername=Macbook-Pro' \
                                -var 'session_metadata=branchName=feat: add new exercise for SSRF,committer=Lara,buildNumber=${env.BUILD_NUMBER}'     
                            """
                        } catch (Exception e) {
                            echo "Terraform refresh failed, deleting state"
                            sh "rm -rf terraform.tfstate"
                            currentBuild.result = "FAILURE"
                            error("Aborting the build.")
                        }
                    }
                }
            }
        }
        stage('exercise - dev') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'ABORTED') {
                    timeout(20) {
                        sh """
                        FQDN=\$(terraform output --raw fqdn)
                        BASEURL=\$FQDN node exercise.js
                        """
                    }
                }
            }
        }
        stage('provision - prod') {
            steps {
                script {
                    withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                        try {
                            sh """
                            export ARM_CLIENT_ID=$AZURE_CLIENT_ID
                            export ARM_CLIENT_SECRET=$AZURE_CLIENT_SECRET
                            export ARM_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
                            export ARM_TENANT_ID=$AZURE_TENANT_ID
                            terraform apply -auto-approve -var 'location=$location' -var 'initials=$initials' -var 'environment=production' -var 'servername=Prod-01'
                            """
                        } catch (Exception e) {
                            echo "Terraform refresh failed, deleting state"
                            sh "rm -rf terraform.tfstate"
                            currentBuild.result = "FAILURE"
                            error("Aborting the build.")
                        }
                    }
                }
            }
        }
        stage('exercise - prod') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'ABORTED') {
                    timeout(20) {
                        sh """
                        FQDN=\$(terraform output --raw fqdn)
                        BASEURL=\$FQDN node exercise.js
                        """
                    }
                }
            }
        }
        stage('destroy') {
            steps {
                withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                    sh """
                    export ARM_CLIENT_ID=\$AZURE_CLIENT_ID
                    export ARM_CLIENT_SECRET=\$AZURE_CLIENT_SECRET
                    export ARM_SUBSCRIPTION_ID=\$AZURE_SUBSCRIPTION_ID
                    export ARM_TENANT_ID=\$AZURE_TENANT_ID
                    terraform destroy --auto-approve \
                        -var 'location=$location'
                    """
                }
            }
        }
    }
}
