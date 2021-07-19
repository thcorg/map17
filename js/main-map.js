// Bootstrap Plugins //
$(document).ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
        $('.row-offcanvas').toggleClass('active')
    });
});
$('.dropdown-toggle').dropdown();
$('#modal-verify').modal('show');

//// MAP SETTINGS ////
// Initial settings //
let isVerified = false;
var map = new AMap.Map('map-container', {
    resizeEnable: true,
    zoom: 4,
    center: [112.77871,34.922213],
    viewMode: "3D",
    mapStyle: "amap://styles/macaron",
    WebGLParams: {
        preserveDrawingBuffer: true
    },
});

// Animate layer
var loca = new Loca.Container({ map, });

// Image layer
var layer_foodmap = new AMap.ImageLayer({
    zooms: [2, 5],
    url: "img/foodmap.png",
    bounds: new AMap.Bounds([70, 16], [138, 54])
});
map.add(layer_foodmap);
map.on("zoomchange", function() {
    layer_foodmap.setOpacity(Math.min(Math.max(5 - map.getZoom(), 0), 1));
})

// Infowindow
function createInfoWindow(title, content) {
    var info = document.createElement("div");
    $(info).addClass("panel panel-default");
    $(info).html(`<div class="arrow"></div><div class="panel-heading">${title}
        <button type="button" class="close" onclick=closeInfoWindow()><span>&times;</span></button>
        </div><div class="panel-body">${content}</div>`);
    return info;
}
function closeInfoWindow() {
    map.clearInfoWindow();
    $(".list-group-item").removeClass("active");
}

// JSON Processing
function geoJsonPointToLineString(GeoJSON) {
    var result = {"type": "FeatureCollection", "features": []};
    for(i in GeoJSON.features) {
        result.features.push({
            "type": "Feature",
            "properties": { "classmates": GeoJSON.features[i].properties.classmates.length },
            "geometry": { "type": "LineString", "coordinates": [[112.77871, 34.922213], GeoJSON.features[i].geometry.coordinates]}
        })
    }
    return JSON.stringify(result);
}
function geoJsonPointToPositionList(GeoJSON) {
    var result = [];
    for(i in GeoJSON.features) {
        result.push({
            "schoolName": GeoJSON.features[i].properties.name,
            "schoolAbbr": GeoJSON.features[i].properties.abbr,
            "campus": GeoJSON.features[i].properties.campus,
            "slogan": GeoJSON.features[i].properties.slogan,
            "position": GeoJSON.features[i].geometry.coordinates,
            "classmates": GeoJSON.features[i].properties.classmates,
            "province": GeoJSON.features[i].properties.province
        })
    }
    return result;
}

// Map plugins
AMap.plugin([
    'AMap.ToolBar',
    'AMap.Scale',
], function(){
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.Scale());
});

// Animations //

// Data
var outLineSource = new Loca.GeoJSONSource({
    url: 'js/universities-outline.json',
});
var scatterGeo = new Loca.GeoJSONSource({
    url: 'js/universities-list.json',
});

// Scatter layer
var scatter = new Loca.ScatterLayer({
    zIndex: 10,
    opacity: 1,
    visible: true,
    zooms: [2, 20],
});
scatter.setSource(scatterGeo);
scatter.setStyle({
    unit: 'px',
    size: (_, feature) => [(feature.properties.classmates.length + 3) * 8, (feature.properties.classmates.length + 3) * 8],
    borderWidth: 0,
    texture: 'img/breath_yellow.png',
    duration: 2000,
    animate: true,
});

// Link layer
var linkLayer = new Loca.LinkLayer({
    zIndex: 10,
    opacity: .8,
    visible: true,
});
linkLayer.setSource(outLineSource);
linkLayer.setStyle({
        lineColors: ['#ECFFB1', 'rgb(255,178,6)'],
        height: function (index, item) {
            return item.distance / 3;
        },
});

loca.add(scatter);
loca.animate.start();
loca.add(linkLayer);

