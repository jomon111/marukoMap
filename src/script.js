//ベースマップ
let gsi = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
let gsi_awai = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
let gsi_eisei = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
let osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&amp;copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
let illust = new L.tileLayer('./tiles/{z}/{x}/{y}.png',{
    maxZoom:20,
    minZoom:18
});

//ライブカメラ位置、オーバレイ画像
let liveCam = L.geoJSON(livecam,{
    onEachFeature: function(feature, layer){
        layer.bindPopup('<a href="'+ feature.properties.URL + '">' + feature.properties.名称 + 'の河川カメラ' + '</a>');
    },
    pointToLayer: function (feature, coordinates) {
        return L.marker(coordinates, {icon:
            L.AwesomeMarkers.icon({
                icon: 'fa-video',
                markerColor: 'darkblue',
                prefix: 'fa',
            })
        })
    },
    attribution: "<a href='http://www3.doboku-bousai.pref.kagoshima.jp/bousai/jsp/index.jsp'>鹿児島県土木部</a>※位置は個人調査"
});

//マーカー
let sanchanIcon = L.icon({
	iconUrl:'./assets/sanchan.png',
	iconRetinaUrl:'./assets/sanchan.png',
	iconSize:[100,100],
	iconAnchor:[50,80],
	popupAnchor:[0,-70]
});
let comment = '三ちゃん食堂';

//ベースマップ
let baseLayers = {
    "地理院地図 標準": gsi,
    "地理院地図 淡色": gsi_awai,
    "地理院地図 衛星画像": gsi_eisei,
    "OpenStreetMap 標準": osm,
    "イラストマップ":illust
};
//オーバレイ
let overLayers = {
    "河川ライブカメラ": liveCam,
};

let area = [
    [35.582913855357226, 139.6599040062763],
    [35.577992529653805, 139.66467833846545]
];

//マップのオプションたち
let mymap = L.map('map',{
    center:[35.580488133313, 139.66186738328818],
    zoom:18,
    maxZoom:20,
    minZoom:18,
    //maxBounds: area,
    zoomControl:true,
    layers:[illust],
    condensedAttributionControl: false
});
//レイヤコントール追加
L.control.layers(baseLayers,overLayers).addTo(mymap);

//attributionのまとめプラグインーーーーーーーーーーーーーーーーーーーーーーー
L.control.condensedAttribution({
    emblem: '<div class="emblem-wrap"><i class="far fa-copyright"></i></div>',
    prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="https://github.com/jomon111/kagoshima-hazard">Github</a>'
  }).addTo(mymap);

// 現在地表示ボタンーーーーーーーーーーーーーーーーーーーーーーーーーーーー
var watch_id = 0;
var curMarker = null;	// 現在地マーカー
L.easyButton({		// 現在地表示ボタン
	states: [{
		stateName: 'current-watch',
		icon:	'fas fa-map-marker-alt',
		title:	 '現在地',
		onClick: function(btn, mymap) {
			currentWatch();
			btn.state('current-watch-reset');
		}
	},{
		stateName: 'current-watch-reset',
		icon:	'fa fa-street-view',
		title:	 '現在地オフ',
		onClick: function(btn, mymap) {
			currentWatchReset();
			btn.state('current-watch');
		}
	}]
}).addTo( mymap );

function currentWatch() {
	var count = 0;
	function success(pos) {
		// 現在地に表示するマーカー
		var lat = pos.coords.latitude;
		var lng = pos.coords.longitude;
		if(count==0){
			mymap.setView([lat,lng])
			count+=1;
		}
		if (curMarker) {
			mymap.removeLayer(curMarker);
		}
		var curIcon = L.icon({	/* アイコン */
			iconUrl: './assets/test.gif',
			iconRetinaUrl: './assets/test.gif',
			iconSize: [40, 40]
		});
		curMarker = L.marker([lat, lng], {icon: curIcon}).addTo(mymap);
	}
	function error(err) {
		alert('位置情報を取得できませんでした。');
	}
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	if (watch_id == 0) {
		watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
	}
}
function currentWatchReset() {
	if (watch_id > 0) {
		navigator.geolocation.clearWatch(watch_id);
		watch_id = 0;
	}
	if (curMarker) {
		mymap.removeLayer(curMarker);
		curMarker = null;
	}
}


//ダイアログプラグインーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    var options = {
        title:'新丸子まっぷ',
        content:'<h3><u>はじめに</u></h3><p>このサイトは個人が作った<b>新丸子イラストMAP</b>です。新丸子駅周辺のおすすめの場所を載せてみました。<br>ご意見やお問い合わせは<a href="https://forms.gle/r18wQ3vw3DVHAHyh9">こちら</a>からお願いします。</p><h3><u>使い方</u></h3><p>①このダイアログを読み終えたら右下の<b>OKボタンを押してください</b>。<br>②位置情報許可のポップアップが表示されるので、許可すると現在地まで飛んでいきます。<br><h3><u>各ボタンの説明</u></h3><p><img src="./assets/layers.png">　背景地図を選ぶ<br><img src="./assets/map-marker.png">　現在地を表示<br><img src="./assets/street.png">　現在地を非表示</p>',
        modal: true,
        position:'center',
        closeButton:false
    };
    var win =  L.control.window(mymap, options)
    .prompt({callback:function(){
        //OKボタンを押したら初期から現在地を探す
        }}).show()

let mapMarker = L.marker([35.58087642829406, 139.66117135010086],{icon:sanchanIcon}).addTo(mymap);
mapMarker.bindPopup(comment).openPopup();
		