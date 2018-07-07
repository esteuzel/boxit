
        var map = null;
                var infoWindow = null;
                function closeInfoWindow() {
                    infowindow.close();
                    }
        
                function initMap() {
                    var center = {lat: 8.9823792, lng: -79.5198696};
                    map = new google.maps.Map(document.getElementById('home-map'), {
                        zoom: 13,
                        center: center
                    });
                    infoWindow = new google.maps.InfoWindow();

                    google.maps.event.addListener(map, 'click', function(){
                        console.log('closeInfoWindow');
                        closeInfoWindow();
                    });                    
         
                    var ubication1 = {lat: 8.9770883, lng: -79.5339283};
                    var ubication2 = {lat: 8.9969002, lng: -79.581986};
                    var ubication3 = {lat: 9.0026415, lng: -79.5832567};
                    var ubication4 = {lat: 9.0006108, lng: -79.5167992};
                    var ubication5 = {lat: 8.9875199, lng: -79.5025703};
                    var ubication6 = {lat: 8.9521979, lng: -79.5363596};

                    var title1 = "Boxit La Cresta";
                    var title2 = "Oficina Principal";
                    var title3 = "Boxit Ciudad del Saber";
                    var title4 = "Boxit San Fernando- La Sabana";
                    var title5 = "Boxit Vía Israel";
                    var title6 = "Boxit Selina";

                    var address1 = "La Cresta, Zaz Food Store, en la estación Delta al lado de la Entrada de Hossana. (Todos los días, 24 horas)";
                    var address2 = "Ciudad del Saber, Calle Evelio Lara, Casa 138-B (Lunes a Viernes, de 8:30AM A 5:30PM)";
                    var address3 = "Ciudad del Saber, a un costado de la Plaza.(Todos los días, 24 horas)";
                    var address4 = "Vía España, La Sabana, Zaz Food store, en estación Delta al lado de Consultorios América (Carrasquilla). (Todos los días, 24 horas)";
                    var address5 = "Vía Israel, próximo a ELMEC, frente a la calle 76 (Istmo Pub). Plaza City Point, dentro del local Super Gourmet. (Todos los días, de 9AM A 10PM)";
                    var address6 = "Selina Embassy, Casco Viejo, Frente a Puerta de Tierra, edificio de la esquina diagonal a Plaza Herrera.(10:30am - 7:30pm) EDICION ESPECIAL";

                    var link1 = "https://www.google.com/maps/place/Boxit+La+Cresta/@8.9770883,-79.542683,15z/data=!4m8!1m2!2m1!1sBoxit!3m4!1s0x8faca8ee460b372b:0xa797bed669f7f1d6!8m2!3d8.9770883!4d-79.5339283";
                    var link2 = "https://www.google.com/maps/place/Boxit+Oficina+Principal/@8.9969002,-79.5841747,17z/data=!3m1!4b1!4m5!3m4!1s0x8faca6354e42cdb7:0x2c32b6821c38a658!8m2!3d8.9969002!4d-79.581986";
                    var link3 = "https://www.google.com/maps/place/Boxit+Ciudad+Del+Saber/@9.0026415,-79.5854454,17z/data=!3m1!4b1!4m5!3m4!1s0x8faca7b5fc3560c5:0xffb20ae5707c8d4e!8m2!3d9.0026415!4d-79.5832567";
                    var link4 = "https://www.google.com/maps/place/Boxit+Las+Sabanas/@9.0006108,-79.5189879,17z/data=!3m1!4b1!4m5!3m4!1s0x8faca8549f56e9f9:0xf643edf2e298df5c!8m2!3d9.0006108!4d-79.5167992";
                    var link5 = "https://www.google.com/maps/place/Boxit+Via+Israel/@8.9875199,-79.504759,17z/data=!3m1!4b1!4m5!3m4!1s0x8faca90f0d76b043:0xc3550728abc54b59!8m2!3d8.9875199!4d-79.5025703";
                    var link6 = "https://www.google.com/maps/place/Selina+Embassy/@8.9521979,-79.5385483,17z/data=!3m1!4b1!4m5!3m4!1s0x8facaf3535c19ff1:0x5befa9e35e1635b4!8m2!3d8.9521979!4d-79.5363596";

                    var image = {
                        url: 'img/newstyle/map-marker-icon-pink-original-30-43.png',
                        // This marker is 20 pixels wide by 32 pixels high.
                        size: new google.maps.Size(30, 43),
                        // The origin for this image is (0, 0).
                        origin: new google.maps.Point(0, 0),
                        // The anchor for this image is the base of the flagpole at (0, 32).
                        anchor: new google.maps.Point(0, 43)
                    };

                    var contentString1 = '<div class="info-windows-content">'+
                    '<div class="info-windows-title">'+
                    '<h3>'+ title1 +'</h3>'+
                    '</div>'+                    
                    '<div class="info-windows-phone">'+
                    '<h4><a href="'+ link1 +'" target="_blank">Ver Mapa</a></h4>'+
                    '</div>'+
                    '<div class="info-windows-address">'+
                    '<h5>'+ address1 +'</h5>'+
                    '</div>'+
                    '</div>';
                    
                    var marker1 = new google.maps.Marker({
                        position: ubication1,
                        map: map,
                        icon: image,
                        title: title1
                    });

                    marker1.addListener('click', function() {
                        if (typeof infowindow !== 'undefined') {closeInfoWindow();}
                        infowindow = new google.maps.InfoWindow({
                            content: contentString1
                        });
                        infowindow.open(map, marker1);
                        map.panTo(ubication1);
                    });

                    var contentString2 = '<div class="info-windows-content">'+
                    '<div class="info-windows-title">'+
                    '<h3>'+ title2 +'</h3>'+
                    '</div>'+                    
                    '<div class="info-windows-phone">'+
                    '<h4><a href="'+ link2 +'" target="_blank">Ver Mapa</a></h4>'+
                    '</div>'+
                    '<div class="info-windows-address">'+
                    '<h5>'+ address2 +'</h5>'+
                    '</div>'+
                    '</div>';                    
                    var marker2 = new google.maps.Marker({
                        position: ubication2,
                        map: map,
                        icon: image,
                        title: title2
                    });
                    marker2.addListener('click', function() {
                        if (typeof infowindow !== 'undefined') {closeInfoWindow();}
                        infowindow = new google.maps.InfoWindow({
                            content: contentString2
                        });
                        infowindow.open(map, marker2);
                        map.panTo(ubication2);
                    });

                    var contentString3 = '<div class="info-windows-content">'+
                    '<div class="info-windows-title">'+
                    '<h3>'+ title3 +'</h3>'+
                    '</div>'+                    
                    '<div class="info-windows-phone">'+
                    '<h4><a href="'+ link3 +'" target="_blank">Ver Mapa</a></h4>'+
                    '</div>'+
                    '<div class="info-windows-address">'+
                    '<h5>'+ address3 +'</h5>'+
                    '</div>'+
                    '</div>';
                    
                    var marker3 = new google.maps.Marker({
                        position: ubication3,
                        map: map,
                        icon: image,
                        title: title3
                    });
                    marker3.addListener('click', function() {
                        if (typeof infowindow !== 'undefined') {closeInfoWindow();}
                        infowindow = new google.maps.InfoWindow({
                            content: contentString3
                        });
                        infowindow.open(map, marker3);
                        map.panTo(ubication3);
                    });

                    var contentString4 = '<div class="info-windows-content">'+
                    '<div class="info-windows-title">'+
                    '<h3>'+ title4 +'</h3>'+
                    '</div>'+                    
                    '<div class="info-windows-phone">'+
                    '<h4><a href="'+ link4 +'" target="_blank">Ver Mapa</a></h4>'+
                    '</div>'+
                    '<div class="info-windows-address">'+
                    '<h5>'+ address4 +'</h5>'+
                    '</div>'+
                    '</div>';
                    
                    var marker4 = new google.maps.Marker({
                        position: ubication4,
                        map: map,
                        icon: image,
                        title: title4
                    });
                    marker4.addListener('click', function() {
                        if (typeof infowindow !== 'undefined') {closeInfoWindow();}
                        infowindow = new google.maps.InfoWindow({
                            content: contentString4
                        });
                        infowindow.open(map, marker4);
                        map.panTo(ubication4);
                    });

                    var contentString5 = '<div class="info-windows-content">'+
                    '<div class="info-windows-title">'+
                    '<h3>'+ title5 +'</h3>'+
                    '</div>'+                    
                    '<div class="info-windows-phone">'+
                    '<h4><a href="'+ link5 +'" target="_blank">Ver Mapa</a></h4>'+
                    '</div>'+
                    '<div class="info-windows-address">'+
                    '<h5>'+ address5 +'</h5>'+
                    '</div>'+
                    '</div>';
                   
                    var marker5 = new google.maps.Marker({
                        position: ubication5,
                        map: map,
                        icon: image,
                        title: title5
                    });
                    marker5.addListener('click', function() {
                        if (typeof infowindow !== 'undefined') {closeInfoWindow();}
                        infowindow = new google.maps.InfoWindow({
                            content: contentString5
                        });
                        infowindow.open(map, marker5);
                        map.panTo(ubication5);
                    });

                    var contentString6 = '<div class="info-windows-content">'+
                    '<div class="info-windows-title">'+
                    '<h3>'+ title6 +'</h3>'+
                    '</div>'+                    
                    '<div class="info-windows-phone">'+
                    '<h4><a href="'+ link6 +'" target="_blank">Ver Mapa</a></h4>'+
                    '</div>'+
                    '<div class="info-windows-address">'+
                    '<h5>'+ address6 +'</h5>'+
                    '</div>'+
                    '</div>';
                    
                    var marker6 = new google.maps.Marker({
                        position: ubication6,
                        map: map,
                        icon: image,
                        title: title6
                    });
                    marker6.addListener('click', function() {
                        if (typeof infowindow !== 'undefined') {closeInfoWindow();}
                        infowindow = new google.maps.InfoWindow({
                            content: contentString6
                        });
                        infowindow.open(map, marker6);
                        map.panTo(ubication6);
                    });                    
                }

                initMap();