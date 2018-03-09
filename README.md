customFormValidation
==========

フォームに簡単にvalidationを追加します。

Description
============

javascriptでオプションを設定し、html側は簡単なマークアップでvalidationを自動で追加します。
エラーメッセージを表示し、エラーのある部分までスクロールします。

Usage
===========

### 1. Download this javascript

javascriptファイルをダウンロードしてください

### 2. Require jQuery and this javascript

```
<script type="text/javascript">jquery.js</script>
<script type="text/javascript">customFormValidation.js</script>
```

### 3. Markup Html

#### 3-1.validate-model

属性validate-modelでvalidationの単体を表します。
関連性のあるものをグルーピング(checkbox,radio)し同じvalidate-modelを付ける場合もあります。

#### 3-2.required

必須項目の場合は属性`required`もしくは`class="Required"`とします

#### 3-3.required-error-message required-correct-message

個別に必須項目入力メッセージを指定する場合  
error   : `msgRequiredError="message"`  
correct : `msgRequiredCorrect="message"`  

#### 3-4.pattern

入力制限がある場合は`validate-pattern="正規表現"`にてパターンを入力します

#### 3-5.pattern-error-message pattern-correct-message

個別に入力制限エラーメッセージを指定する場合  
error   : `msgPatternError="message"`  
correct : `msgPatternCorrect="message"`  

#### 3-6.not same

Email二重入力チェックを指定する場合  
`not-same="TargetID"`

#### 3-7.not-same-error-message

個別に二重入力チェックエラーメッセージを指定する場合  
error   : `msgMailNotSameError="message"`  
correct : `msgMailNotSameCorrect="message"`  

#### ・EXAMPLE : input text

```
<input type="text" name="user_text" id="user_text" validate-model="user_text" autocomplete="off" required>
```

#### ・EXAMPLE : textarea

```
<textarea name="user_long_text" id="user_long_text" validate-model="user_long_text" rows="10" cols="95" autocomplete="off" required></textarea>
```

#### ・EXAMPLE : telnumber
validate-model でグルーピング  
```
<input type="tel" id="tel1" name="tel1" validate-model="telGroup-1" value="" maxlength="5" required>
<input type="tel" id="tel2" name="tel2" validate-model="telGroup-1" value="" maxlength="4" required>
<input type="tel" id="tel3" name="tel3" validate-model="telGroup-1" value="" maxlength="4" required>
```

#### ・EXAMPLE : MAIL
validate-pattern で入力制限  
not-same で二重チェック
```
<input type="email" id="user-email" name="user-email" validate-model="user-email" autocomplete="off" required msgPatternError="メールアドレスが正しくありません" validate-pattern="/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i" required>
<input type="email" id="user-email_ck" name="user-email_ck" validate-model="user-email_ck" autocomplete="off" not-same="user-email" required msgPatternError="メールアドレスが正しくありません" validate-pattern="/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i">
```

#### ・EXAMPLE : SELECT

```
<select id="type" name="type" required>
  <option value="" selected>選択してください</option>
  <option value="aaaa">aaaa</option>
  <option value="bbbb">bbbb</option>
  <option value="cccc">cccc</option>
</select>
```

#### ・EXAMPLE : CHECKBOX
単選択必須の場合はdata-requiredを1に設定  
複数選択必須の場合はdata-requiredを2以上に設定  
```
<input type="checkbox" name="status01" id="status01" class="Required" data-required="2" msgRequiredError="2つ以上選択してください" validate-model="checkBoxGroup-1" value="xxxxx" />
<input type="checkbox" name="status02" id="status02" class="Required" data-required="2" msgRequiredError="2つ以上選択してください" validate-model="checkBoxGroup-1" value="yyyyy" />
<input type="checkbox" name="status03" id="status03" class="Required" data-required="2" msgRequiredError="2つ以上選択してください" validate-model="checkBoxGroup-1" value="zzzzz" />
```

#### ・EXAMPLE : RADIO

```
<input type="radio" name="radioGroup-1" id="status001" class="Required" validate-model="radioGroup-1" value="xx" />
<input type="radio" name="radioGroup-1" id="status002" class="Required" validate-model="radioGroup-1" value="yy" />
```

