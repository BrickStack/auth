var signupMod = angular.module("signup", ['ng', "ui.bootstrap", "ui.validate"]);
signupMod.controller("signupCtrl", function ($scope, $http) {
    //校验用户名中
    $scope.username = {
        label: "Username:",
        checking: false,
        value: "",
        isValid: true
    };

    //校验email中
    $scope.email = {
        label: "Email:",
        checking: false,
        value: "",
        isValid: true
    };

    $scope.password = {
        label: "Password",
        value: ""
    };

    $scope.password2 = {
        label: "Again Password",
        value: ""
    };
    //密码是否相等
    $scope.isPwdEquel = true;

    //注册中
    $scope.isSignuping = false;
    $scope.submitted = false;

    $scope.alert = {
        type: 'danger',
        msg: '',
        iconClass: ""
    };
    $scope.closeAlert = function () {
        $scope.alert.msg = "";
    };
    //注册:
    $scope.signup = function (signupForm) {
        if (signupForm.$invalid) {
            $scope.submitted = true;
            return;
        }
        $scope.alert = {
            type: '',
            msg: '正在注册中.....',
            iconClass: "fa-spinner fa-spin"
        };
        var userInfo = {
            username: $scope.username.value,
            email: $scope.email.value,
            password: $scope.password.value,
            password2: $scope.password2.value
        };
        $http({
            url: "/users",
            method: "POST",
            data: userInfo,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $scope.isSignuping = false;
            if (status == 200) {
                $scope.alert = {
                    type: 'success',
                    msg: '已发送账户激活邮件，请通过邮件完成注册',
                    iconClass: "fa-check"
                };
            } else {
                $scope.alert = {
                    type: 'danger',
                    msg: '系统异常，注册失败，请稍后再试',
                    iconClass: "fa-times"
                };
            }
        }).error(function (data, status, headers, config) {
            $scope.isSignuping = false;
            $scope.alert.iconClass = "fa-times";
            $scope.alert.type = "danger";
            if (status == 409) {
                $scope.alert.msg = "注册失败，用户名已存在";
            } else if (status == 400) {
                $scope.alert.msg = "请求参数不合法，请重新注册";
            } else {
                $scope.alert.msg = "系统异常，注册失败，请稍后再试";
            }
        });
    }

    $scope.cancel = function () {
        window.location.href = "/home";
    }
});

signupMod.directive("passwordVerify", function () {
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

angular.bootstrap($('html'), [signupMod.name]);