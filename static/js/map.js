$(document).ready(function () {
    getLocation();
})

let map;
let markers = [];

function getLocation() {
    // 현재위치의 좌표값을 가져옵니다.
    navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let container = document.getElementById('map');

        // 지도를 생성합니다.
        map = new kakao.maps.Map(container, {
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
        // todo: 사용자 마커 모양 바꾸기
        // 마커를 클릭했을 때 마커 위에 표시할 윈도우를 생성합니다.
        var infowindow = new kakao.maps.InfoWindow({
            content: `<div style="width: 100px; height: 40px" class="flex-column">hello</div>`,
        })

        // 클릭 시 infowindow를 표시합니다.
        kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
    }, function (error) {
        console.error(error);
    });
}

function setMountain() {
    // 마커를 삭제합니다.
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    // 산명을 받습니다.
    let m = $('#find-mtn').val();

    // 키워드로 장소를 검색합니다
    var ps = new kakao.maps.services.Places();
    ps.keywordSearch(m, placesSearchCB);

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
        for (let i = 0; i < data.length; i++) {
            if (data[i]['place_name'] === m) {
                let pos = new kakao.maps.LatLng(data[i]['y'], data[i]['x']);
                //지도를 해당 위치로 이동합니다.
                map.panTo(pos);

                // 마커를 생성합니다.
                let marker = new kakao.maps.Marker({
                    position: pos
                });

                // 마커를 지도위에 표시합니다.
                marker.setMap(map);

                //지도에 표기되는 산 마커들을 리스트에 저장합니다.
                markers.push(marker);
                // 마커를 클릭했을 때 마커 위에 표시할 윈도우를 생성합니다.
                var infowindow = new kakao.maps.InfoWindow({
                    content: `<div>${m}</div>`,
                })
                // todo: infowindow제거를 토글형식으로
                // 클릭 시 infowindow를 표시합니다.
                kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
            }
        }
    }
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
// 이 부분은 클로저에 대해서 조금 더 학습할 필요가 있어보임
let makeOverListener = function (map, marker, infowindow) {
    let is = true;
    console.log(is);
    return function () {
        is ? infowindow.open(map, marker) : infowindow.close();
        is = !is
    };
}