/*!
 * customFormValidation
 *
 *
 * @author: TakashiKakizoe
 * @author url: https://github.com/TakashiKakizoe1109
 * @version: 1.0.21
 *
 * Open source under the MIT License.
 * License url: https://raw.githubusercontent.com/TakashiKakizoe1109/customFormValidation/master/LICENSE
 *
 *
 */

var customFormValidation = function(op) {

  /** set options or default params */
  this.op = {};

  this.op.selector = op.selector || '#contactForm';
  this.op.offset = op.offset || 0;
  this.op.moveSpeed = op.moveSpeed || 500;
  this.op.easing = op.easing || 'swing';
  this.op.avoid = op.avoid || '.__noValidation';
  this.op.disableBtn = op.disableBtn || 'btn_disabled';

  this.op.strongNotSame = op.strongNotSame === false ? false : true;
  this.op.syncValue = op.syncValue === true ? true : false;
  this.op.syncHtml = op.syncHtml === true ? true : false;
  this.op.startError = op.startError === true ? true : false;
  this.op.correctMsg = op.correctMsg === true ? true : false;

  this.op.error = op.error || 'error_message';
  this.op.errorElement = op.errorElement || 'span';
  this.op.correct = op.correct || 'correct_message';
  this.op.correctElement = op.correctElement || 'span';

  this.op.msgRequiredError = op.msgRequiredError || '必須項目です';
  this.op.msgPatternError = op.msgPatternError || '正しく入力してください';
  this.op.msgMailNotSameError = op.msgMailNotSameError || 'メールアドレスが一致しません';
  this.op.msgRequiredCorrect = op.msgRequiredCorrect || '入力済です';
  this.op.msgPatternCorrect = op.msgPatternCorrect || '正しく入力されています';
  this.op.msgMailNotSameCorrect = op.msgMailNotSameCorrect || '一致しています';

  this.op.addClassMode = op.addClassMode === true ? true : false;
  this.op.doubleCheckMode = op.doubleCheckMode === false ? false : true;
  this.op.eventNameError = op.eventNameError || 'customFormValidationError';
  this.op.classNameRequiredError = op.classNameRequiredError || '__RequiredError';
  this.op.classNamePatternError = op.classNamePatternError || '__PatternError';
  this.op.classNameMailNotSameError = op.classNameMailNotSameError || '__MailNotSameError';
  this.op.eventNameCorrect = op.eventNameError || 'customFormValidationCorrect';
  this.op.classNameRequiredCorrect = op.classNameRequiredCorrect || '__RequiredCorrect';
  this.op.classNamePatternCorrect = op.classNamePatternCorrect || '__PatternCorrect';
  this.op.classNameMailNotSameCorrect = op.classNameMailNotSameCorrect || '__MailNotSameCorrect';

  this.op.groupIdentificationPrefix = op.groupIdentificationPrefix || '__group_';

  this.op.clickSubmit = op.clickSubmit || '';
  this.op.submitCallBack = op.submitCallBack || '';

};

customFormValidation.prototype.addMatch = function(key, val) {
  this.match = this.match || {};
  this.match[key] = val;
};

