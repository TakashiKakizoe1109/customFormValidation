/*!
 * customFormValidation
 *
 *
 * @author: TakashiKakizoe
 * @author url: https://github.com/TakashiKakizoe1109
 * @version: 1.0.12
 *
 * Open source under the MIT License.
 * License url: https://raw.githubusercontent.com/TakashiKakizoe1109/customFormValidation/master/LICENSE
 *
 *
 */

var customFormValidation = function(op) {

  /** set options or default params */
  this.op = {} ;

  this.op.selector     = op.selector     || '#contactForm' ;
  this.op.offset       = op.offset       || 0 ;
  this.op.moveSpeed    = op.moveSpeed    || 500 ;
  this.op.easing       = op.easing       || 'swing' ;
  this.op.avoid        = op.avoid        || '.__noValidation' ;
  this.op.disableBtn   = op.disableBtn   || 'btn_disabled' ;

  this.op.strongNotSame  = op.strongNotSame === false ? false : true  ;
  this.op.labelWrap      = op.labelWrap     === false ? false : true  ;
  this.op.syncValue      = op.syncValue     === true  ? true  : false ;
  this.op.syncHtml       = op.syncHtml      === true  ? true  : false ;
  this.op.startError     = op.startError    === true  ? true  : false ;
  this.op.correctMsg     = op.correctMsg    === true  ? true  : false ;

  this.op.error          = op.error          || 'error_message' ;
  this.op.errorElement   = op.errorElement   || 'span' ;
  this.op.correct        = op.correct        || 'correct_message' ;
  this.op.correctElement = op.correctElement || 'span' ;

  this.op.msgRequiredError      = op.msgRequiredError      || '必須項目です' ;
  this.op.msgPatternError       = op.msgPatternError       || '正しく入力してください' ;
  this.op.msgMailNotSameError   = op.msgMailNotSameError   || 'メールアドレスが一致しません' ;
  this.op.msgRequiredCorrect    = op.msgRequiredCorrect    || '入力済です' ;
  this.op.msgPatternCorrect     = op.msgPatternCorrect     || '正しく入力されています' ;
  this.op.msgMailNotSameCorrect = op.msgMailNotSameCorrect || '一致しています' ;

  this.op.addClassMode                = op.addClassMode === true ? true : false  ;
  this.op.classNameRequiredError      = op.classNameRequiredError      = '__RequiredError' ;
  this.op.classNamePatternError       = op.classNamePatternError       = '__PatternError' ;
  this.op.classNameMailNotSameError   = op.classNameMailNotSameError   = '__MailNotSameError' ;
  this.op.classNameRequiredCorrect    = op.classNameRequiredCorrect    = '__RequiredCorrect' ;
  this.op.classNamePatternCorrect     = op.classNamePatternCorrect     = '__PatternCorrect' ;
  this.op.classNameMailNotSameCorrect = op.classNameMailNotSameCorrect = '__MailNotSameCorrect' ;

  this.op.submitCallBack        = op.submitCallBack        || '' ;

};

