docker-build:
	@docker build . -t my-app
docker-run:
	@docker run -d -p 8080:80 my-app

