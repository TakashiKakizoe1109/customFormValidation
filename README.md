customFormValidation
==========

You can easily add jQuery-based validation to your form.  
フォームにjQueryベースのvalidationを簡単に追加できます。  

Description
============

Set options with javascript, html can easily add validation with simple markup.  
If there is an error scroll to the place where there is an error.  

javascriptでオプションを設定、htmlは簡単なマークアップでvalidationを自動で追加できます。  
エラーがある場合はエラーのある箇所までスクロールします。

Usage
===========

### 1. Download this javascript

javascriptファイルをダウンロードしてください

### 2. Require jQuery and this javascript

```
<script type="text/javascript">jquery.js</script>
<script type="text/javascript">customFormValidation.js</script>
```

Markup Html
===========

#### ■ validate-model

The validate range is expressed with the attribute validate-model.  
Grouping if it is relevant (checkbox, radio, tel, fax, postalcode etc).  

属性validate-modelでvalidationの範囲を表します。  
関連性のあるもの(checkbox,radio,tel,fax,postalcode 等)であればグルーピングします。  

ex.
```
<input type="text" validate-model="org_name" name="org_name" id="org_name" value="">
```

#### ■ validate-position

The attribute validate-position specifies the output location of the message.  
Based on the markup element, input the following by a hyphen (-).  

属性validate-positionでメッセージの出力場所を指定します。  
マークアップ要素をベースに以下をハイフン(-)で繋げて入力します。  

| 属性値 | 説明 |
| :--: | :----: |
| parent | 親要素を指定 |
| next | 兄弟次要素を指定 |
| prev | 兄弟前要素を指定 |
| append | 子要素として最後に出力 |
| prepend | 子要素として最初に出力 |
| after | 兄弟要素として後ろに出力 |
| before | 兄弟要素として前に出力 |

ex.
```
<input type="text" validate-position="parent-parent-append" name="org_name" id="org_name" value="">
```

#### ■ required

If required, attribute `required` or` class = "Required" `  

必須項目の場合は属性`required`もしくは`class="Required"`  

ex.
```
<input type="text" validate-model="user_name" name="user_name" id="user_name" value="" required>

<select class="Required" name="user_select" validate-model="user_select">
  <option value="">no select</option>
  <option value="001"  >001</option>
  <option value="002"  >002</option>
  <option value="002"  >002</option>
</select>
```

#### ■ required-error-message required-correct-message

Required, specify individual output messages    

必須項目出力メッセージを個別指定  

| 属性値 | 説明 |
| :--: | :----: |
| msgRequiredError | 必須エラー時のメッセージ属性 |
| msgRequiredCorrect | 必須OK時のメッセージ属性 |

ex.
```
<input type="text" msgRequiredError="必須" msgRequiredCorrect="入力済" validate-model="user_name" name="user_name" id="user_name" value="" required>
```

#### ■ validate-pattern

入力制限がある場合は`validate-pattern="正規表現"`にてパターンを入力します。  
以下は自動的に正規表現チェックをかける文字列です。

| 属性 | 値 | 説明 |
| :--: | :--: | :----: |
| validate-pattern | 正規表現 | 要素に正規表現パターンでの正誤チェックをかけます |
| validate-pattern | 'yyyymmdd' | yyyymmddの正誤チェック |
| validate-pattern | 'yyyy-mm-dd' | yyyy-mm-ddの正誤チェック |
| validate-pattern | 'email' | メールアドレスパターンの正誤チェック |

ex.
```
<input id="user_email" name="user_email" value="" validate-model="user_email" validate-pattern="/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i" type="email" required>
```

#### ■ pattern-error-message pattern-correct-message

個別にパターン制限エラーメッセージを指定する場合  

| 属性値 | 説明 |
| :--: | :----: |
| msgPatternError | パターンエラー時のメッセージ属性 |
| msgPatternCorrect | パターンOK時のメッセージ属性 |

ex.
```
<input type="text" msgPatternError="正しく入力してください" msgPatternCorrect="正しく入力されています" validate-model="user_name" name="user_name" id="user_name" value="" required>
```


#### ■ not-same

Email二重入力チェックをする場合に指定します。  