customFormValidation.prototype.addValidation = function() {
  var obj = this;
  obj.allCheck = this.allCheck;
  var
    target = '',
    groupID = 0;

  $(obj.op.selector).find('input[type^="submit"]').attr('disabled', false);

  /** elements search */
  $(obj.op.selector).find('select,input,textarea').not(obj.op.avoid).not('input[type^="submit"]').each(function(index, element) {

    /** target element */
    var
      _t = $(this),
      target = $(this),
      htmlTag = element.localName,
      type = _t.attr('type');

    /** group id increment */
    groupID = groupID + 1;
    var rel = _t.attr('validate-model') || '';
    var group = rel === '' ? obj.op.groupIdentificationPrefix + groupID : obj.op.groupIdentificationPrefix + rel;
    _t.attr('validate-group', group);

    /** required */
    var required = !!_t.attr('required');
    required = required || _t.hasClass('Required');
    if (required) {
      if (((htmlTag == 'textarea') || (htmlTag == 'input' && type == 'text')) && _t.is(':visible')) {
        _t.on('keyup blur', {
          obj: obj,
          target: target
        }, obj.inputTextRequired);
      } else if ((htmlTag == 'input' && type == 'tel') && _t.is(':visible')) {
        _t.on('keyup blur', {
          obj: obj,
          target: target
        }, obj.inputTelRequired);
      } else if ((htmlTag == 'input' && type == 'email') && _t.is(':visible')) {
        var retype = !_t.attr('not-same');
        if (retype) {
          _t.on('keyup blur', {
            obj: obj,
            target: target
          }, obj.inputEmailRequired);
        } else {
          _t.on('keyup blur', {
            obj: obj,
            target: target
          }, obj.inputEmailRetypeRequired);
        }
      } else if (htmlTag == 'select' && _t.is(':visible')) {
        _t.on('change blur', {
          obj: obj,
          target: target
        }, obj.selectBoxRequired);
      } else if ((htmlTag == 'input' && type == 'checkbox') && _t.parent().is(':visible')) {
        _t.on('change', {
          obj: obj,
          target: target
        }, obj.checkBoxRequired);
      } else if ((htmlTag == 'input' && type == 'radio') && _t.parent().is(':visible')) {
        _t.on('change', {
          obj: obj,
          target: target
        }, obj.radioRequired);
      } else if ((htmlTag == 'input' && type == 'file') && _t.parent().is(':visible')) {
        _t.on('change', {
          obj: obj,
          target: target
        }, obj.fileRequired);
      }
    }

    /** pattern */
    var pattern = !!_t.attr('validate-pattern');
    if (pattern) {
      _t.on('keyup blur', {
        obj: obj,
        target: target
      }, obj.inputTextPattern);
    }

    /** not same */
    var not_same = _t.attr('not-same');
    if (!!not_same) {
      var _sameTarget = $('#' + not_same);
      _sameTarget.on('keyup blur', {
        obj: obj,
        _sameTarget: _sameTarget,
        _target: target
      }, obj.inputTextNotSame);
      _t.on('keyup blur', {
        obj: obj,
        _sameTarget: _sameTarget,
        _target: target
      }, obj.inputTextNotSame);
      if (obj.op.strongNotSame) {
        _sameTarget.on('copy', function() {
          return false;
        });
        _t.on('paste', function() {
          return false;
        });
      }
    }

    /** sync value */
    if (obj.op.syncValue) {
      var syncValue = _t.attr('syncValue');
      var syncHtml = _t.attr('syncHtml');
      if (!!syncValue || !!syncHtml) {
        if (((htmlTag == 'textarea') || (htmlTag == 'input' && type == 'text') || (htmlTag == 'input' && type == 'email') || (htmlTag == 'input' && type == 'tel')) && _t.is(':visible')) {
          _t.on('keyup blur', {
            obj: obj,
            target: target
          }, obj.syncValueText);
        } else if ((htmlTag == 'select') && _t.is(':visible')) {
          _t.on('change blur', {
            obj: obj,
            target: target
          }, obj.syncValueSelect);
        } else if ((htmlTag == 'input' && type == 'radio') && _t.is(':visible')) {
          _t.on('change blur', {
            obj: obj,
            target: target
          }, obj.syncValueRadio);
        } else if ((htmlTag == 'input' && type == 'checkbox') && _t.is(':visible')) {
          _t.on('change blur', {
            obj: obj,
            target: target
          }, obj.syncValueCheckBox);
        }
      }
    }

  });

  /** submit */
  $(obj.op.selector).submit({
    obj: obj
  }, function() {
    var check = obj.allCheck({
      data: {
        obj: obj
      }
    }, true, true, true);
    if (!check) {
      $(document).trigger(obj.op.eventNameError);
      return false;
    } else {
      $(document).trigger(obj.op.eventNameCorrect);
      if (obj.op.doubleCheckMode) {
        var submitBtn = $(obj.op.selector).find('input[type^="submit"]');
        submitBtn.addClass(obj.op.disableBtn);
        submitBtn.on('click', function() {
          return false;
        });
      }
      return true;
    }
  });

  if (obj.op.clickSubmit) {
    $(obj.op.clickSubmit).click({
      obj: obj
    }, function() {
      var check = obj.allCheck({
        data: {
          obj: obj
        }
      }, true, true, true);
      if (!check) {
        $(document).trigger(obj.op.eventNameError);
        return false;
      } else {
        $(document).trigger(obj.op.eventNameCorrect);
        obj.callback();
        return true;
      }
    });
  }

  /** btn disabled */
  obj.allCheck({
    data: {
      obj: obj
    }
  }, false, obj.op.startError);
  return this;

};

