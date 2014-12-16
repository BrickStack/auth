var signinMod = angular.module("signin", ['ng', "ui.bootstrap", "ui.validate"]);
signinMod.controller("signinCtrl", function ($scope, $http, $interval) {
    //校验用户名中
    $scope.username = {
        label: "Username:",
        checking: false,
        value: "",
        isValid: true
    };

    $scope.password = {
        label: "Password",
        value: ""
    };

    $scope.alert = {
        type: '',
        msg: '',
        iconClass: ""
    };

    $scope.gotoSeconed = 5;

    $scope.closeAlert = function () {
        $scope.alert.msg = "";
    };
    //注册:
    $scope.signin = function (signinForm) {
        if (signinForm.$invalid) {
            $scope.submitted = true;
            return;
        }
        $scope.alert = {
            type: '',
            msg: '正在登录中.....',
            iconClass: "fa-spinner fa-spin"
        };
        var userInfo = {
            username: $scope.username.value,
            password: $scope.password.value
        };
        $http({
            url: "/users/session",
            method: "POST",
            data: userInfo,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $scope.issignining = false;
            if (status == 200) {
                $scope.alert = {
                    type: 'success',
                    msg: '登录成功，自动跳转到首页',
                    iconClass: "fa-check"
                };
                var stop = $interval(function () {
                    $scope.gotoSeconed -= 1;
                    if ($scope.gotoSeconed === 0) {
                        $interval.cancel(stop);
                        window.location.href = "/";
                    }
                }, 1000);
            } else {
                $scope.alert = {
                    type: 'danger',
                    msg: '系统异常，登录失败，请稍后再试',
                    iconClass: "fa-times"
                };
            }
        }).error(function (data, status, headers, config) {
            $scope.issignining = false;
            $scope.alert.iconClass = "fa-times";
            $scope.alert.type = "danger";
            if (status == 401) {
                $scope.alert.msg = "登录失败，用户名或者密码错误";
            } else if (status == 409) {
                $scope.alert.msg = "账户未激活";
            } else if (status == 400) {
                $scope.alert.msg = "请求参数不合法，请重新登录";
            } else {
                $scope.alert.msg = "系统异常，登录失败，请稍后再试";
            }
        });
    };

    $scope.cancel = function () {
        window.location.href = "/home";
    }
});

signinMod.directive("passwordVerify", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var origin = scope.$eval(attrs["passwordVerify"]);
                if (origin !== viewValue) {
                    ctrl.$setValidity("passwordVerify", false);
                    return undefined;
                } else {
                    ctrl.$setValidity("passwordVerify", true);
                    return viewValue;
                }
            });
        }
    };
});

angular.bootstrap($('html'), [signinMod.name]);