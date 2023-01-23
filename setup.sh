minikube start --driver=docker
minikube addons enable ingress

kubectl create ns vfb
eval $(minikube docker-env)

harness-deployment cloud-harness . -n vfb --domain vfb.local -i pub-chem-index -e local -dtls -u 
eval $(ssh-agent)
skaffold dev