install:
	npm install
lint:
	npx eslint .
build:
	rm -rf dist
	npm run build
publish: webpack
	surge ./dist --domain eem-hexlet-rssreader.surge.sh
webpack:
	rm -rf ./dist
	npm run webpack -- --mode production
webpack-dev:
	npm run webpack -- --mode development
test:
	npm test
je:
	make lint
	make test