customFormValidation.prototype.syncValueText = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  var syncValue = obj.data.target.attr('syncValue');
  var value = $.trim(obj.data.target.val());
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }

  var syncHtml = obj.data.target.attr('syncHtml');
  var valueHTML = obj.data.target.attr('syncHtmlValue') || value;
  syncHtml = $(syncHtml);
  if (syncHtml.length && obj.data.obj.op.syncHtml) {
    syncHtml.html(valueHTML);
  }
};

customFormValidation.prototype.syncValueSelect = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  var syncValue = obj.data.target.attr('syncValue');
  var value = $.trim(obj.data.target.val());
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }

  var syncHtml = obj.data.target.attr('syncHtml');
  var valueHTML = obj.data.target.attr('syncHtmlValue') || value;
  syncHtml = $(syncHtml);
  if (syncHtml.length && obj.data.obj.op.syncHtml) {
    syncHtml.html(valueHTML);
  }
};

customFormValidation.prototype.syncValueRadio = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  var syncValue = obj.data.target.attr('syncValue');
  var syncHtml = obj.data.target.attr('syncHtml');

  var model = obj.data.target.attr('validate-model');
  var value = '';
  var valueHTML = '';

  $('input[validate-model^="' + model + '"]').each(function() {
    if ($(this).is(':checked')) {
      value = $.trim($(this).val());
      valueHTML = $(this).attr('syncHtmlValue') || value;
    }
  });
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }
  syncHtml = $(syncHtml);
  if (syncHtml.length && obj.data.obj.op.syncHtml) {
    syncHtml.html(valueHTML);
  }
};

customFormValidation.prototype.syncValueCheckBox = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  var syncValue = obj.data.target.attr('syncValue');
  var model = obj.data.target.attr('validate-model');
  var value = '';
  $('input[validate-model^="' + model + '"]').each(function() {
    if ($(this).is(':checked')) {
      value += $.trim($(this).val()) + ' ';
    }
  });
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }
};

