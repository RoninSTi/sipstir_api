push-container-staging:
	heroku container:push web --app pure-temple-78419 --recursive

push-container-production:
	heroku container:push web --app barsnap-api-prod --recursive

release-container-staging:
	heroku container:release web --app pure-temple-78419

release-container-prod:
	heroku container:release web --app barsnap-api-prod

logs-staging:
	heroku logs --tail --app pure-temple-78419

logs-prod:
	heroku logs --tail --app barsnap-api-prod

staging: push-container-staging release-container-staging

prod: push-container-prod release-container-prod
