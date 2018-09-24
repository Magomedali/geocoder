var Place = function(){
	
	this.components = {
		country : [],
		province : [],
		locality : [],
		area : [],
		airport : [],
		street : [],
		house : []
	};
	
	this.kind = null;
	this.text = null;
	this.name = null;
	this.description = null;
	this.addressFormatted = null;
	this.country = null;

	this.visible = ['country','province','locality','area','airport','street','house'];

	this.init = function(components){
		var p = new Place();
		components.forEach(function(item){
			if(p.components.hasOwnProperty(item.kind)){
				p.components[item.kind].push(item.name);
			}
		});

		return p;
	}

	this.placeToLi = function(comps){
		var html = "<li class='place_item'";
		var c = comps && comps.length ? comps : this.visible;
		var components = this.components;
		this.visible.forEach(function(item){
			html += " data-"+item+"='"+components[item].join("|")+"'";
		});
		html += ">";

		var values = [];
		c.forEach(function(item){
			var value = components[item].length ? components[item].join(" ") : null;
			if(value)
				values.push(value);
		});
		html += values.join(", ");
		html +="</li>";

		return html;
	}

	this.placeToValue = function(comps){
		var html = "<li class='place_item'";
		var c = comps && comps.length ? comps : this.visible;
		var components = this.components;
		this.visible.forEach(function(item){
			html += " data-"+item+"='"+components[item].join("|")+"'";
		});
		html += ">";

		var values = [];
		c.forEach(function(item){
			var value = components[item].length ? components[item].join(" ") : null;
			if(value)
				values.push(value);
		});
		html += values.join(", ");
		html +="</li>";

		return html;
	}
};


var PlacesCollection = function(){
	this.places = [];

	this.importYnadex = function(response){
		var places = [];
		if(response.hasOwnProperty("GeoObjectCollection") && 
		   response.GeoObjectCollection.hasOwnProperty("featureMember")){
			if(response.GeoObjectCollection.featureMember.length){
				var geo_items = response.GeoObjectCollection.featureMember;

				geo_items.forEach(function(item,i){
					if(item.hasOwnProperty("GeoObject") && 
						item.GeoObject.hasOwnProperty("metaDataProperty") &&
						item.GeoObject.metaDataProperty.hasOwnProperty("GeocoderMetaData") &&
						item.GeoObject.metaDataProperty.GeocoderMetaData.hasOwnProperty("Address") &&
						item.GeoObject.metaDataProperty.GeocoderMetaData.Address.hasOwnProperty("Components")){

						var components = item.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components;
						var place_data = {};
						var place = (new Place()).init(components);

						place.name = item.GeoObject.name;
						place.description = item.GeoObject.description;
						place.kind = item.GeoObject.metaDataProperty.GeocoderMetaData.kind;
						place.text = item.GeoObject.metaDataProperty.GeocoderMetaData.text;
						
						place.country = item.GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName;
						
						place.addressFormatted = item.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted;


						places.push(place);
					}
				});
			}
		}
		this.places = places;
	};
};

var aliGeocoder = function(){
	this.init = function(textinputs){

	}
}

var placesToHtml = function(places,components){
	this.html = "<ul class='yandex_places_autocomplete'>";
	
	if(places.length){
		places.forEach(function(item,i){
			this.html += item.placeToLi(components);
		});
	}
	this.html += "</ul>";

	return this.html;
}

var placesPropertyToHtml = function(places,property,value){
	this.html = "<ul class='yandex_places_autocomplete'>";
	
	if(places.length){
		places.forEach(function(item,i){
			if(item.hasOwnProperty(property) && item.hasOwnProperty(value)){
				this.html += "<li class='place_item' data-value='"+item[value]+"'>"+item[property]+"</li>";
			}
			
		});
	}
	this.html += "</ul>";

	return this.html;
}


$(function(){

	var host = "https://geocode-maps.yandex.ru/1.x/";
	$("body").on("keyup","div.geocoder-town input[type=text]",function(event){
		event.preventDefault();
		var val = $(this).val();
		var parent = $(this).parents("div.geocoder.geocoder-town");
		var list = parent.find("div.places-list");

		if(!list.length){
			list = $("<div/>").addClass("places-list").html($("<ul/>"));
			parent.append(list);
			list.hide();
		}

		if(val.length > 3){
			$.ajax({
					url:host,
					data:{
						geocode:val,
						format:'json',
						results:10
					},
					dataType:"json",
					success:function(resp){
						var places = [];
						if(resp.hasOwnProperty("response")){
							var collect = new PlacesCollection();
							collect.importYnadex(resp.response);

							places = collect.places;
						}
						// var html = placesToHtml(places,['country','province','locality','area']);
						var html = placesPropertyToHtml(places,"text","addressFormatted");

						list.html(html);
						list.show();
					},
					error:function(msg){
						console.log(msg);
					}
			})
		}
	});

	$("body").on("keyup","div.geocoder-address input[type=text]",function(event){
		event.preventDefault();
		var val = $(this).val();
		var parent = $(this).parents("div.geocoder.geocoder-address");
		var list = parent.find("div.places-list");
		var town = $(this).parents(".form-route").find("div.geocoder-town").find("input[type=text]").val();
		console.log(town);
		if(!list.length){
			list = $("<div/>").addClass("places-list").html($("<ul/>"));
			parent.append(list);
			list.hide();
		}

		if(val.length > 3){

			val = town+", "+val;

			$.ajax({
					url:host,
					data:{
						geocode:val,
						format:'json',
						results:10
					},
					dataType:"json",
					success:function(resp){
						var places = [];
						if(resp.hasOwnProperty("response")){
							var collect = new PlacesCollection();
							collect.importYnadex(resp.response);

							places = collect.places;
						}
						var html = placesToHtml(places,['street','house']);

						list.html(html);
						list.show();
					},
					error:function(msg){
						console.log(msg);
					}
			})
		}
	});

	$("body").on("click","li.place_item",function(event){
			event.preventDefault();
			
			var data = $(this).data();
			$(this).parents("div.geocoder").find("input[type=text]").val(data.value);
			$(this).parents("div.places-list").hide();
		});
})