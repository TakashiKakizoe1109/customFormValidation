/*!
 * customFormValidation
 *
 *
 * @author: TakashiKakizoe
 * @author url: https://github.com/TakashiKakizoe1109
 * @version: 1.0.0
 *
 * Open source under the MIT License.
 * License url: https://raw.githubusercontent.com/TakashiKakizoe1109/customFormValidation/master/LICENSE
 *
 *
 */

var customFormValidation = function(op) {

  /** set options or default params */
  this.op = {} ;

  this.op.selector    = op.selector    || '#contactForm' ;
  this.op.offset      = op.offset      || 0 ;
  this.op.moveSpeed   = op.moveSpeed   || 500 ;
  this.op.easing      = op.easing      || 'swing' ;
  this.op.avoid       = op.avoid       || '.__noValidation' ;
  this.op.error       = op.error       || 'error_message' ;
  this.op.disableBtn  = op.disableBtn  || 'btn_disabled' ;

  this.op.msgRequired    = op.msgRequired    || '必須項目です' ;
  this.op.msgPattern     = op.msgPattern     || '正しく入力してください' ;
  this.op.msgMailNotSame = op.msgMailNotSame || 'メールアドレスが一致しません' ;
  this.op.strongNotSame  = op.strongNotSame  || true ;

};

customFormValidation.prototype.addValidation = function() {
  var obj = this ;
  obj.allCheck = this.allCheck ;
  var target = '' ;

  /** elements search */
  $(obj.op.selector).find('select,input,textarea').not('.__noValidation').not('input[type^="submit"]').each(function(index, element){

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

  });

  /** submit */
  $(obj.op.selector).submit({obj:obj},obj.allCheck);

  /** btn disabled */
  obj.allCheck({data:{obj:obj}},false,false);

};

customFormValidation.prototype.inputTextPattern = function(obj,errorView=true,allCheck=true)
{
  var id    = obj.data.target.attr('id');
  var msg   = obj.data.target.attr('msgPattern') || obj.data.obj.op.msgPattern ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_pattern-'+id+'" />').append(msg);
  var value = obj.data.target.val();

  var pattern = obj.data.target.attr('validate-pattern');
  pattern = pattern.split('/');
  var regex = '' ;
  var flags = pattern[pattern.length-1];
  for (var i = 1; i < pattern.length - 1; i++) {
    regex += pattern[i] ;
  }
  var regexp = new RegExp(regex,flags);

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_pattern-'+id).remove();
    if (value.match(regexp)) {
      return true ;
    }else{
      obj.data.target.after(error);
      return false ;
    }
  } else if (value.match(regexp)) {
    return true ;
  } else {
    return false ;
  }

};

customFormValidation.prototype.inputTextNotSame = function(obj,errorView=true,allCheck=true)
{
  var id     = obj.data._target.attr('id');
  var msg    = obj.data._target.attr('msgMailNotSame') || obj.data.obj.op.msgMailNotSame ;
  var error  = '<p class="'+obj.data.obj.op.error+' error_notsame-'+id+'">'+msg+'</p>';
  var target = obj.data._sameTarget.val();;
  var value  = obj.data._target.val();

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data._target.parent().find('.'+obj.data.obj.op.error+'.error_notsame-'+id).remove();
    obj.data._sameTarget.parent().find('.'+obj.data.obj.op.error+'.error_notsame-'+id).remove();
    if (value===target) {
      return true ;
    }else{
      obj.data._sameTarget.after(error);
      obj.data._target.after(error);
      return false ;
    }
  } else if (value===target) {
    return true ;
  } else{
    return false ;
  }

};

customFormValidation.prototype.inputTextRequired = function(obj,errorView=true,allCheck=true)
{
  var msg   = obj.data.target.attr('msgRequired') || obj.data.obj.op.msgRequired ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_required" />').append(msg);
  var value = obj.data.target.val();

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      obj.data.target.parent().append(error);
      return false ;
    } else {
      return true ;
    }
  } else if (!value) {
    return false ;
  } else {
    return true ;
  }

};

customFormValidation.prototype.inputTelRequired = function(obj,errorView=true,allCheck=true)
{
  var msg   = obj.data.target.attr('msgRequired') || obj.data.obj.op.msgRequired ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_required" />').append(msg);
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
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      obj.data.target.parent().append(error);
      return false ;
    } else {
      return true ;
    }
  } else if (!value) {
    return false ;
  } else {
    return true ;
  }

};

customFormValidation.prototype.inputEmailRetypeRequired = function(obj,errorView=true,allCheck=true)
{
  var msg   = obj.data.target.attr('msgRequired') || obj.data.obj.op.msgRequired ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_email_retype_required" />').append(msg);
  var value = obj.data.target.val();

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_email_retype_required').remove();
    if (!value) {
      obj.data.target.after(error);
      return false ;
    } else {
      return true ;
    }
  } else if (!value) {
    return false ;
  } else {
    return true ;
  }

};

customFormValidation.prototype.inputEmailRequired = function(obj,errorView=true,allCheck=true)
{
  var msg   = obj.data.target.attr('msgRequired') || obj.data.obj.op.msgRequired ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_required" />').append(msg);
  var value = obj.data.target.val();

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      obj.data.target.after(error);
      return false ;
    } else {
      return true ;
    }
  } else if (!value) {
    return false ;
  } else {
    return true ;
  }

};

customFormValidation.prototype.selectBoxRequired = function(obj,errorView=true,allCheck=true)
{
  var msg   = obj.data.target.attr('msgRequired') || obj.data.obj.op.msgRequired ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_required" />').append(msg);
  var value = obj.data.target.val();

  if (allCheck) {
    obj.data.obj.allCheck({data:{obj:obj.data.obj}},false,false);
  }

  if (errorView) {
    obj.data.target.parent().parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (!value) {
      obj.data.target.parent().parent().append(error);
      return false ;
    } else {
      return true ;
    }
  } else if (!value) {
    return false ;
  } else {
    return true ;
  }

};

customFormValidation.prototype.checkBoxRequired = function(obj,errorView=true,allCheck=true)
{
  var msg   = obj.data.target.attr('msgRequired') || obj.data.obj.op.msgRequired ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_required" />').append(msg);
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
    obj.data.target.parent().parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (num < requiredNum) {
      obj.data.target.parent().parent().append(error);
      return false ;
    } else {
      return true ;
    }
  } else if (num < requiredNum) {
    return false ;
  } else {
    return true ;
  }

};

customFormValidation.prototype.radioRequired = function(obj,errorView=true,allCheck=true)
{
  var msg   = obj.data.target.attr('msgRequired') || obj.data.obj.op.msgRequired ;
  var error = $('<p class="'+obj.data.obj.op.error+' error_required" />').append(msg);
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
    obj.data.target.parent().parent().find('.'+obj.data.obj.op.error+'.error_required').remove();
    if (num < 1) {
      obj.data.target.parent().parent().append(error);
      return false ;
    } else {
      return true ;
    }
  } else if (num < 1) {
    return false ;
  } else {
    return true ;
  }

};

customFormValidation.prototype.allCheck = function(e,move=true,errorView=true){

  var move = move ;
  var errorView = errorView ;
  var obj = e.data.obj ;
  var target = '' ;
  var check = true ;
  var moveTarget = '' ;

  $(obj.op.selector).find('select,input,textarea').not('.__noValidation').not('input[type^="submit"]').each(function(index, element){

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
  }
  return check ;
};
