const restify = require('restify');
const request = require('request');
const rp = require('request-promise');
const nunjucks = require('nunjucks');

const server = restify.createServer();
const serverURL = 'https://aqueous-earth-28377.herokuapp.com/';

server.use(restify.plugins.bodyParser());

nunjucks.configure('templates', {autoescape: true});

server.get('/', (req, res) => {
	var body = nunjucks.render('index.html');
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		res.write(body);
		res.end();
	});


server.get('/person/:id', (req, res) => {
	var person;
	rp(serverURL + 'person/' + req.params.id).then((body) => {
		person = JSON.parse(body);
		console.log(person);

		var body = nunjucks.render('person.html', {person : person.person});
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		res.write(body);
		res.end();
	}).catch((err) => {
		console.log(err);
	});
});

server.get('/person', (req, res) => {
	var persons;
	rp(serverURL + 'person/').then((body) => {
		persons = JSON.parse(body);
		console.log(persons);

		var body = nunjucks.render('persons.html', {persons: persons});
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		res.write(body);
		res.end();
	}).catch((err) => {
		console.log(err);
	});
});

server.get('/feelingLucky', (req, res) => {
	rp(serverURL + 'person/').then((body) => {
		var persons = JSON.parse(body);
		var person = persons[Math.floor((Math.random() * persons.length) + 1)]
		console.log(person);
		
		var body = nunjucks.render('person.html', {person : person});
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/html'
		});
		res.write(body);
		res.end();

	}).catch((err) => {
		console.log(err);
	});
})

server.listen(8080, () => {
	console.log(`${server.name} listening at ${server.url}`);
});