customFormValidation.prototype.addValidation = function() {
  var obj = this ;
  obj.allCheck = this.allCheck ;
  var target = '' ;

  /** elements search */
  $(obj.op.selector).find('select,input,textarea').not(obj.op.avoid).not('input[type^="submit"]').each(function(index, element){

    /** target element */
    var
    _t      = $(this),
    target  = $(this),
    htmlTag = element.localName,
    type    = _t.attr('type');

    /** defined relation */
    var rel = _t.attr('validate-model') || '__noValidation';
    rel = rel.split('.') ;
    rel = rel[0] ;
    _t.attr('validation-rel',rel);

    /** required */
    var required = !!_t.attr('required') ;
    required = required || _t.hasClass('Required') ;
    if (required) {
      if ( ((htmlTag=='textarea') || (htmlTag=='input'&&type=='text')) && _t.is(':visible') ) {
        _t.on('keyup blur',{obj:obj,target:target},obj.inputTextRequired);
      } else if ( ( htmlTag=='input' && type=='tel' ) && _t.is(':visible') ) {
        _t.on('keyup blur',{obj:obj,target:target},obj.inputTelRequired);
      } else if ( ( htmlTag=='input' && type=='email' ) && _t.is(':visible') ) {
        var retype = !_t.attr('not-same') ;
        if (retype) {
          _t.on('keyup blur',{obj:obj,target:target},obj.inputEmailRequired);
        } else {
          _t.on('keyup blur',{obj:obj,target:target},obj.inputEmailRetypeRequired);
        }
      } else if ( htmlTag=='select' && _t.is(':visible') ) {
        _t.on('change blur',{obj:obj,target:target},obj.selectBoxRequired);
      } else if ( (htmlTag=='input'&&type=='checkbox') && _t.parent().is(':visible') ) {
        _t.on('change',{obj:obj,target:target},obj.checkBoxRequired);
      } else if ( (htmlTag=='input'&&type=='radio') && _t.parent().is(':visible') ) {
        _t.on('change',{obj:obj,target:target},obj.radioRequired);
      } else if ( (htmlTag=='input'&&type=='file') && _t.parent().is(':visible') ) {
        _t.on('change',{obj:obj,target:target},obj.fileRequired);
      }
    }

    /** pattern */
    var pattern = !!_t.attr('validate-pattern');
    if (pattern) {
      _t.on('keyup blur',{obj:obj,target:target},obj.inputTextPattern);
    }

    /** not same */
    var not_same = _t.attr('not-same');
    if (!!not_same) {
      var _sameTarget = $('#'+not_same);
      _sameTarget.on('keyup blur',{obj:obj,_sameTarget:_sameTarget,_target:target},obj.inputTextNotSame);
      _t.on('keyup blur',{obj:obj,_sameTarget:_sameTarget,_target:target},obj.inputTextNotSame);
      if (obj.op.strongNotSame) {
        _t.css('user-select', 'none').on('copy paste contextmenu', false);
      }
    }

    /** sync value */
    if (obj.op.syncValue) {
      var syncValue = _t.attr('syncValue');
      var syncHtml  = _t.attr('syncHtml');
      if (!!syncValue || !!syncHtml) {
        if ( ((htmlTag=='textarea') || (htmlTag=='input'&&type=='text') || ( htmlTag=='input' && type=='email' ) || ( htmlTag=='input' && type=='tel' )) && _t.is(':visible') ) {
          _t.on('keyup blur',{obj:obj,target:target},obj.syncValueText);
        } else if ( (htmlTag=='select') && _t.is(':visible') ) {
          _t.on('change blur',{obj:obj,target:target},obj.syncValueSelect);
        } else if ( (htmlTag=='input'&&type=='radio') && _t.is(':visible') ) {
          _t.on('change blur',{obj:obj,target:target},obj.syncValueRadio);
        } else if ( (htmlTag=='input'&&type=='checkbox') && _t.is(':visible') ) {
          _t.on('change blur',{obj:obj,target:target},obj.syncValueCheckBox);
        }
      }
    }

  });

  /** submit */
  // $(obj.op.selector).submit({obj:obj},obj.allCheck);
  $(obj.op.selector).submit({obj:obj},function(){
    return obj.allCheck({data:{obj:obj}},true,true,true);
  });


  /** btn disabled */
  obj.allCheck({data:{obj:obj}},false,obj.op.startError);

};

customFormValidation.prototype.syncValueText = function(obj,errorView=true,allCheck=true)
{
  var syncValue = obj.data.target.attr('syncValue');
  var value = $.trim(obj.data.target.val());
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }

  var syncHtml  = obj.data.target.attr('syncHtml');
  var valueHTML = obj.data.target.attr('syncHtmlValue') || value ;
  syncHtml  = $(syncHtml);
  if (syncHtml.length && obj.data.obj.op.syncHtml) {
    syncHtml.html(valueHTML);
  }
}

customFormValidation.prototype.syncValueSelect = function(obj,errorView=true,allCheck=true)
{
  var syncValue = obj.data.target.attr('syncValue');
  var value = $.trim(obj.data.target.val());
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }

  var syncHtml  = obj.data.target.attr('syncHtml');
  var valueHTML = obj.data.target.attr('syncHtmlValue') || value ;
  syncHtml  = $(syncHtml);
  if (syncHtml.length && obj.data.obj.op.syncHtml) {
    syncHtml.html(valueHTML);
  }
}