customFormValidation.prototype.inputTextPattern = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var group = target.attr('validate-group');
  var msgError = target.attr('msgPatternError') || op.msgPatternError;
  var error = '<' + op.errorElement + ' class="' + op.error + ' error_pattern-' + group + '">' + msgError + '</' + op.errorElement + '>';
  var msgCorrect = target.attr('msgPatternCorrect') || op.msgPatternCorrect;
  var correct = '<' + op.correctElement + ' class="' + op.correct + ' correct_pattern-' + group + '">' + msgCorrect + '</' + op.correctElement + '>';

  /** match */
  var match = true;
  var checkRegEx = '';

  $('input[validate-group^="' + group + '"]').each(function() {
    var pattern = $(this).attr('validate-pattern');
    var checkVal = $.trim($(this).val());
    var d = '';
    if (!checkVal) {
      match = false;
    } else {
      if (pattern === 'yyyymmdd') {
        if (checkVal.length === 8) {
          checkVal = checkVal.substr(0, 4) + '-' + checkVal.substr(4, 2) + '-' + checkVal.substr(6, 2);
          checkRegEx = /^\d{4}-\d{2}-\d{2}$/;
          if (checkVal.match(checkRegEx)) {
            d = new Date(checkVal);
            if (d.getTime() || d.getTime() === 0) {
              match = match && true;
            } else {
              match = false;
            }
          }
        }
      } else if (pattern === 'yyyy-mm-dd') {
        checkRegEx = /^\d{4}-\d{2}-\d{2}$/;
        if (checkVal.match(checkRegEx)) {
          d = new Date(checkVal);
          if (d.getTime() || d.getTime() === 0) {
            match = match && true;
          } else {
            match = false;
          }
        }
      } else if (pattern === 'email') {
        checkRegEx = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (checkVal.match(checkRegEx)) {
          match = match && true;
        } else {
          match = false;
        }
      } else if (pattern === 'birth-year') {
        checkRegEx = /^[0-9]{4}$/;
        if (checkVal.match(checkRegEx)) {
          match = match && true;
        } else {
          match = false;
        }
        if (match) {
          var current = new Date();
          var current_year = Number(current.getFullYear());
          if (Number(checkVal) > current_year) {
            match = false;
          }
        }
      } else if (pattern === 'card-year') {
        checkRegEx = /^[0-9]{4}$/;
        if (checkVal.match(checkRegEx)) {
          match = match && true;
        } else {
          match = false;
        }
        if (match) {
          var current2 = new Date();
          var current_year2 = Number(current2.getFullYear());
          if (Number(checkVal) <= current_year2) {
            match = false;
          }
        }
      } else if (pattern === 'not-duplication') {
        var duplicateKey = target.attr('validate-duplication-key');
        var matchArray = obj.data.obj.match[duplicateKey];
        match = true;
        for (var duplicateI = 0, len = matchArray.length; duplicateI < len; duplicateI++) {
          if (checkVal == obj.data.obj.match[duplicateKey][duplicateI]) {
            match = false;
          }
        }
      } else {
        pattern = pattern.split('/');
        var regex = '';
        var flags = pattern[pattern.length - 1];
        var regex_length = pattern.length - 1;
        for (var i = 1; i < regex_length; i++) {
          regex += pattern[i];
        }
        var regexp = new RegExp(regex, flags);
        result = checkVal.match(regexp);
        if (!!result) {
          match = match && !!result;
        } else {
          match = false;
        }
      }
    }
  });

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  if (!errorView) {
    if (match) {
      return true;
    } else {
      return false;
    }
  }

  /** position */
  var positionRelation = target.attr('validate-position') || 'parent-append';
  var targetView = 'append';
  var targetPosition = target;
  positionRelation = positionRelation.split('-');
  var i = 0;
  for (i; i < positionRelation.length; i++) {
    if (positionRelation[i] == 'parent') {
      targetPosition = targetPosition.parent();
    } else if (positionRelation[i] == 'next') {
      targetPosition = targetPosition.next();
    } else if (positionRelation[i] == 'prev') {
      targetPosition = targetPosition.prev();
    } else if (positionRelation[i] == 'append') {
      targetView = 'append';
    } else if (positionRelation[i] == 'prepend') {
      targetView = 'prepend';
    } else if (positionRelation[i] == 'after') {
      targetView = 'after';
    } else if (positionRelation[i] == 'before') {
      targetView = 'before';
    }
  }

  /** error view */
  $('.' + op.correct + '.correct_pattern-' + group).remove();
  $('.' + op.error + '.error_pattern-' + group).remove();
  if (match) {
    if (op.addClassMode === true) {
      target.removeClass(op.classNamePatternError);
      target.addClass(op.classNamePatternCorrect);
    }
    if (op.correctMsg === true) {
      if (targetView == 'append') {
        targetPosition.append(correct);
      } else if (targetView == 'prepend') {
        targetPosition.prepend(correct);
      } else if (targetView == 'after') {
        targetPosition.after(correct);
      } else if (targetView == 'before') {
        targetPosition.before(correct);
      }
    }
    return true;
  } else {
    if (op.addClassMode === true) {
      target.removeClass(op.classNamePatternCorrect);
      target.addClass(op.classNamePatternError);
    }
    if (targetView == 'append') {
      targetPosition.append(error);
    } else if (targetView == 'prepend') {
      targetPosition.prepend(error);
    } else if (targetView == 'after') {
      targetPosition.after(error);
    } else if (targetView == 'before') {
      targetPosition.before(error);
    }
    return false;
  }

};

