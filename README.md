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

validate-modelでvalidationの単体を表します、
関連性のあるものをグルーピングし同じvalidate-modelを付ける場合もあります(checkbox,radio)

#### 3-2.required

必須項目の場合は属性`required`もしくは`class="Required"`とします

#### 3-3.required-error-message

個別に必須項目入力エラーメッセージを指定する場合は`msgRequired="メッセージ"`とします

#### 3-4.pattern

入力制限がある場合は`validate-pattern="正規表現"`にてパターンを入力します

#### 3-5.pattern-error-message

個別に入力制限エラーメッセージを指定する場合は`msgPattern="メッセージ"`とします

#### 3-6.not same

Email二重入力チェックなどには`not-same="ID名"`で紐づけて自動チェックを行います

#### 3-7.not-same-error-message

個別に二重入力チェックエラーメッセージを指定する場合は`msgMailNotSame="メッセージ"`とします

#### ・EXAMPLE : input text

```
<input type="text" name="user_text" id="user_text" validate-model="user_text" autocomplete="off" required>
```

#### ・EXAMPLE : textarea

```
<textarea name="user_long_text" id="user_long_text" validate-model="user_long_text" rows="10" cols="95" autocomplete="off" required></textarea>
```

#### ・EXAMPLE : telnumber

```
<input type="tel" id="tel1" name="tel1" validate-model="telGroup-1" value="" maxlength="5" required>
<input type="tel" id="tel2" name="tel2" validate-model="telGroup-1" value="" maxlength="4" required>
<input type="tel" id="tel3" name="tel3" validate-model="telGroup-1" value="" maxlength="4" required>
```

#### ・EXAMPLE : MAIL

```
<input type="email" id="user-email" name="user-email" validate-model="user-email" autocomplete="off" required msgPattern="メールアドレスが正しくありません" validate-pattern="/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i" required>
<input type="email" id="user-email_ck" name="user-email_ck" validate-model="user-email_ck" autocomplete="off" not-same="user-email" required msgPattern="メールアドレスが正しくありません" validate-pattern="/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i">
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

複数選択必須の場合はdata-requiredを2以上に設定してください

```
<input type="checkbox" name="status01" id="status01" class="Required" data-required="2" msgRequired="2つ以上選択してください" validate-model="checkBoxGroup-1" value="xxxxx" />
<input type="checkbox" name="status02" id="status02" class="Required" data-required="2" msgRequired="2つ以上選択してください" validate-model="checkBoxGroup-1" value="yyyyy" />
<input type="checkbox" name="status03" id="status03" class="Required" data-required="2" msgRequired="2つ以上選択してください" validate-model="checkBoxGroup-1" value="zzzzz" />
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

| optionName     | defaultValue                     | Description                              |
| :------------: | :------------------------------: | :--------------------------------------: |
| selector       | `'#contactForm'`                 | auto validation の範囲を指定             |
| offset         | `20`                             | エラー箇所自動スクロール時のoffset       |
| moveSpeed      | `500`                            | エラー箇所自動スクロール時の速度         |
| easing         | `'swing'`                        | エラー箇所自動スクロール時のモーション   |
| avoid          | `'.__noValidation'`              | avoid auto validation selector           |
| error          | `'error_message'`                | add error_message's className            |
| disableBtn     | `'btn_disabled'`                 | add disabledSubmitButton's className     |
| msgRequired    | `'必須項目です'`                 | default required error message           |
| msgPattern     | `'正しく入力してください'`       | default pattern error message            |
| msgMailNotSame | `'メールアドレスが一致しません'` | default not same error message           |
| strongNotSame  | `true`                           | 強固な二重確認の有無(r-click paste 禁止) |

License
===========

[MIT License](https://github.com/TakashiKakizoe1109/customFormValidation/blob/master/LICENSE) © TakashiKakizoe