customFormValidation.prototype.syncValueRadio = function(obj,errorView=true,allCheck=true)
{
  var syncValue  = obj.data.target.attr('syncValue');
  var syncHtml  = obj.data.target.attr('syncHtml');

  var model = obj.data.target.attr('validate-model');
  var value = '' ;
  var valueHTML = '' ;

  $('input[validate-model^="'+model+'"]').each(function(){
    if ($(this).is(':checked')) {
      value = $.trim($(this).val());
      valueHTML = $(this).attr('syncHtmlValue') || value;
    }
  });
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }
  syncHtml  = $(syncHtml);
  if (syncHtml.length && obj.data.obj.op.syncHtml) {
    syncHtml.html(valueHTML);
  }
}

customFormValidation.prototype.syncValueCheckBox = function(obj,errorView=true,allCheck=true)
{
  var syncValue  = obj.data.target.attr('syncValue');
  var model = obj.data.target.attr('validate-model');
  var value = '' ;
  $('input[validate-model^="'+model+'"]').each(function(){
    if ($(this).is(':checked')) {
      value += $.trim($(this).val()) + ' ';
    }
  });
  syncValue = $(syncValue);
  if (syncValue.length) {
    syncValue.val(value);
  }
}

customFormValidation.prototype.inputTextPattern = function(obj,errorView=true,allCheck=true)
{
  /**  */
  var id    = obj.data.target.attr('id');
  var msgError   = obj.data.target.attr('msgPatternError') || obj.data.obj.op.msgPatternError ;
  var error = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_pattern-'+id+'">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgPatternCorrect') || obj.data.obj.op.msgPatternCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+' correct_pattern-'+id+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var value = $.trim(obj.data.target.val());
  var model = obj.data.target.attr('validate-model');

  /** match */
  var match = false ;
  var pattern = obj.data.target.attr('validate-pattern');
  var checkVal = value ;
  var checkRegEx = '' ;

  if (pattern === 'yyyymmdd' ) {
    if (value.length === 8) {
      checkVal = value.substr(0,4) + '-' + value.substr(4,2) + '-' + value.substr(6,2) ;
      checkRegEx = /^\d{4}-\d{2}-\d{2}$/;
      if(checkVal.match(checkRegEx)){
        var d = new Date(checkVal);
        if(d.getTime() || d.getTime() === 0){
          match = true ;
        }
      }
    }
  } else if (pattern === 'yyyy-mm-dd') {
    checkRegEx = /^\d{4}-\d{2}-\d{2}$/;
    if(checkVal.match(checkRegEx)){
      var d = new Date(checkVal);
      if(d.getTime() || d.getTime() === 0){
        match = true ;
      }
    }
  } else if (pattern === 'email') {
    checkRegEx = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if(checkVal.match(checkRegEx)){
      match = true ;
    }
  } else {
    pattern = pattern.split('/');
    var regex = '' ;
    var flags = pattern[pattern.length-1];
    var regex_length = pattern.length - 1 ;
    for (var i = 1; i < regex_length; i++) {
      regex += pattern[i] ;
    }
    var regexp = new RegExp(regex,flags);
    match = value.match(regexp) ;
  }

  /** error place */
  var multi = !!($('input[validate-model="'+model+'"]').length - 1) ;

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_pattern-'+id).remove();
    if (match) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNamePatternError);
        obj.data.target.addClass(obj.data.obj.op.classNamePatternCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        if (multi) {
          obj.data.target.parent().append(correct);
        } else {
          obj.data.target.after(correct);
        }
      }
      return true ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNamePatternCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNamePatternError);
      }
      if (multi) {
        obj.data.target.parent().append(error);
      } else {
        obj.data.target.after(error);
      }
      return false ;
    }
  } else {
    if (match) {
      return true ;
    } else {
      return false ;
    }
  }

};