### 4. Create Instance and Set Option

```
$(function(){
  var form = new customFormValidation({
    optionName:Value,
    optionName:Value,
    optionName:Value...
  });
  form.addValidation();
});
```

Options
===========

| optionName                  | defaultValue                     | Description                              |
| :-------------------------: | :------------------------------: | :--------------------------------------: |
| selector                    | `'#contactForm'`                 | auto validation の範囲を指定             |
| offset                      | `20`                             | エラー箇所自動スクロール時のoffset       |
| moveSpeed                   | `500`                            | エラー箇所自動スクロール時の速度         |
| easing                      | `'swing'`                        | エラー箇所自動スクロール時のモーション   |
| avoid                       | `'.__noValidation'`              | avoid auto validation selector           |
| disableBtn                  | `'btn_disabled'`                 | add disabledSubmitButton's className     |
| strongNotSame               | `true`                           | 強固な二重確認の有無(r-click paste 禁止) |
| syncValue                   | `false`                          | 値のシンクロをするか否か                 |
| startError                  | `false`                          | 初期フォームチェックをするか否か         |
| correctMsg                  | `false`                          | correctMessageを表示するか否か           |
| error                       | `'error_message'`                | add error_message's className            |
| errorElement                | `'span'`                         | error_message's tag                      |
| correct                     | `'error_message'`                | add correct_message's className          |
| correctElement              | `'span'`                         | correct_message's tag                    |
| msgRequiredError            | `'必須項目です'`                 | default required error message           |
| msgPatternError             | `'正しく入力してください'`       | default pattern error message            |
| msgMailNotSameError         | `'メールアドレスが一致しません'` | default not same error message           |
| msgRequiredCorrect          | `'入力済です'`                   | default required correct message         |
| msgPatternCorrect           | `'正しく入力されています'`       | default pattern correct message          |
| msgMailNotSameCorrect       | `'一致しています'`               | default not same correct message         |
| addClassMode                | `false`                          | 特定のクラスをつけるかどうか             |
| classNameRequiredError      | `'__RequiredError'`              | 必須チェックエラーのクラス名             |
| classNamePatternError       | `'__PatternError'`               | パターンチェックエラーのクラス名         |
| classNameMailNotSameError   | `'__MailNotSameError'`           | 同値チェックエラーのクラス名             |
| classNameRequiredCorrect    | `'__RequiredCorrect'`            | 必須チェックOKのクラス名                 |
| classNamePatternCorrect     | `'__PatternCorrect'`             | パターンチェックOKのクラス名             |
| classNameMailNotSameCorrect | `'__MailNotSameCorrect'`         | 同値チェックOKのクラス名                 |
| groupIdentificationPrefix   | `'__group_'`                     | グループ名の接頭辞                       |
| submitCallBack              | `''`                             | コールバック関数指定【Ajax使用FORMなど】(always return false) |

Updates
===========

** Version 1.0.14 **  
** bug fix . **
** labelwrap was abolished . **
** With this update, you can now set the checkbox's maximum number of checks. **
** and you can now specify the position to output messages with HTML markup. **

** Version 1.0.13 **  
** bug fix old browser . **

** Version 1.0.12 **  
** add labelWrap . **

** Version 1.0.11 **  
** add sync html . **

** Version 1.0.10 **  
** add sync bug fix . **

** Version 1.0.9 **  
** add sync value . **

** Version 1.0.8 **  
** add class mode . **

** Version 1.0.7 **  
** add pattern match . **

** Version 1.0.6 **  
** add file required . **  
** get value update . **  
** any bug fix . **

** Version 1.0.5 **  
** strongNotSame bug fix . **

** Version 1.0.4 **  
** start error bug fix . **

** Version 1.0.3 **  
** not same bug fix . **

** Version 1.0.2 **  
** add submitCallBack . **

** Version 1.0.1 **  
** add startError correctMsg . **

** Version 1.0.0 **  
** proto **


License
===========

[MIT License](https://github.com/TakashiKakizoe1109/customFormValidation/blob/master/LICENSE) © TakashiKakizoe
