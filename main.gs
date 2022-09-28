function setTrigger(){
    const time = new Date();
    time.setHours(14);
    time.setMinutes(30);
    ScriptApp.newTrigger('scraping').timeBased().at(time).create();
  }
  
  var CHANNEL_ACCESS_TOKEN = 'slackワークスペースのトークン'; // Channel_access_tokenを登録
  
  function scraping() {
    var url = 'https://www.rikako-ikee.jp/';
    var response = UrlFetchApp.fetch(url);//JavaScript で動的にコンテンツを生成しているサイトでは UrlFetchApp でコンテンツを取得できない。
    console.log("response: ",response)
    var json = response.getContentText();
    //console.log("json: ",json)
    var link0 = find(json, 'INFORMATION</h2>','</div>');
    console.log("link0:",link0)
    var link = find(link0, '</time>','<div>');
    var info = find(link,'<a href="','">');
    console.log("info is ",info)
    var header = find(link0,'<span class="title">','</span>');
    console.log("title",header)
    
    
    var sheet = SpreadsheetApp.getActiveSheet(); 
    console.log("sheet: ",sheet)
    var lastRow = sheet.getLastRow();
    console.log("lastRow: ",lastRow)
    var range = sheet.getDataRange();// そのシート上の値が存在するセル範囲を取得
    var range = sheet.getDataRange();// そのシート上の値が存在するセル範囲を取得
    var values = range.getValues();// そのセル範囲にある値の多次元配列を取得
    var matchflag = false
    for (var i = 0; i < values.length; i++) {
        //console.log("val",values[i][0])
        pre_info = values[i][0]
        if (info == pre_info){
        console.log("matched!")
        matchflag = true
        }
    }
    //var pre_info = sheet.getRange(lastRow,1).getValue();
    //console.log("pre_info is ",pre_info)
    
    var post_url = "https://hooks.slack.com/services/"+"チャンネル情報"; //postメソッドのurl
    
    
    if(!matchflag){//更新
      sheet.getRange(lastRow+1, 1).setValue(info);
      sheet.getRange(lastRow+1, 2).setValue(header);
      var jsondata = {
        "text": header+'\n'+info,
        "attachments": attachments, //リッチなメッセージを送る用データ
      }
      
      var payload = JSON.stringify(jsondata);
      
      var attachments = JSON.stringify([
        {
          title_link: info,
          text: "上記リンクをクリックすると対象のページやファイルを表示します。" //インデント内に表示されるテキスト
        }
      ]);
      
      var options = {
          "method": "post",
          "contentType": "application/json",
          "payload":payload,
      };
      
      UrlFetchApp.fetch(post_url, options);
  
    }
    
  }
  
  function find(text, from, to) {
    var fromIndex = text.indexOf(from);//textの中からfromを見つける。返り値はindex
    if (fromIndex === -1) return '';
    text = text.substring(fromIndex + from.length);
    //console.log("text is ",from,"\n",text)
    var toIndex = text.indexOf(to);
    if (toIndex === -1) return '';
    console.log(from,"and ",to, "of return is ","\n",text.substring(0, toIndex))
    return text.substring(0, toIndex);
  }
  
  