customFormValidation.prototype.inputTextNotSame = function(obj,errorView=true,allCheck=true)
{
  var id     = obj.data._target.attr('id');
  var msgError    = obj.data._target.attr('msgMailNotSameError') || obj.data.obj.op.msgMailNotSameError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_notsame-'+id+'">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data._target.attr('msgMailNotSameCorrect') || obj.data.obj.op.msgMailNotSameCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var target = $.trim(obj.data._sameTarget.val());
  var value  = $.trim(obj.data._target.val());

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView && (value!=''||target!='')) {
    obj.data._target.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data._sameTarget.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data._target.parent().find('.'+obj.data.obj.op.error+'.error_notsame-'+id).remove();
    obj.data._sameTarget.parent().find('.'+obj.data.obj.op.error+'.error_notsame-'+id).remove();
    if (value===target) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data._sameTarget.removeClass(obj.data.obj.op.classNameMailNotSameError);
        obj.data._sameTarget.addClass(obj.data.obj.op.classNameMailNotSameCorrect);
        obj.data._target.removeClass(obj.data.obj.op.classNameMailNotSameError);
        obj.data._target.addClass(obj.data.obj.op.classNameMailNotSameCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data._sameTarget.after(correct);
        obj.data._target.after(correct);
      }
      return true ;
    }else{
      if (obj.data.obj.op.addClassMode === true) {
        obj.data._sameTarget.removeClass(obj.data.obj.op.classNameMailNotSameCorrect);
        obj.data._sameTarget.addClass(obj.data.obj.op.classNameMailNotSameError);
        obj.data._target.removeClass(obj.data.obj.op.classNameMailNotSameCorrect);
        obj.data._target.addClass(obj.data.obj.op.classNameMailNotSameError);
      }
      obj.data._sameTarget.after(error);
      obj.data._target.after(error);
      return false ;
    }
  } else {
    if (value===target) {
      return true ;
    } else{
      return false ;
    }
  }

};

customFormValidation.prototype.inputTextRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var value = $.trim(obj.data.target.val());

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      obj.data.target.after(error);
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data.target.after(correct);
      }
      return true ;
    }
  } else {
    if (!value) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.inputTelRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var model = obj.data.target.attr('validate-model');
  var value = true ;
  $('input[validate-model^="'+model+'"]').each(function(){
    if (!$(this).val()) {
      value = false ;
    }
  });

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      obj.data.target.parent().append(error);
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data.target.parent().append(correct);
      }
      return true ;
    }
  } else {
    if (!value) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.inputEmailRetypeRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_email_retype_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var value = $.trim(obj.data.target.val());

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_email_retype_required').remove();
    if (!value) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      obj.data.target.after(error);
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data.target.after(correct);
      }
      return true ;
    }
  } else {
    if (!value) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.inputEmailRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var value = $.trim(obj.data.target.val());

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      obj.data.target.after(error);
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data.target.after(correct);
      }
      return true ;
    }
  } else {
    if (!value) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.selectBoxRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var value = $.trim(obj.data.target.val())

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      obj.data.target.parent().parent().append(error);
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data.target.parent().parent().append(correct);
      }
      return true ;
    }
  } else {
    if (!value) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.checkBoxRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var requiredNum = obj.data.target.attr('data-required');
  var model       = obj.data.target.attr('validate-model');
  var num = 0 ;
  $('input[validate-model^="'+model+'"]').each(function(){
    if ($(this).is(':checked')) {
      num += 1;
    }
  });

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (num < requiredNum) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      obj.data.target.parent().parent().append(error);
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data.target.parent().parent().append(correct);
      }
      return true ;
    }
  } else {
    if (num < requiredNum) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.radioRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var model = obj.data.target.attr('validate-model');
  var num = 0 ;
  var labelWrap  = obj.data.target.attr('labelWrap') || obj.data.obj.op.labelWrap ;
  $('input[validate-model^="'+model+'"]').each(function(){
    if ($(this).is(':checked')) {
      num += 1;
    }
  });

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    if (labelWrap) {
      obj.data.target.parent().parent().find('.'+obj.data.obj.op.correct).remove();
      obj.data.target.parent().parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    } else {
      obj.data.target.parent().find('.'+obj.data.obj.op.correct).remove();
      obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    }
    if (num < 1) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      if (labelWrap) {
        obj.data.target.parent().parent().append(error);
      } else {
        obj.data.target.parent().append(error);
      }
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        if (labelWrap) {
          obj.data.target.parent().parent().append(correct);
        } else {
          obj.data.target.parent().append(correct);
        }
      }
      return true ;
    }
  } else {
    if (num < 1) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.fileRequired = function(obj,errorView=true,allCheck=true)
{
  var msgError   = obj.data.target.attr('msgRequiredError') || obj.data.obj.op.msgRequiredError ;
  var error  = '<'+obj.data.obj.op.errorElement+' class="'+obj.data.obj.op.error+' error_required">'+msgError+'</'+obj.data.obj.op.errorElement+'>';
  var msgCorrect = obj.data.target.attr('msgRequiredCorrect') || obj.data.obj.op.msgRequiredCorrect ;
  var correct  = '<'+obj.data.obj.op.correctElement+' class="'+obj.data.obj.op.correct+'">'+msgCorrect+'</'+obj.data.obj.op.correctElement+'>';
  var model = obj.data.target.attr('validate-model');
  var file = !obj.data.target[0].files[0] ;

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.correct).remove();
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (file) {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredCorrect);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredError);
      }
      obj.data.target.parent().append(error);
      return false ;
    } else {
      if (obj.data.obj.op.addClassMode === true) {
        obj.data.target.removeClass(obj.data.obj.op.classNameRequiredError);
        obj.data.target.addClass(obj.data.obj.op.classNameRequiredCorrect);
      }
      if (obj.data.obj.op.correctMsg === true) {
        obj.data.target.parent().append(correct);
      }
      return true ;
    }
  } else {
    if (file) {
      return false ;
    } else {
      return true ;
    }
  }

};