// Markers //
function renderMarker(MarkerList, SimpleMarker) {
    var markerList = new MarkerList({
        map: map,
        listContainer: "map-list",
        autoSetFitView: false,
        onSelected: null,
        getDataId: function(data) {return data.schoolAbbr;},
        getPosition: function(data) {return data.position;},
        getMarker: function(dataItem, context, recycledMarker) {
            return new SimpleMarker({
                iconTheme: "numv1",
                iconStyle: dataItem.schoolAbbr == "MZYZ" ? "start" : "red",
                zIndex: dataItem.schoolAbbr == "MZYZ" ? 199 : 100,
                topWhenClick: true,
                zooms: [2,20]
            })
        },
        getInfoWindow: function(dataItem, context, recycledInfoWindow) {
            return new AMap.InfoWindow({
                isCustom: true,
                autoMove: false,
                content: createInfoWindow(
                    dataItem.schoolName, [
                        `<center><img class="img-circle" src="img/${dataItem.schoolAbbr}.jpg" width="100" /><br/ >`,
                        `<i>${dataItem.slogan}</i></center><hr /><kbd>${dataItem.campus}校区</kbd>` + 
                        (dataItem.schoolAbbr == "MZYZ" ? `` : ` <a href="//www.${dataItem.schoolAbbr.toLowerCase()}.edu.cn/" target="_blank"><span class="glyphicon glyphicon-globe"></span> 前往官网</a>`),
                        dataItem.classmates.length ? `TA ${dataItem.classmates.length != 1 ? "们" : ""}在这里：${dataItem.classmates.join("、")}` : null
                    ].join("<br />")
                ),
                offset: new AMap.Pixel(8, -45)
            });
        },
        getListElement: function(dataItem, content, recycledListElement) {
            if (recycledListElement) {
                recycledListElement.innerHTML = content;
                return recycledListElement;
            }
            return `<a class="list-group-item" id="map-list-item" data-abbr=${dataItem.schoolAbbr}>
                <div class="media"><div class="media-left">
                <img class="media-object img-circle" src="img/${dataItem.schoolAbbr}.jpg" width="48">
                </div><div class="media-body">
                <strong>${dataItem.schoolName}</strong><br />` + 
                (dataItem.classmates.length != 0 ? `<span class="glyphicon glyphicon-user"></span> ${dataItem.classmates.join(" | ")}<br />` : "") + 
                `<span class="glyphicon glyphicon-map-marker"></span> ${dataItem.province} (${dataItem.schoolAbbr})
                </div></div></a>`;
        }
    });
    
    // Events //
    markerList.on('selectedChanged', function(event, changedInfo) {
        if (changedInfo.selectAgain) {
            $(".list-group-item").removeClass("active");
            this.clearSelected();
            markerList.closeInfoWindow();
            return;
        }
        if (changedInfo.selected) {
            markerList.openInfoWindowOnRecord(changedInfo.selected);
            $(".list-group-item").removeClass("active");
            $(`[data-abbr=${changedInfo.selected.data.schoolAbbr}]`).addClass("active");
            map.setCenter(changedInfo.selected.marker.getPosition());
        }
    });
    markerList.on('markerClick listElementClick', function(event, record) {
        $('.row-offcanvas').removeClass('active')
    });
    markerList.on('infoWindowRemoveFromMap', function(event, record) {
        $(".list-group-item").removeClass("active");
    });   
    markerList.on("renderComplete", function(event, records) {
        mapIsotope();
        $('#map-list').isotope('updateSortData').isotope();
    } );
    
    markerList.render(positionList);

    $('#btn-marker-visible').on( 'click', function() {
        var markers = markerList.getAllMarkers();
        console.log(markers);
        for(i in markers) {
            markers[i]._style.visible ? markers[i].hide() : markers[i].show();
        }
    });
}

// Isotope //
function mapIsotope() {
    $('#map-list').isotope({
        itemSelector: '#map-list-item',
        layoutMode: 'vertical',
        getSortData: {
            abbr: '[data-abbr]',
            abbrDes: '[data-abbr]',
        },
        sortAscending: {
            abbr: true,
            abbrDes: false,
        },
        sortBy: "abbr",
    });

    var $quicksearch = $('#input-search').keyup( debounce( function() {
        qsRegex = new RegExp( $quicksearch.val(), 'gi' );
        $('#map-list').isotope({
            filter: function() {
                return qsRegex ? $(this).text().match( qsRegex ) : true;
            },
        });
    }, 200 ) );
    function debounce( fn, threshold ) {
        var timeout;
        threshold = threshold || 100;
        return function debounced() {
            clearTimeout( timeout );
            var args = arguments;
            var _this = this;
            function delayed() {
                fn.apply( _this, args );
            }
            timeout = setTimeout( delayed, threshold );
        };
    }

    $('#sort-by-button-group').on('click', 'a', function() {
        $('#map-list').isotope({
            sortBy: $(this).attr('data-sort-by'),
        });
    });
    $('#btn-shuffle').on( 'click', function() {
        $('#map-list').isotope('shuffle');
    });
}

// Map Settings //
$('#btn-image-visible').on( 'click', function() {
    layer_foodmap._visible = !layer_foodmap._visible;
});
$('#btn-anim-visible').on( 'click', function() {
    linkLayer.visible ? linkLayer.hide() : linkLayer.show();
    scatter.visible ? scatter.hide() : scatter.show();
});
$('#list-map-style').on('click', 'li a', function() {
    map.setMapStyle("amap://styles/" + $(this).attr("data-style"));
    layer_foodmap._visible = false;
});

// Verify //
function onVerify() {
    if (CryptoJS.MD5(CryptoJS.SHA256(CryptoJS.MD5($('#input-verify').val()).toString()).toString()).toString() == "764fd77319f51d3b635d4aceff8418a4") {
        isVerified = true;
        let password = $('#input-verify').val();
        $('#form-group-verify').attr('class', 'form-group has-success');
        $('#btn-modal-verify').attr('class', 'btn btn-success');
        $('#modal-verify').modal('hide');
        $('#alert-verify').alert('close');
        $('#alert-verify-guide').alert('close');

        $.getJSON("js/universities-list.json", function(json) {
            positionList = geoJsonPointToPositionList(json);
            for (i in positionList) {
                for (j in positionList[i].classmates) {
                    positionList[i].classmates[j] = CryptoJS.AES.decrypt(positionList[i].classmates[j], password).toString(CryptoJS.enc.Utf8);
                }
            }
        });
        AMapUI.loadUI(['misc/MarkerList','overlay/SimpleMarker'], function(MarkerList, SimpleMarker) {
            renderMarker(MarkerList, SimpleMarker);
        });
    } else {
        isVerified = false;
        $('#form-group-verify').attr('class', 'form-group has-error');
        $('#btn-modal-verify').attr('class', 'btn btn-danger');
    }
}
$('#btn-modal-verify').on( 'click', function() { onVerify(); } );
$('#input-verify').keyup( function() { if(event.which == 13) { onVerify(); } } );