push-container-staging:
	heroku container:push web --app sipstir-api-staging --recursive

push-container-production:
	heroku container:push web --app sipstir-api-prod --recursive

release-container-staging:
	heroku container:release web --app sipstir-api-staging

release-container-prod:
	heroku container:release web --app sipstir-api-prod

logs-staging:
	heroku logs --tail --app sipstir-api-staging

logs-prod:
	heroku logs --tail --app sipstir-api-prod

staging: push-container-staging release-container-staging

prod: push-container-prod release-container-prod
