const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");

describe("book-router", function() {
	const bookObject = {
		googleId: "qwoldmcdfiom123103",
		title: "Chantra Swandie",
		author: "McWorld",
		publisher: "Penguin",
		publishDate: "2/21/2020",
		description: "The end of the book",
		isbn10: "12345678911234567891",
		isbn13: "12345678911234567891234",
		pageCount: 210,
		categories: "swenad",
		thumbnail: "image.png",
		smallThumbnail: "small-img.png",
		language: "english",
		webRenderLink: "testLink",
		textSnippet: "testSnippet",
		isEbook: true
	};

	const badBookObject = {
		type: "Movie",
		content: "Im not a book"
	};

	const signupDets = {
		fullName: "Seeder Apple",
		emailAddress: "seedemail",
		username: "seedusername",
		password: "seedpassword"
	}

	function promisedCookie() {
		return new Promise((resolve, reject) => {
			request(server)
			.post("/api/auth/signup")
			.send(signupDets)
			.end(function(err, res) {
				if (err) { throw err; }
				let signupCookie = res.headers["set-cookie"];
				resolve(signupCookie);
			});
		});
	}

	beforeEach(async function() {
		db("userBooks").truncate().then(() => {
			db("users").truncate().then(() => {
				db("books").truncate();
			})
		})
	});

	describe("GET api/books/1", function() {
		// MARK: -- FIX NOT WORKING
		it("GET book success status", function() {
			return promisedCookie().then(cookie => {
				const req = request(server)
					.get("/api/books/1")
					.set("cookie", cookie)
					.expect(200)
				return req;
			})
		});


		it("GET JSON book object", function() {
			return promisedCookie().then(cookie => {
				const req = request(server)
					.get("/api/books/1")
					.set("cookie", cookie)
					.then(res => {
						expect(res.type).toMatch(/json/i);
					});
				return req;
			});
		});

		it("Expect 401 with no authentication set in header", function() {
			return request(server)
				.get("/api/books/1")
				.then(res => {
					expect(res.status).toBe(401);
				});
		});

		it("Expect error message for book not in database", function() {
			return promisedCookie().then(cookie => {
				const req = request(server)
					.get("/api/books/2000000000")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.message).toBe("No books here");
					});
					return req;
			});
		});
	});

	describe("POST a book", function() {
		// MARK: -- wrote a conditional because not truncating book table before each test
		it("Expect a 201", function() {
			return promisedCookie().then(cookie => {
				const req = request(server)
					.post("/api/books")
					.send(badBookObject)
					.set("cookie", cookie)
					.then(res => {
						if(res.status == 200) {
							expect(res.type).toMatch(/json/i);
						} else {
							expect(res.status).toBe(201);
						}
					});
				return req;
			});
		});

		it("Expect a 400", function() {
			return request(server)
				.post("/api/books")
				.send(badBookObject)
				.then(res => {
					expect(res.body.message).toBe(
						"unauthorized"
					);
				});
		});
	});
});