customFormValidation.prototype.inputTextNotSame = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var retypeTarget = obj.data._target;
  var sameTarget = obj.data._sameTarget;

  /** current processing value */
  var retypeTargetValue = $.trim(retypeTarget.val());
  var sameTargetValue = $.trim(sameTarget.val());
  var id = retypeTarget.attr('id');
  var msgError = retypeTarget.attr('msgMailNotSameError') || op.msgMailNotSameError;
  var error = '<' + op.errorElement + ' class="' + op.error + ' error_notsame-' + id + '">' + msgError + '</' + op.errorElement + '>';
  var msgCorrect = retypeTarget.attr('msgMailNotSameCorrect') || op.msgMailNotSameCorrect;
  var correct = '<' + op.correctElement + ' class="' + op.correct + ' correct_notsame-' + id + '">' + msgCorrect + '</' + op.correctElement + '>';


  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  if (!errorView) {
    if (retypeTargetValue === sameTargetValue) {
      return true;
    } else {
      return false;
    }
  }

  /** position */
  var positionRelation = retypeTarget.attr('validate-position') || 'after';
  var targetView = 'after';
  var retypeTargetPosition = retypeTarget;
  var sameTargetPosition = sameTarget;
  positionRelation = positionRelation.split('-');
  var i = 0;
  for (i; i < positionRelation.length; i++) {
    if (positionRelation[i] == 'parent') {
      retypeTargetPosition = retypeTargetPosition.parent();
      sameTargetPosition = sameTargetPosition.parent();
    } else if (positionRelation[i] == 'next') {
      retypeTargetPosition = retypeTargetPosition.next();
      sameTargetPosition = sameTargetPosition.next();
    } else if (positionRelation[i] == 'prev') {
      retypeTargetPosition = retypeTargetPosition.prev();
      sameTargetPosition = sameTargetPosition.prev();
    } else if (positionRelation[i] == 'append') {
      targetView = 'append';
    } else if (positionRelation[i] == 'prepend') {
      targetView = 'prepend';
    } else if (positionRelation[i] == 'after') {
      targetView = 'after';
    } else if (positionRelation[i] == 'before') {
      targetView = 'before';
    }
  }

  /** errow view and result */
  $('.' + op.error + '.error_notsame-' + id).remove();
  $('.' + op.correct + '.correct_notsame-' + id).remove();
  if (retypeTargetValue != '' || sameTargetValue != '') {

    if (retypeTargetValue === sameTargetValue) {
      if (op.addClassMode === true) {
        sameTarget.removeClass(op.classNameMailNotSameError);
        sameTarget.addClass(op.classNameMailNotSameCorrect);
        retypeTarget.removeClass(op.classNameMailNotSameError);
        retypeTarget.addClass(op.classNameMailNotSameCorrect);
      }
      if (op.correctMsg === true) {
        if (targetView == 'append') {
          sameTargetPosition.append(correct);
          retypeTargetPosition.append(correct);
        } else if (targetView == 'prepend') {
          sameTargetPosition.prepend(correct);
          retypeTargetPosition.prepend(correct);
        } else if (targetView == 'after') {
          sameTargetPosition.after(correct);
          retypeTargetPosition.after(correct);
        } else if (targetView == 'before') {
          sameTargetPosition.before(correct);
          retypeTargetPosition.before(correct);
        }
      }
      return true;
    } else {
      if (op.addClassMode === true) {
        sameTarget.removeClass(op.classNameMailNotSameCorrect);
        sameTarget.addClass(op.classNameMailNotSameError);
        retypeTarget.removeClass(op.classNameMailNotSameCorrect);
        retypeTarget.addClass(op.classNameMailNotSameError);
      }
      if (targetView == 'append') {
        sameTargetPosition.append(error);
        retypeTargetPosition.append(error);
      } else if (targetView == 'prepend') {
        sameTargetPosition.prepend(error);
        retypeTargetPosition.prepend(error);
      } else if (targetView == 'after') {
        sameTargetPosition.after(error);
        retypeTargetPosition.after(error);
      } else if (targetView == 'before') {
        sameTargetPosition.before(error);
        retypeTargetPosition.before(error);
      }
      return false;
    }
  }

};

