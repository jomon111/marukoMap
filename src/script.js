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

let area = [
    [35.582913855357226, 139.6599040062763],
    [35.577992529653805, 139.66467833846545]
];

//マップのオプションたち
let mymap = L.map('map',{
    center:[35.580488133313, 139.66186738328818],
    zoom:19,
    maxZoom:20,
    minZoom:18,
    //maxBounds: area,
    zoomControl:true,
    layers:[illust],
    condensedAttributionControl: false
});

//ベースマップ
let baseLayers = {
    "地理院地図 標準": gsi,
    "地理院地図 淡色": gsi_awai,
    "地理院地図 衛星画像": gsi_eisei,
    "OpenStreetMap 標準": osm,
    "イラストマップ":illust
};

/*ライブカメラ位置、オーバレイ画像
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
*/

//マーカー
let sanchanIcon = L.icon({
	iconUrl:'./assets/sanchan.png',
	iconRetinaUrl:'./assets/sanchan.png',
	iconSize:[180,150],
	iconAnchor:[50,80],
	popupAnchor:[30,-40],
});

let sanchanMarker = L.marker([35.58087642829406, 139.66117135010086],{icon:sanchanIcon}).addTo(mymap).bindPopup('三ちゃん食堂');

let originIcon = L.icon({
    iconUrl:'./assets/origin.png',
	iconRetinaUrl:'./assets/origin.png',
	iconSize:[180,150],
	iconAnchor:[50,80],
	popupAnchor:[30,-40],
});

let originMarker = L.marker([35.580664482796095, 139.6614550727053],{icon:originIcon}).addTo(mymap).bindPopup('オリジン弁当');

let doutorIcon = L.icon({
    iconUrl:'./assets/doutor.png',
	iconRetinaUrl:'./assets/doutor.png',
	iconSize:[180,150],
	iconAnchor:[50,80],
	popupAnchor:[30,-40],
})

let doutorMarker = L.marker([35.58038496006569, 139.66214623853003],{icon:doutorIcon}).addTo(mymap).bindPopup('ドトールコーヒー');


//オーバレイ
let overLayers = {
    "食堂": mapMarker,
    "弁当": originMarker,
    "カフェ": doutorMarker
};

//レイヤコントール追加
L.control.layers(baseLayers,overLayers).addTo(mymap);

//attributionのまとめプラグインーーーーーーーーーーーーーーーーーーーーーーー
L.control.condensedAttribution({
    emblem: '<div class="emblem-wrap"><i class="far fa-copyright"></i></div>',
    prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="https://github.com/jomon111/kagoshima-hazard">Github</a>'
  }).addTo(mymap);

// 現在地表示プラグインーーーーーーーーーーーーーーーーーーーーーーーーーーーー
let lc = L.control.locate({
    flyTo:true,
    strings: {
        title: "現在地を表示する",
    },
    showPopup:false,
    onLocationError(){
        alert('現在地が見つかりません');
    },
    markerStyle:{
        iconURL:'../spinner-solid.svg'
    }
    /*onLocationOutsideMapBounds(){
        alert('あなたは新丸子にいないよ！');
        lc.stop();
    },*/
}).addTo(mymap);

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

		