customFormValidation.prototype.allCheck = function(e,move=true,errorView=true,submit=false){

  var move = move ;
  var errorView = errorView ;
  var obj = e.data.obj ;
  var target = '' ;
  var check = true ;
  var moveTarget = '' ;

  $(obj.op.selector).find('select,input,textarea').not(obj.op.avoid).not('input[type^="submit"]').each(function(index, element){

    var singleCheck = true ;

    /** target element */
    var _t  = $(this);
    target = _t ;
    var targetTop = _t ;
    var htmlTag = element.localName;
    var type    = _t.attr('type');

    /** required */
    var required = !!_t.attr('required') ;
    required = required || _t.hasClass('Required') ;
    if (required) {
      if ( ((htmlTag=='textarea') || (htmlTag=='input'&&type=='text')) && _t.is(':visible') ) {
        singleCheck = obj.inputTextRequired({data:{obj:obj,target:target}},errorView,false);
      } else if ( ( htmlTag=='input' && type=='tel' ) && _t.is(':visible') ) {
        singleCheck = obj.inputTelRequired({data:{obj:obj,target:target}},errorView,false);
      } else if ( ( htmlTag=='input' && type=='email' ) && _t.is(':visible') ) {
        var retype = !_t.attr('not-same') ;
        if (retype) {
          singleCheck = obj.inputEmailRequired({data:{obj:obj,target:target}},errorView,false);
        } else {
          singleCheck = obj.inputEmailRetypeRequired({data:{obj:obj,target:target}},errorView,false);
        }
      } else if ( htmlTag=='select' && _t.is(':visible') ) {
        singleCheck = obj.selectBoxRequired({data:{obj:obj,target:target}},errorView,false);
      } else if ( (htmlTag=='input'&&type=='checkbox') && _t.parent().is(':visible') ) {
        targetTop = _t.parent();
        singleCheck = obj.checkBoxRequired({data:{obj:obj,target:target}},errorView,false);
      } else if ( (htmlTag=='input'&&type=='radio') && _t.parent().is(':visible') ) {
        targetTop = _t.parent();
        singleCheck = obj.radioRequired({data:{obj:obj,target:target}},errorView,false);
      } else if ( (htmlTag=='input'&&type=='file') && _t.parent().is(':visible') ) {
        singleCheck = obj.fileRequired({data:{obj:obj,target:target}},errorView,false);
      }

    }

    /** pattern */
    var pattern = !!_t.attr('validate-pattern');
    if (pattern) {
      singleCheck = obj.inputTextPattern({data:{obj:obj,target:target}},errorView,false);
    }

    /** not same */
    var not_same = _t.attr('not-same');
    if (!!not_same) {
      var _sameTarget = $('#'+not_same);
      singleCheck = obj.inputTextNotSame({data:{obj:obj,_sameTarget:_sameTarget,_target:target}},errorView,false);
    }

    // console.log('singleCheck:'+singleCheck+' '+htmlTag+':'+type);
    if (!singleCheck && moveTarget === '') {
      moveTarget = targetTop.offset().top-obj.op.offset ;
    }
    check = check && !!singleCheck;

  });

  if (!check && move) {
    $('body,html').stop().animate(
      {scrollTop: moveTarget},
      obj.op.moveSpeed ,
      obj.op.easing
    );
  }

  moveTarget = '' ;

  if (!check) {
    $(obj.op.selector).find('input[type^="submit"]').addClass(obj.op.disableBtn);
  } else {
    $(obj.op.selector).find('input[type^="submit"]').removeClass(obj.op.disableBtn);
    if (this.op.submitCallBack !== '' && submit) {
      this.op.submitCallBack();
      return false ;
    }
  }
  return check ;
};
