// Instantiate all models
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';
var testIdNonManager = 'zj64GsClZ5YYGg4hFmhMZmG4b183';

describe('Products Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

  var guestAgent;

  beforeEach('Create guest agent', function () {
    guestAgent = supertest.agent(app);
  });

	var productWithVariants = {
		title: "T-shirt",
		description: "A rad t-shirt",
		options: {
			size: ['XS', 'SM', 'M', 'L', 'XL'],
			color: ['black', 'blue']
		},
		variants: [
			{
				options: {
					size: 'L',
					color: 'black'
				},
				stock: 10,
				price: "10.00"
			},
			{
				options: {
					size: 'SM',
					color: 'blue'
				},
				stock: 20,
				price: "10.00"
			}
		],
		stock: 10
	}

	describe('GET /', function () {

		beforeEach('create product', function(done){
			Product.create({
				title: 'A new product!',
				description: 'It is just grand!'
			})
			.then(function(){
				done();
			})
			.catch(done);
		})

		it('should get a 200 response', function (done) {
			guestAgent.get('/api/products')
				.expect(200)
				.end(done);
		});

    it('should be an array with all products', function(done){
      guestAgent.get('/api/products')
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        expect(res.body).to.be.a('array');
				expect(res.body).to.have.length(1);
        done();
      })
    })

	});

  describe('POST /new', function(){

    describe('Create new product', function(){

			var basicProduct = {
				title: '75th Anniversary T-shirt',
				description: 'Best t-shirt ever!',
				price: "34.50"
			}

			it('should return 401 status when user is not a manager', function(done){

				this.timeout(4000);

				var body = {
					user_id: testIdNonManager,
					product: basicProduct
				}

				guestAgent.post('/api/products/new')
				.send(body)
				.expect(401)
				.end(function(err, res){
					if(err) return done(err);
					done();
				})
			})

      it('should add to database with valid object', function(done){

				var body = {
					user_id: testId,
					product: basicProduct
				}

        guestAgent.post('/api/products/new')
        .send(body)
				.expect(201)
        .end(function(err, res){
          if(err) return done(err);
          guestAgent.get('/api/products')
          .end(function(err, res){
            expect(res.body.length).to.equal(1);
						expect(res.body[0].price).to.equal('34.50');
            done();
          })
        })
      })

      it('should receive an error if object does not have required property', function(done){

				var body = {
					user_id: testId,
					product: {
						description: "This product is great"
					}
				}

        guestAgent.post('/api/products/new')
        .send(body)
				.expect(500)
        .end(function(err, res){
          expect(res.hasOwnProperty('error')).to.equal(true);
          expect(res.error.text).to.equal('Product validation failed');
          done();
        })
      })

			describe('when variants are specified', function(){

				var body = {
					user_id: testId,
					product: productWithVariants
				}

				it('should populate Variant collection', function(done){
					guestAgent.post('/api/products/new')
					.send(body)
					.expect(201)
					.end(function(err, res){
						if(err) return done(err);
						Variant.where('product_id').equals(res.body._id)
						.exec()
						.then(function(result){
							expect(result).to.have.length(2);
							done();
						})
						.catch(done)
					})
				})

				it('should populate parent product variant array', function(done){
					guestAgent.post('/api/products/new')
					.send(body)
					.expect(201)
					.end(function(err, res){
						if(err) return done(err);
						expect(res.body.variants).to.have.length(2);
						done();
					})
				})
			})
    })
  })

	describe('/:productId route', function(){

		var testProduct;

		beforeEach('create product', function(done){
			guestAgent.post('/api/products/new')
			.send({
				user_id: testId,
				product: productWithVariants
			})
			.end(function(err, res){
				if(err) return done(err);
				testProduct = res.body;
				done();
			})
		})

		describe('GET /:productId', function(){
			it('should return the product with variants populated', function(done){
				guestAgent.get('/api/products/' + testProduct._id)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					expect(res.body.variants[0]).to.have.any.keys('product_id', 'options', 'stock', 'price');
					done();
				})
			})
		})


		describe('PUT /:productId', function(){

			var updateOne = {
				title: 'An even better t-shirt!',
				price: '15.00',
				stock: 19
			}

			var updateOptions = {
				options: {
					size: ['XS', 'SM', 'M', 'L'],
					color: ['black', 'blue', 'sand'],
					sex: ['womens', 'mens']
				}
			}

			it('should return a 401 when user is not a manager', function(done){
				var body = {
					user_id: testIdNonManager,
					product: updateOne
				}

				guestAgent.put('/api/products/' + testProduct._id)
				.send(body)
				.expect(401)
				.end(function(err, res){
					if(err) return done(err);
					done();
				})
			})

			it('should return the updated product', function(done){
				guestAgent.put('/api/products/' + testProduct._id)
				.send({
					user_id: testId,
					product: updateOne
				})
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					expect(res.body.title).to.equal(updateOne.title);
					/* NOTE:  Saves and finds return the number value, and do not trigger the 'getter' */
					expect(res.body.price).to.equal(updateOne.price);
					done();
				})
			})

			it('should return updated options object', function(done){
				guestAgent.put('/api/products/' + testProduct._id)
				.send({
					user_id: testId,
					product: updateOptions
				})
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					for(var opt in res.body.options){
						expect(res.body.options[opt]).to.deep.include.members(updateOptions.options[opt]);
					}
					done();
				})
			})

			describe('updates variants', function(){

				var refProduct;

				beforeEach('get current product and variants', function(done){
					guestAgent.get('/api/products/' + testProduct._id)
					.end(function(err, res){
						if(err) return done(err);
						refProduct = res.body;
						done();
					})
				})

				it('should update product variants', function(done){

					refProduct.variants[0].stock = 30;
					refProduct.variants[0].imageName = 'image.jpg';
					refProduct.variants[0].imageURL = 'https://pics/image.jpg';

					var body = {
						user_id: testId,
						product: refProduct
					}

					guestAgent.put('/api/products/' + testProduct._id)
					.send(body)
					.expect(200)
					.end(function(err, res){
						if(err) return done(err);
						var toCompare = res.body.variants[0];
						Variant.findById(toCompare)
						.then(function(variant){
							expect(variant.stock).to.equal(30);
							expect(variant.imageName).to.equal('image.jpg');
							expect(variant.imageURL).to.equal('https://pics/image.jpg');
							done();
						})
						.catch(done);
					})
				})

				describe('remove variant(s) on update', function(){

					var removedVariantId;

					beforeEach('Remove variant from product', function(done){
						removedVariantId = refProduct.variants[1]._id;
						refProduct.variants.pop();

						var body = {
							user_id: testId,
							product: refProduct
						}

						guestAgent.put('/api/products/' + testProduct._id)
						.send(body)
						.expect(200)
						.end(function(err, res){
							if(err) return done(err);
							done();
						})
					})

					it('should remove variant(s) _id from parent product when not included in update', function(){
						expect(refProduct.variants.indexOf(removedVariantId)).to.equal(-1);
					})

					it('should removes variant(s) from Variant collcection when not included in update', function(){
						return expect(Variant.findById(removedVariantId)).to.eventually.be.null;
					})
				})

				describe('adds variant(s) on update', function(){

					var updatedProduct;

					var newVariant = {
						options: {
							size: 'M',
							color: 'black'
						},
						stock: 50,
						price: "25.00",
						imageName: 'image.jpg',
						imageURL: 'https://pic.com/image.jpg'
					}

					beforeEach('add new variant to product', function(done){

						refProduct.variants.push(newVariant);

						var body = {
							user_id: testId,
							product: refProduct
						}

						guestAgent.put('/api/products/' + testProduct._id)
						.send(body)
						.expect(200)
						.end(function(err, res){
							if(err) return done(err);
							updatedProduct = res.body;
							done();
						})
					})

					it('should add variant(s) _id to the parent product when included in update', function(){
						expect(updatedProduct.variants.length).to.equal(3);
					})

					it('should add new variant(s) to the Variant collection when included in the update', function(){
						return expect(Variant.find().where({
							stock: 50,
							/* Looking for raw price, not string price */
							price: 2500,
							imageName: 'image.jpg',
							imageURL: 'https://pic.com/image.jpg'})
							.exec()).to.eventually.have.length(1);
					})

				})
			})
		})

		describe('DELETE /:product_id', function(){

			it('should return 403 status when user is not a manager', function(done){
				guestAgent.delete('/api/products/' + testProduct._id)
				.expect(401)
				.end(function(err, res){
					if(err) return done(err);
					done();
				})
			})

			it('should remove the product and all variants', function(done){
				guestAgent.delete('/api/products/' + testProduct._id)
				.send({
					user_id: testId
				})
				.expect(204)
				.end(function(err, res){
					if(err) return done(err);
					Product.findById(testProduct._id)
					.exec()
					.then(function(result){
						expect(result).to.be.null;
						Variant.where('product_id')
						.equals(testProduct._id)
						.exec()
						.then(function(variants){
							expect(variants).to.have.length(0);
							done();
						})
					})
					.catch(done)
				})
			})
		})
	})
});
