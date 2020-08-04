push-container:
	heroku container:push web

release-container:
	heroku container:release web

staging: push-container release-container

production: load-dependencies bundle-prod sync-prod
