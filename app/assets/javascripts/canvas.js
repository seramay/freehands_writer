window.addEventListener('load', function(){
  var stX;
  var stY;
  var ctX;
  var ctY;
  // [0]なしだと jQuery fn init というDOM要素の配列なので[0]に格納されているHTMLタグのみを取り出し
  var cvs = $("#canvas")[0];
  // 取り出したcanvas要素に描画用のメソッドを適用
  var conText = cvs.getContext("2d");
  // 線の太さ
  conText.lineWidth = 1;
  // 下記の2つで連続描画をした点の部分を補完させている。
  conText.lineJoin="round";
  conText.lineCap="round";
  // 画像オブジェクトを作成、srcに Rails gem 'gon'で取得した Base64データを代入
  var img = new Image();
  img.src = gon.post_image;
  // 上記画像オブジェクトをcanvasに設定
  img.onload = function(){
    conText.drawImage(img, 0, 0, 800, 600);
  }
  
  // ドラッグ状態を判断する変数を宣言。イベント発火OSS参考記事   https://keita-blog.com/programming/jquery-drag ///
  var is_drag = false;

  // 画像保存形式の処理、base64形式→blob形式へ変換、保存ボタンによる画像ダウンロード、投稿と保存は別でOK
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#Saving_images
// https://developer.mozilla.org/ja/docs/Web/API/Blob#使用例
// https://developer.mozilla.org/ja/docs/Web/API/URL/createObjectURL#Syntax
  function saveCanvas(){
    var imageType = "image/png";
    var base64 = cvs.toDataURL(imageType); // canvasタグのURLをbase64形式で取得
    var blob = base64toBlob(base64); // 下記関数にてbase64をblobデータに変換
    var url = (window.URL || window.webkitURL);
    var dataUrl = url.createObjectURL(blob); // ダウンロード用のURL作成
    var fileName = "sample.png";
    var a = document.getElementById('canvas-submit');
    a.href = dataUrl; // ダウンロード用のURLセット
    a.download = fileName; // ファイル名セット
  }

  function base64toBlob(base64){
    // カンマで分割してデータを配列で分けてtmpに代入、tmp[0]:データ形式(data:image/png;base64,)、tmp[1]:base64データ(iVBO~)
    var tmp = base64.split(',');
    // base64のデータをatobでデコード
    var data = atob(tmp[1]);
    // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得し代入(=> image/png;base64 => image/png)
    var mime = tmp[0].split(':')[1].split(';')[0];
    // 1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Typed_arrays
    var buf = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
      buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成  https://developer.mozilla.org/ja/docs/Web/API/Blob/Blob
    var blob = new Blob([buf.buffer], { type: mime });
    return blob;
  }
  $('#canvas-submit').on('click', function(){
    saveCanvas();
  });

  $('#canvas').on('mousedown', function(st) {
    // ドラッグを開始したら初期位置を座標で取得、ドラッグ状態を真とした真偽値を取得し代入。
    stX = st.offsetX;
    stY = st.offsetY;
    is_drag = true;
  });
  
  $('#canvas').on('mouseup mouseleave', function() {
    // ドラッグを終えたらドラッグ状態を偽とする
    is_drag = false;
  });

  /// 描画イベント参考記事   https://tnomura9.exblog.jp/12624562/, 他 MDNのcanvasチュートリアル
  $('#canvas').on('mousemove', function(ct) {
    // ドラッグ状態である場合、連続で発火する
    if (is_drag === true) {
    // 現在の位置を取得し、変数宣言。
      ctX = ct.offsetX;
      ctY = ct.offsetY;
    // 描画のためのパスを取得開始、もしくはリセット
      conText.beginPath();
    // 書き初めの位置を取得した変数を引数に渡し、動き始めた場所を「指定」
      conText.moveTo(stX, stY);
    // 現在地を引数として渡し、初期値から現在地までを引く場所を「指定」
      conText.lineTo(ctX, ctY);
    // 値をパスに取得させたら初期値を取得した変数の値は現在の位置を再代入する。closePathをした後でもいいのかもしれない
      stX = ctX;
      stY = ctY;
    // 線を引くパスはここで終了とする
      conText.closePath();
    // 線を引くパス(キャッシュ？)に「指定」された部分に対して「線を引く動作を実行」
      conText.stroke();
    }
  });
// TODO スタイルの本実装(色、太さ、透明度)

// TODO クリアボタン実装

// TODO 描画した画像をDBに保存
  $("#post_submit").on("click", function(e) {
    e.preventDefault();
    var base64 = cvs.toDataURL();
    $('#post_image').val(base64);
    $('#new_post').submit();
  });



// TEST 自由選択式にして各クリックイベントは統合する。
    $('.btn-black').on('click', function(){
      conText.strokeStyle = 'black';
    });
    $('.btn-red').on('click', function(){
      conText.strokeStyle = 'red';
    });
    $('.btn-green').on('click', function(){
      conText.strokeStyle = 'green';
    });
    $('.btn-blue').on('click', function(){
      conText.strokeStyle = 'blue';
    });
    $('.btn-white').on('click', function(){
      conText.strokeStyle = 'white';
    });
    $('.btn-thin').on('click', function(){
      conText.lineWidth = 1;
    });
    $('.btn-normal').on('click', function(){
      conText.lineWidth = 5;
    });
    $('.btn-bold').on('click', function(){
      conText.lineWidth = 15;
    });
    $('.btn-half').on('click', function(){
      conText.globalAlpha = 0.05;
    });
    $('.btn-solid').on('click', function(){
      conText.globalAlpha = 1;
    });
    $('.btn-sc_o_marker').on('click', function(){
      conText.strokeStyle = 'orange';
      conText.lineWidth = 15;
      conText.globalAlpha = 0.05;
    });
});

