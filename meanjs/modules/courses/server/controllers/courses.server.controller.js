'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an course
 */
exports.create = function (req, res) {
  var course = new Course(req.body);
  course.user = req.user;

  course.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * Show the current course
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var course = req.course ? req.course.toJSON() : {};

  // Add a custom field to the Course, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Course model.
  course.isCurrentUserOwner = !!(req.user && course.user && course.user._id.toString() === req.user._id.toString());

  res.json(course);
};

/**
 * Update an course
 */
exports.update = function (req, res) {
  var course = req.course;

  course.title = req.body.title;
  course.content = req.body.content;

  course.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * Delete an course
 */
exports.delete = function (req, res) {
  var course = req.course;

  course.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * List of Courses
 */
exports.list = function (req, res) {
  Course.find().sort('-created').populate('user', 'displayName').exec(function (err, courses) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courses);
    }
  });
};

/**
 * Course middleware
 */
exports.courseByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Course is invalid'
    });
  }

  Course.findById(id).populate('user', 'displayName').exec(function (err, course) {
    if (err) {
      return next(err);
    } else if (!course) {
      return res.status(404).send({
        message: 'No course with that identifier has been found'
      });
    }
    req.course = course;
    next();
  });
};
