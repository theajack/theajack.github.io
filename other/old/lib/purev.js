


(function () {
    var _form = 'pv-form', _valid = 'pv-rule', _lang = 'EN';
    var isBrowser = ('object' === typeof document && 'undefined' !== typeof document.body)
    var base = {
        regExp: {
            'null': /^\S{0}$/,
            "date": /^(([12]\d{3}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|3(0|1))))$/,
            "email": /^((\w*@\w*\.[A-Za-z.]+(\.)?[A-Za-z]+))$/,
            "decimal": /^-?[1-9]\d*.\d*|0.\d*[1-9]\d*$/,
            "idcard": /^(\d{17}(X|\d))$/,
            "url": /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/,
            "phone": /^([1]\d{10})$/,
        },
        error: {
            CN: {
                null: "可以为空",
                notnull: "必填",
                date: "格式为XXXX-XX-XX",
                email: "格式为XXX@XX.XX",
                number: "须为纯数字",
                idcard: "17位数字加一位数字或X",
                length: "输入长度为",
                url: "请输入正确的网址",
                decimal: "请正确的小数",
                lengthOfAny: "输入长度为",
                phone: "须为11位纯数字",
                letterStart: "字母开头且长度为",
                range: "数字不在范围内",
                express: "自定义错误"
            }, EN: {
                null: "can be empty",
                notnull: "required",
                date: "The format is XXXX-XX-XX",
                email: "The format is XXX@XX.XX",
                number: "must be a pure number",
                idcard: "17 digits plus one digit or X",
                length: "Enter the length is",
                url: "Please enter the correct URL",
                decimal: "Please correct the decimal",
                lengthOfAny: "Input length is",
                phone: "It must be 11 digits",
                letterStart: "The beginning of the letter and the length is ",
                range: "The number is not in range",
                express: "Custom Error"
            }
        },
    }
    function _attachEvent(obj, event, fun) {
        if (document.addEventListener) {
            obj.addEventListener(event.substring(2), fun, false);
        } else if (document.attachEvent) {
            obj.attachEvent(event, fun);
        }
    };
    function addStyle() {
        var style = document.createElement('style');
        style.innerHTML = "[pv-res=fail]{color:#fa4545!important}[pv-res=fail]::-webkit-input-placeholder{color:#fa4545!important}[pv-res=fail]::-moz-placeholder{color:#fa4545!important}[pv-res=fail]:-moz-placeholder{color:#fa4545!important}[pv-res=fail]:-ms-input-placeholder{color:#fa4545!important}"
        document.head.appendChild(style)
    }
    if (isBrowser) {
        addStyle();
    }
    function validForm(name, call,fcall) {
        var form = document.querySelector('[' + _form + '=' + name + ']')||document.getElementById(name)||name
        if (typeof form!=='object' || _isUd(form.querySelectorAll)) {
            console.warn('没有命名为' + name + '的dom元素')
            return;
        }
        var list;
        if(form.hasAttribute(_valid)){
            list=[form];
        }else{
            list = form.querySelectorAll('[' + _valid + ']');
        }
        var t = false;
        var res = [];
        for (var i = 0; i < list.length; i++) {
            var input = list[i];
            var attr = input.getAttribute(_valid);
            var v = validText(input.value, attr, input);
            if (v !== true) {
                if (input._hasAttach !== true) {
                    _attachEvent(input, 'onclick', function () {
                        this.setAttribute('pv-res', 'none')
                        if(this._pv_np){
                            this.removeAttribute('placeholder')
                        }
                    })
                }
                input.setAttribute('pv-res', 'fail')
                if(input.getAttribute('placeholder')===null){
                    input._pv_np=true;
                    input.setAttribute('placeholder',v);
                }
                res.push(v);
                if (!t) {
                    t = true;
                    PureV.toast(v);
                }
            }
        }
        if (!t) {
            if(call)call();
        }else{
            if(fcall)fcall();
        }
        return res
    }
    function validJson(json, vjson) {//json 是要验证的文字，vjson是验证规则
        var res = {}
        var f=true;
        for (var k in json) {
            if (k in vjson) {
                res[k] = validText(json[k], vjson[k])
                if(res[k]!==true&&f){
                    f=false;
                }
            } else {
                res[k] = null
                console.warn('属性' + k + '不在验证规则中');
            }
        }
        return {
            result:f,
            info:res
        };
    }
    function validText(d, v, input) {// d是文字 v是验证规则
        var c = "";
        if (v.indexOf("lengthOfAny") != -1) {
            var e = v.substring(12, v.length - 1).split(",");
            if (e[1] === undefined) {
                e[1] = e[0]
            }
            var f = "lengthOfAny";
            if (d.length >= parseInt(e[0]) && d.length <= parseInt(e[1])) {
                c = true
            } else {
                c = _getValidText(f, e)
            }
        } else {
            c = _checkValue(v, d)
        }
        if (c === true) {
            if (PureV.onOnePass) {
                if (input) {
                    PureV.onOnePass(input, c);
                } else {
                    PureV.onOnePass(c);
                }
            }
        } else {
            if (PureV.onOneFail) {
                if (input) {
                    PureV.onOneFail(input, c);
                } else {
                    PureV.onOneFail(c);
                }
            }
        }
        return c
    };

    function _throw(info) {
        throw new Error(info)
    }

    //获取验证提示文字
    function _getValidText(a, b) {
        if (b == undefined) {
            if (_has(a, 'express')) {
                return base.error[_lang].express;
            }
            return base.error[_lang][a]
        } else {
            var c = "";
            if (_has(a, "number")) {
                c = " 且长度为"
            }
            if (b[0] == b[1]) {
                return base.error[_lang][a] + c + b[0]
            }
            return base.error[_lang][a] + c + "[" + b[0] + "," + b[1] + "]"
        }
    };
    function _checkValue(a, e) {
        if (a.indexOf("notnull") != -1) {
            if (e.length == 0) {
                return _getValueText("notnull")
            }
        } else if (a.indexOf("null") != -1) {
            var c = a.split(" ");
            var b = (c[0] == "null") ? c[1] : c[0];
            if(b===''||_isUd(b)){
                _throw('null 关键字不能单独使用')
            }
            if (b.indexOf("range") != -1) {
                var d = _testRange(a, e);
                if (d !== true && e != "") {
                    return d
                }
            }
            if (!_getRegExp(b).test(e) && e != "") {
                return _getValueText(b)
            }
        } else {
            if (a.indexOf("range") != -1) {
                var d = _testRange(a, e);
                if (d !== true) {
                    return d
                }
            } else {
                if (!_getRegExp(a).test(e)) {
                    return _getValueText(a)
                }
            }
        }
        return true
    };
    function _testRange(b, c) {
        var a = b.substring(6, b.length - 1).split(",");
        b = "number";
        if (_getRegExp(b).test(c)) {
            if (parseInt(c) < parseInt(a[0]) || parseInt(c) > parseInt(a[1])) {
                return _getValidText("range", a)
            }
        } else {
            return _getValidText("number")
        }
        return true
    };
    function _getValueText(b) {
        var c = 0;
        if (b.indexOf("range") != -1) {
            c = 6
        } else {
            if (b.indexOf("letterStart") != -1) {
                c = 12
            } else if (b.indexOf("length") != -1) {
                c = 7
            } else if (_has(b, "number") && b != "number") {
                c = 7
            }
        }
        if (c != 0) {
            var a = b.substring(c, b.length - 1).split(",");
            if (a[1] === undefined) {
                a[1] = a[0]
            }
            return _getValidText(b.substring(0, c - 1), a)
        } else {
            return _getValidText(b)
        }
    };
    function _getRegExp(f) {
        var d = -1;
        var c = -1;
        if (f.indexOf("length") != -1) {
            var e = f.substring(7, f.length - 1).split(",");
            f = "length";
            d = e[0];
            if (e[1] == undefined) {
                e[1] = e[0]
            }
            c = e[1]
        } else if (f.indexOf("letterStart") != -1) {
            var e = f.substring(12, f.length - 1).split(",");
            f = "letterStart";
            d = e[0];
            if (e[1] == undefined) {
                e[1] = e[0]
            }
            c = e[1]
        } else if (_has(f, "number") && f != "number") {
            var e = f.substring(7, f.length - 1).split(",");
            f = "number";
            d = e[0];
            if (e[1] == undefined) {
                e[1] = e[0]
            }
            c = e[1]
        } else if (_has(f, "express")) {
            d = f.substring(8, f.length - 1);
            f = "express"
        }
        if (f in base.regExp) {
            return base.regExp[f];
        }
        switch (f) {
            case "number":
                if (d >= 0) {
                    return new RegExp("^-?(\\d{" + d + "," + c + "})$")
                } else {
                    return /^-?(\d+)$/
                } break;
            case "letterStart": return new RegExp("^([a-zA-Z]([a-zA-Z\\d]){" + (parseInt(d) - 1) + "," + (parseInt(c) - 1) + "})$"); break;
            case "length": return new RegExp("^(([a-zA-Z\\d]){" + d + "," + c + "})$"); break;
            case "express": return new RegExp(d); break;
            default: return "null"; break;
        }
    };
    function _has(a, s) {
        return a.indexOf(s) !== -1
    }
    function _isUd(a) {
        return typeof a === 'undefined'
    }
    var PureV = function (obj, a2,a3) {
        if (typeof obj === 'object') {
            return validJson(obj, a2)
        }else{
            if (typeof a2!=='string' && isBrowser) {
                return validForm(obj, a2,a3)
            } else {
                return validText(obj, a2)
            }
        }
    }
    PureV.toast = function (s) {
        if (isBrowser) {
            alert(s);
        } else {
            console.log(s);
        }
    }
    PureV.info = function (a, b) {
        if (typeof a === 'object') {
            for (var k in a) {
                PureV.info(k, a[k])
            }
            return
        }
        base.error[_lang][a] = b;
    };
    PureV.reg = function (a, b) {
        if (typeof a === 'object') {
            for (var k in a) {
                _info(k, a[k])
            }
            return
        }
        base.regExp[a] = b;
    };

    PureV.lang = function (s) {
        if (s !== 'CN' && s !== 'EN') {
            _throw('Language can only be set to CN or EN');
        }
        _lang = s;
    }

    if (typeof module !== 'undefined') {
        module.exports = PureV;
    } else {
        if(_isUd(window.purev)){
            window.purev = PureV
        }else{
            window.$PUREV = PureV
        }
    }
})()
