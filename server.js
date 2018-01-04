var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new GoogleStrategy({
		clientID: '183835007079-q5uf20p6jphrs65qe4dlggkepshul1ql.apps.googleusercontent.com',
		clientSecret: 'S9iqCXo6Z0GpWmp75uzAHRot',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	function(accessToken, refreshToken, profile, cb) {
		googleProfile = {
			id: profile.id,
			displayName: profile.displayName
		};
		cb(null, profile);
	}
));

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

//app routes
app.get('/', function(req, res){
	res.render('index', { user: req.user });
});

app.get('/logged', function(req, res){
	res.render('logged', { user: googleProfile });
});
//Passport routes
app.get('/auth/google',
passport.authenticate('google', {
scope : ['profile', 'email']
}));
app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect : '/logged',
		failureRedirect: '/'
	}));

app.listen(3000);