const auth = require('./authentication')
var express = require('express')
var router = express.Router()

const { check } = require('express-validator')

var db = require('./queries')

/*
    Check that server is connected and responding
*/
router.get('/ping', (req, res) => {
    res.send("Hello from FactsOnly!")
})

/*
    Gets all facts in the database
*/
router.get('/', db.getAllFacts);


/*
    Gets user information in database based on uid
*/
router.post('/user', [
    check('uid')
    .notEmpty().withMessage('must have uid')
    .trim()
    .escape()
], auth.checkIfAuthenticated, db.getUser)


/*
    Gets all saved facts in the database for user
*/
router.post('/saved/', [
    check('uid')
    .notEmpty().withMessage('must have uid')
    .trim()
    .escape()
], auth.checkIfAuthenticated, db.getSavedFacts)


/*
    Checks if specific fact is saved for specific user
*/
router.post('/isSaved/', [
    check('uid')
    .notEmpty().withMessage('must have uid')
    .trim()
    .escape(),
    check('fid')
    .isInt().withMessage('fact id must be an integer')
], auth.checkIfAuthenticated, db.checkSaved)


/*
    Check if specific user is an admin
*/
router.post('/isAdmin', auth.checkIfAdmin, function(req, res, err){res.status(200); res.send({r: true})})

/*
    Makes specific user an admin
*/
// router.post('/makeAdmin', auth.makeUserAdmin)


/*
    Creates a new fact in the database
*/
router.post('/', auth.checkIfAdmin, db.createFact)


/*
    Edits a fact in the database
*/
router.post('/editFact', auth.checkIfAdmin, db.editFact)

/*
    Deletes a fact from the database
*/
router.post('/deleteFact', auth.checkIfAdmin, db.deleteFact)


/*
    Creates new user in database
*/
router.post('/addUser', [
    check('uid')
    .notEmpty().withMessage('must have uid')
    .trim()
    .escape(),
    check('email')
    .normalizeEmail()
    .isEmail().withMessage('invalid email address'),
    check('today').isISO8601().withMessage('invalid date format. Must be ISO8601 format')
    .toDate()
],auth.checkIfAuthenticated, db.createUser)


/*
    Creates a new report for a fact in the database
*/
router.post('/reportFact', [
    check('fid')
    .isInt().withMessage('fact id must be an integer'),
    check('email')
    .if(check('email').notEmpty().normalizeEmail().isEmail().withMessage('invalid email')),
    check('issue')
    .notEmpty().withMessage('issue cannot be empty')
    .trim()
    .escape()
], auth.checkIfAuthenticated, db.reportFact)


/*
    Saves fact for user
*/
router.post('/saveFact', [
    check('uid')
    .notEmpty().withMessage('must have uid')
    .trim()
    .escape(),
    check('fid')
    .isInt().withMessage('fact id must be an integer')
], auth.checkIfAuthenticated, db.saveFact)


/*
    Unsaves fact for user
*/
router.post('/unsaveFact', [
    check('uid')
    .notEmpty().withMessage('must have uid')
    .trim()
    .escape(),
    check('fid')
    .isInt().withMessage('fact id must be an integer')
], auth.checkIfAuthenticated, db.unsaveFact)

module.exports = router;
