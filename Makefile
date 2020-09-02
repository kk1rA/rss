install:
	npm install
lint:
	npx eslint .
build:
	npm run build
webpack:
	npm run webpack -- --mode production
webpack-dev:
	npm run webpack -- --mode development
test:
	npm test
je:
	make lint
	make test