customFormValidation.prototype.inputTextRequired = function(obj, errorView, allCheck) {

  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'text');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'parent-append';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);
};

customFormValidation.prototype.inputCkeditorRequired = function(obj, errorView, allCheck) {

  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'text');
  property.value = window.CKEDITOR.instances[target[0].name].getData();

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'parent-append';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);
};

customFormValidation.prototype.inputTelRequired = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'tel');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'parent-append';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);
};

customFormValidation.prototype.inputEmailRetypeRequired = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'emailretype');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'after';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);

};

customFormValidation.prototype.inputEmailRequired = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'email');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'after';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);
};

customFormValidation.prototype.selectBoxRequired = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'selectbox');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'parent-parent-append';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);
};

customFormValidation.prototype.checkBoxRequired = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'checkbox');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'parent-parent-append';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);
};

customFormValidation.prototype.radioRequired = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'radio');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'parent-append';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);
};

customFormValidation.prototype.fileRequired = function(obj, errorView, allCheck) {
  /** initial value */
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  /** common value */
  var op = obj.data.obj.op;
  var target = obj.data.target;

  /** current processing value */
  var property = obj.data.obj.returnRequiredProcessingValues(target, op, 'file');

  /** all element check */
  if (allCheck) {
    obj.data.obj.allCheck({
      data: {
        obj: obj.data.obj
      }
    }, false, false);
  }

  /** result */
  var positionRelation = target.attr('validate-position') || 'parent-append';
  return obj.data.obj.returnRequiredResult(target, op, property, errorView, positionRelation);

};

