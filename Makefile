docker-build:
	@docker build . -t my-app
docker-run:
	@docker run -d -p 80:80 my-app

