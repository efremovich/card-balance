docker-build:
	@docker build . -t my-app
docker-run:
	@docker run -d -p 443:443 my-app