customFormValidation.prototype.allCheck = function(e, move, errorView, submit) {
  move = typeof move === 'undefined' ? true : move;
  errorView = typeof errorView === 'undefined' ? true : errorView;
  allCheck = typeof allCheck === 'undefined' ? true : allCheck;

  var obj = e.data.obj;
  var target = '';
  var check = true;
  var moveTarget = '';

  $(obj.op.selector).find('select,input,textarea').not(obj.op.avoid).not('input[type^="submit"]').each(function(index, element) {

    var singleCheck = true;

    /** target element */
    var _t = $(this);
    target = _t;
    var targetTop = _t;
    var htmlTag = element.localName;
    var type = _t.attr('type');

    /** required */
    var required = !!_t.attr('required');
    required = required || _t.hasClass('Required');
    if (required) {
      if (((htmlTag == 'textarea') || (htmlTag == 'input' && type == 'text')) && _t.is(':visible')) {
        singleCheck = obj.inputTextRequired({
          data: {
            obj: obj,
            target: target
          }
        }, errorView, false);
      } else if ((htmlTag == 'textarea') && _t.hasClass('ckeditor')) {
        singleCheck = obj.inputCkeditorRequired({
          data: {
            obj: obj,
            target: target
          }
        }, errorView, false);
      } else if ((htmlTag == 'input' && type == 'tel') && _t.is(':visible')) {
        singleCheck = obj.inputTelRequired({
          data: {
            obj: obj,
            target: target
          }
        }, errorView, false);
      } else if ((htmlTag == 'input' && type == 'email') && _t.is(':visible')) {
        var retype = !_t.attr('not-same');
        if (retype) {
          singleCheck = obj.inputEmailRequired({
            data: {
              obj: obj,
              target: target
            }
          }, errorView, false);
        } else {
          singleCheck = obj.inputEmailRetypeRequired({
            data: {
              obj: obj,
              target: target
            }
          }, errorView, false);
        }
      } else if (htmlTag == 'select' && _t.is(':visible')) {
        singleCheck = obj.selectBoxRequired({
          data: {
            obj: obj,
            target: target
          }
        }, errorView, false);
      } else if ((htmlTag == 'input' && type == 'checkbox') && _t.parent().is(':visible')) {
        targetTop = _t.parent();
        singleCheck = obj.checkBoxRequired({
          data: {
            obj: obj,
            target: target
          }
        }, errorView, false);
      } else if ((htmlTag == 'input' && type == 'radio') && _t.parent().is(':visible')) {
        targetTop = _t.parent();
        singleCheck = obj.radioRequired({
          data: {
            obj: obj,
            target: target
          }
        }, errorView, false);
      } else if ((htmlTag == 'input' && type == 'file') && _t.parent().is(':visible')) {
        singleCheck = obj.fileRequired({
          data: {
            obj: obj,
            target: target
          }
        }, errorView, false);
      }

    }

    /** pattern */
    var pattern = !!_t.attr('validate-pattern');
    if (pattern) {
      singleCheck = obj.inputTextPattern({
        data: {
          obj: obj,
          target: target
        }
      }, errorView, false);
    }

    /** not same */
    var not_same = _t.attr('not-same');
    if (!!not_same) {
      var _sameTarget = $('#' + not_same);
      singleCheck = obj.inputTextNotSame({
        data: {
          obj: obj,
          _sameTarget: _sameTarget,
          _target: target
        }
      }, errorView, false);
    }

    if (!singleCheck && moveTarget === '') {
      moveTarget = targetTop.offset().top - obj.op.offset;
    }
    check = check && !!singleCheck;

  });

  if (!check && move) {
    $('body,html').stop().animate({
        scrollTop: moveTarget
      },
      obj.op.moveSpeed,
      obj.op.easing
    );
  }

  moveTarget = '';

  if (!check) {
    $(obj.op.selector).find('input[type^="submit"]').addClass(obj.op.disableBtn);
    if (obj.op.clickSubmit) {
      $(obj.op.clickSubmit).addClass(obj.op.disableBtn);
    }
  } else {
    $(obj.op.selector).find('input[type^="submit"]').removeClass(obj.op.disableBtn);
    if (obj.op.clickSubmit) {
      $(obj.op.clickSubmit).removeClass(obj.op.disableBtn);
    }
    if (this.op.submitCallBack !== '' && submit) {
      this.op.submitCallBack();
      return false;
    }
  }
  return check;
};

