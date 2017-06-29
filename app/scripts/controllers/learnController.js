'use strict';

angular.module('playerApp')

.controller('LearnCtrl', function(learnService, $log, $scope, $sessionStorage, $timeout, $state, $rootScope, sessionService, $location, $window) {
    var learn = this;
    var uid = $rootScope.userId ? $rootScope.userId : $window.localStorage.getItem('userId');
    $rootScope.searchResult = [];
    $scope.contentPlayer = {
        isContentPlayerEnabled: false
    };

    function handleFailedResponse(errorResponse) {
        var error = {};
        error.isError = true;
        error.message = '';
        error.responseCode = errorResponse.responseCode;
        learn.error = error;
        $timeout(function() {
            $scope.error = {};
        }, 2000);
    }

    learn.openCourseView = function(course, courseType) {
        var showLectureView = 'no';
        var params = { courseType: courseType, courseId: course.contentId,tocId:course.courseId, lectureView: showLectureView, progress: course.progress, total: course.total,courseRecordId:course.id };
        sessionService.setSessionData('COURSE_PARAMS', params);
        $rootScope.isPlayerOpen = true;
        $state.go('Toc', params);
    };

    learn.courses = function() {
        $scope.loading = true;

        learnService.enrolledCourses(uid).then(function(successResponse) {
                $scope.loading = false;
                if (successResponse && successResponse.responseCode === 'OK') {
                    learn.enrolledCourses = successResponse.result.courses;
                    $rootScope.enrolledCourseIds = [];

                    var isEnrolled = learn.enrolledCourses.forEach(function(course) {
                        $rootScope.enrolledCourseIds.push(course.courseId);
                    });
                } else {
                    $log.warn('enrolledCourses', successResponse);
                    handleFailedResponse(successResponse);
                }
            })
            .catch(function(error) {
                $log.warn(error);

                handleFailedResponse(error);
            });
    };
    learn.courses();
    learn.otherSection = function() {
        var req = {
            'request': {
                'context': {
                    'userId': 'user1'
                }
            }
        };
        learnService.otherSections(req).then(function(successResponse) {
            if (successResponse && successResponse.responseCode === 'OK' && successResponse.result.response) {
                learn.page = successResponse.result.response.sections;
            } else {
                $log.warn('otherCourses', successResponse);
                handleFailedResponse(successResponse);
            }
        }).catch(function(error) {
            $log.warn(error);
            handleFailedResponse(error);
        });
    };
    learn.otherSection();
});