| 属性 | 値 | 説明 |
| :--: | :--: | :----: |
| not-same | TargetID | 属性not-sameにターゲットとなるIDを入力してください |

ex.
```
<input id="user_email" name="user_email" value="" validate-model="user_email" validate-pattern="/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i" type="email" required>
<input id="user_email_ck" name="user_email_ck" value="" validate-model="user_email_ck" not-same="user_email" validate-pattern="/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i" type="email" required>

```

#### ■ not-same-error-message not-same-correct-message

個別に二重入力チェックエラーメッセージを指定する場合  

| 属性値 | 説明 |
| :--: | :----: |
| msgMailNotSameError | 二重チェックエラー時のメッセージ属性 |
| msgMailNotSameCorrect | 二重チェックOK時のメッセージ属性 |

#### ■ syncValue

別のフォーム要素の属性valueに値を同期する場合に使用します。  
※実際にバックエンドに送る場合のタグがmodal内のhiddenである場合などに利用。  

| 属性 | 値 | 説明 |
| :--: | :--: | :----: |
| syncValue | セレクター | 属性syncValueにターゲット要素のセレクターを入力してください |

ex.
```
<textarea class="form-control" syncValue="#contact_content" rows="3"></textarea>
<input type="hidden" id="contact_content" name="contact_content" value="">
```

#### ■ syncHtml

別のhtml要素に値を同期する場合に使用します。  
※実際にバックエンドに送る前に確認modaが出る¥場合などに利用。  

| 属性 | 値 | 説明 |
| :--: | :--: | :----: |
| syncHtml | セレクター | 属性syncHtmlにターゲット要素のセレクターを入力してください |

ex.
```
<input class="form-check-input Required" name="gender" validate-model="gender" type="radio" syncHtml="#genderTarget" value="女性" checked>
<input class="form-check-input Required" name="gender" validate-model="gender" type="radio" syncHtml="#genderTarget" value="男性">
<p>性別：<span id="genderTarget"></span></p>
```

Markup Html Example
===========

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
複数選択必須の場合で最大値が決まっている場合はdata-required-maxを指定  

```
<input type="checkbox" name="status01" id="status01" class="Required" data-required="2" msgRequiredError="2つ以上選択してください" validate-model="checkBoxGroup-1" value="xxxxx" />
<input type="checkbox" name="status02" id="status02" class="Required" data-required="2" msgRequiredError="2つ以上選択してください" validate-model="checkBoxGroup-1" value="yyyyy" />
<input type="checkbox" name="status03" id="status03" class="Required" data-required="2" msgRequiredError="2つ以上選択してください" validate-model="checkBoxGroup-1" value="zzzzz" />
```

#### ・EXAMPLE : RADIO

validate-model でグルーピング  

```
<input type="radio" name="radioGroup-1" id="status001" class="Required" validate-model="radioGroup-1" value="xx" />
<input type="radio" name="radioGroup-1" id="status002" class="Required" validate-model="radioGroup-1" value="yy" />
```

#### ・EXAMPLE : FILE

```
<input type="file" id="inpuFile" class="Required" name="file">
```

Create Instance and Set Options
===========

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
| syncHtml                    | `false`                          | HTMLのシンクロをするか否か               |
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

#### Version 1.0.14
bug fix .  
labelwrap was abolished .  
With this update, you can now set the checkbox's maximum number of checks.  
and you can now specify the position to output messages with HTML markup.  

#### Version 1.0.13
bug fix old browser .  

#### Version 1.0.12
add labelWrap .  

#### Version 1.0.11
add sync html .  

#### Version 1.0.10
add sync bug fix .

#### Version 1.0.9
add sync value .

#### Version 1.0.8
add class mode .

#### Version 1.0.7
add pattern match .

#### Version 1.0.6
add file required .  
get value update .  
any bug fix .  

#### Version 1.0.5
strongNotSame bug fix .  

#### Version 1.0.4
start error bug fix .  

#### Version 1.0.3
not same bug fix .  

#### Version 1.0.2
add submitCallBack .

#### Version 1.0.1
add startError correctMsg .

#### Version 1.0.0
proto

License
===========

[MIT License](https://github.com/TakashiKakizoe1109/customFormValidation/blob/master/LICENSE) © TakashiKakizoe
