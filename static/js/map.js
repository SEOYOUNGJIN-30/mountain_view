$(document).ready(function () {
    getLocation();
})

function getLocation() {
    // 현재위치의 좌표값을 가져옵니다.
    navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let container = document.getElementById('map');

        // 지도를 생성합니다.
        let map = new kakao.maps.Map(container, {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 5
        });

        // 마커가 표시될 위치입니다.
        let markerPosition = new kakao.maps.LatLng(latitude, longitude)

        // 마커를 생성합니다.
        let marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커를 지도위에 표시합니다.
        marker.setMap(map);

        // 마커를 클릭했을 때 마커 위에 표시할 윈도우를 생성합니다.
        var infowindow = new kakao.maps.InfoWindow({
            content: `<div>hello</div>`,
            removable: true
        })

        // 클릭 시 infowindow를 표시합니다.
        kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        })
    }, function (error) {
        console.error(error);
    })
    // // 주소-좌표 변환 객체를 생성합니다
    // var geocoder = new kakao.maps.services.Geocoder();
    //
    // // 주소로 좌표를 검색합니다
    // geocoder.addressSearch('경남 함양군 마천면 추성리 산 100', function (result, status) {
    //     console.log(status)
    //     // 정상적으로 검색이 완료됐으면
    //     if (status === kakao.maps.services.Status.OK) {
    //
    //         console.log(result[0].y, result[0].x);
    //     }
    // });
    var ps = new kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    let m = '지리산'
    ps.keywordSearch(m, placesSearchCB);

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
        for(let i = 0; i < data.length; i++) {
            if(data[i]['place_name'] === m){
                console.log(data[i]['y'], data[i]['x']);
            }
        }
    }
}