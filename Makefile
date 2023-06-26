docker-build:
	@docker build . -t my-app
docker-run:
	@docker run -d -p 8181:80 my-app