customFormValidation.prototype.returnRequiredProcessingValues = function(target, op, type) {
  /** initial value */
  type = typeof type === 'undefined' ? '' : type;

  var processingValues = {};
  processingValues.group = target.attr('validate-group');
  processingValues.msgError = target.attr('msgRequiredError') || op.msgRequiredError;
  processingValues.error = '<' + op.errorElement + ' class="' + op.error + ' error_required ' + processingValues.group + '">' + processingValues.msgError + '</' + op.errorElement + '>';
  processingValues.msgCorrect = target.attr('msgRequiredCorrect') || op.msgRequiredCorrect;
  processingValues.correct = '<' + op.correctElement + ' class="' + op.correct + ' ' + processingValues.group + '">' + processingValues.msgCorrect + '</' + op.correctElement + '>';
  processingValues.model = target.attr('validate-model');
  processingValues.position = target.attr('validate-position') || '';

  if (type == 'radio') {
    processingValues.value = 0;
    $('input[validate-model^="' + processingValues.model + '"]').each(function() {
      if ($(this).is(':checked')) {
        processingValues.value += 1;
      }
    });
    if (processingValues.value < 1) {
      processingValues.value = false;
    } else {
      processingValues.value = true;
    }
  } else if (type == 'checkbox') {
    processingValues.value = 0;
    $('input[validate-model^="' + processingValues.model + '"]').each(function() {
      if ($(this).is(':checked')) {
        processingValues.value += 1;
      }
    });
    var minNum = target.attr('data-required') || 0;
    var maxNum = target.attr('data-required-max') || 999999;
    if (minNum <= processingValues.value && processingValues.value <= maxNum) {
      processingValues.value = true;
    } else {
      processingValues.value = false;
    }
  } else if (type == 'file') {
    processingValues.value = !!target[0].files[0];
  } else {
    processingValues.value = $.trim(target.val());
    $('input[validate-model^="' + processingValues.model + '"]').each(function() {
      if (!$(this).val()) {
        processingValues.value = false;
      }
    });
  }
  return processingValues;
};

customFormValidation.prototype.returnRequiredResult = function(target, op, property, errorView, positionRelation) {
  /** initial value */
  var
    targetPosition = target,
    targetView = 'append';

  if (typeof positionRelation === 'undefined') {
    targetPosition = targetPosition.parent();
  } else {
    positionRelation = property.position != '' ? property.position : positionRelation;
    positionRelation = positionRelation.split('-');
    var i = 0;
    for (i; i < positionRelation.length; i++) {
      if (positionRelation[i] == 'parent') {
        targetPosition = targetPosition.parent();
      } else if (positionRelation[i] == 'next') {
        targetPosition = targetPosition.next();
      } else if (positionRelation[i] == 'prev') {
        targetPosition = targetPosition.prev();
      } else if (positionRelation[i] == 'append') {
        targetView = 'append';
      } else if (positionRelation[i] == 'prepend') {
        targetView = 'prepend';
      } else if (positionRelation[i] == 'after') {
        targetView = 'after';
      } else if (positionRelation[i] == 'before') {
        targetView = 'before';
      }
    }
  }

  /** return only */
  if (!errorView) {
    if (!property.value) {
      return false;
    } else {
      return true;
    }
  }

  /** error view */
  $(op.selector).find('.' + op.correct + '.' + property.group).remove();
  $(op.selector).parent().find('.' + op.error + '.error_required' + '.' + property.group).remove();
  if (!property.value) {
    if (op.addClassMode === true) {
      target.removeClass(op.classNameRequiredCorrect);
      target.addClass(op.classNameRequiredError);
    }
    if (targetView == 'append') {
      targetPosition.append(property.error);
    } else if (targetView == 'prepend') {
      targetPosition.prepend(property.error);
    } else if (targetView == 'after') {
      targetPosition.after(property.error);
    } else if (targetView == 'before') {
      targetPosition.before(property.error);
    }
    return false;
  } else {
    if (op.addClassMode === true) {
      target.removeClass(op.classNameRequiredError);
      target.addClass(op.classNameRequiredCorrect);
    }
    if (op.correctMsg === true) {
      if (targetView == 'append') {
        targetPosition.append(property.correct);
      } else if (targetView == 'prepend') {
        targetPosition.prepend(property.correct);
      } else if (targetView == 'after') {
        targetPosition.after(property.correct);
      } else if (targetView == 'before') {
        targetPosition.before(property.correct);
      }
    }
    return true;
  }

};
