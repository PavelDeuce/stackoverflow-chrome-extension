install:
	npm install

lint:
	npx eslint .
	npx stylelint ./src/styles/*.css
	npx htmlhint ./src/*.html
