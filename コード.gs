// データベースとなるGoogleスプレッドシートを取得
var spreadsheet = SpreadsheetApp.openById("1wi-Hll7TJE1jUBFQwFDT7C0SKcYEBiERbk3e2fG0ZrI");
// ユーザの情報を格納する変数
var inputName;
var inputEmail;
var inputPassword;

// ユーザ登録メソッド
function registerUser() {
  var select = Browser.msgBox("ユーザ登録をします。", Browser.Buttons.OK_CANCEL);

  // 「OK」をクリックすると進む
  if (select == "ok")
  {
    inputName = Browser.inputBox("ニックネームを入力してください。", Browser.Buttons.OK_CANCEL);
    
    // ニックネームを入力して「OK」をクリックすると進む → 空欄ではない && 「キャンセル」ではない
    if (inputName != "" && inputName != "cancel")
    {
      inputEmail = Browser.inputBox("メールアドレスを入力してください。", Browser.Buttons.OK_CANCEL);

      // メールアドレスを入力して「OK」をクリックすると進む → 空欄ではない && 「キャンセル」ではない
      if (inputEmail != "" && inputEmail != "cancel")
      {
        // ユーザ情報のシートを取得
        var userSheet = spreadsheet.getSheetByName('User_information');
        // ユーザ情報のシートを最終行まで探索
        for (var i = 1; i <= userSheet.getLastRow(); i++)
        {
          // シート2列目のメールアドレスとinputEmailを照合して、同じメールアドレスだった場合
          if (userSheet.getRange(i, 2).getValue() == inputEmail)
          {
            Browser.msgBox("そのメールアドレスは既に登録されています。", Browser.Buttons.OK);
            return;
          }
        }
        inputPassword = Browser.inputBox("パスワードを設定してください。", Browser.Buttons.OK_CANCEL);

        // パスワードを入力して「OK」をクリックすると進む → 空欄ではない && 「キャンセル」ではない
        if (inputPassword != "" && inputPassword != "cancel")
        {
          // MD5メソッドでパスワードをハッシュ化して、ハッシュ化パスワード変数に格納
          var hashPassword = MD5(inputPassword);

          /* 登録確認のメール内容 */
          // 件名
          const subject = '料理記録アプリによる登録確認';
          // 本文
          var body = "";
          body += `${inputName}様\n\n`;
          body += `料理記録アプリからの登録確認です。\n`;
          body += `パスワード：${inputPassword}\n\n`;
          body += `下記のURLから登録を完了できます。\n`;
          // (inputName, inputEmail, hashPassword)をパラメータとして、doGetメソッドに渡す
          body += `https://script.google.com/macros/s/AKfycbxX1FVIq4rF9BYn7loYYuzpIEjYSjAPHYbnOucQTLhcdQhr9vzSO89_hpsvc4gByVrHWA/exec?p1=${inputName}&p2=${inputEmail}&p3=${hashPassword}`;
          // オプション（送信元の名前を設定）
          const options = {name: '料理記録アプリ'};

          // メールを送信
          GmailApp.sendEmail(inputEmail, subject, body, options);

          Browser.msgBox("確認のため、メールをお送りします。", Browser.Buttons.OK);
        }
      } // メールアドレスが空欄である場合
      else if (inputName == "")
      {
        Browser.inputBox("メールアドレスが未入力です。", Browser.Buttons.CANCEL);
      }
    } // ニックネームが空欄である場合
    else if (inputName == "")
    {
      Browser.inputBox("ニックネームが未入力です。", Browser.Buttons.CANCEL);
    }
  }
}

// ユーザ登録のdoGetメソッド
function doGet(e) {
  // パラメータをユーザ情報の変数に格納
  inputName = e.parameter.p1;
  inputEmail = e.parameter.p2;
  inputPassword = e.parameter.p3;

  // ユーザ情報のシートを取得
  var userSheet = spreadsheet.getSheetByName('User_information');
  // HTMLのbody
  var body = "";

  // ユーザ情報のシートを最終行まで探索
  for (var i = 1; i <= userSheet.getLastRow(); i++)
  {
    // シート2列目のメールアドレスとinputEmailを照合して、同じメールアドレスだった場合
    if (userSheet.getRange(i, 2).getValue() == inputEmail)
    {
      body += `${inputName}様\n\n`;
      body += `既に登録は完了しています。`;
      return ContentService.createTextOutput(body);
    }
  }

  // ユーザ情報の最終行
  i = userSheet.getLastRow();
  // ユーザ情報を登録
  userSheet.getRange(i+1, 1).setValue(inputName);
  userSheet.getRange(i+1, 2).setValue(inputEmail);
  userSheet.getRange(i+1, 3).setValue(inputPassword);
  userSheet.getRange(i+1, 4).setValue(`シート${i}`);

  // 新しいデータベースのシートを作成
  var newSheet = spreadsheet.insertSheet(`シート${i}`, i+2);
  // データベースの設定
  newSheet.getRange(1, 1).setValue("日付");       // カレンダー入力
  newSheet.getRange(1, 2).setValue("時間帯");     // ラジオボタン入力(朝・昼・夜)
  newSheet.getRange(1, 3).setValue("料理名");     // フォーム入力
  newSheet.getRange(1, 4).setValue("自炊or外食"); // ラジオボタン入力
  newSheet.getRange(1, 5).setValue("満足度");     // 5段階評価
  newSheet.getRange(1, 6).setValue("何人前");     // 任意
  newSheet.getRange(1, 7).setValue("材料1");      // 任意
  newSheet.getRange(1, 8).setValue("分量1");      // 材料1で入力がある場合
  newSheet.getRange(1, 9).setValue("材料2");      // 任意
  newSheet.getRange(1, 10).setValue("分量2");     // 材料2で入力がある場合
  newSheet.getRange(1, 11).setValue("材料3");     // 任意
  newSheet.getRange(1, 12).setValue("分量3");     // 材料3で入力がある場合
  newSheet.getRange(1, 13).setValue("材料4");     // 任意
  newSheet.getRange(1, 14).setValue("分量4");     // 材料4で入力がある場合
  newSheet.getRange(1, 15).setValue("材料5");     // 任意
  newSheet.getRange(1, 16).setValue("分量5");     // 材料5で入力がある場合

  body += `${inputName}様\n\n`;
  body += `登録が完了しました。`;
  return ContentService.createTextOutput(body);
}

// 料理を登録するメソッド
function registerDish() {
}

// 料理を提案するメソッド
function suggestDish() {
}

// パスワードをMD5でハッシュ化するメソッド
function MD5(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input, Utilities.Charset.UTF_8);
  var txtHash = '';
  for (i = 0; i < rawHash.length; i++) {
    var hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  
  return txtHash;
}