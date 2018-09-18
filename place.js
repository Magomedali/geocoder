var Place = function(data){

	this.country = data.country;
	this.province = data.province;
	this.locality = data.locality;
	this.street = data.street;
	this.house = data.house;
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
						components.forEach(function(c,j){
							place_data[c.kind] = c.name;
						});

						places.push(new Place(place_data));
					}
				});
			}
		}
		this.places = places;
	};
};



var placesToHtml = function(places,components){
	this.html = "<ul class='yandex_places_autocomplete'>";
	
	if(places.length){
		places.forEach(function(item,i){
			var parts = [];
			if(components && components.length){
				components.indexOf("country") >=0 && typeof item.country != 'undefined' ? parts.push(item.country) : null;
				components.indexOf("province") >=0 && typeof item.province != 'undefined' ? parts.push(item.province) : null;
				components.indexOf("locality") >=0 && typeof item.locality != 'undefined' ? parts.push(item.locality) : null;
				components.indexOf("street") >=0 && typeof item.street != 'undefined' ? parts.push(item.street) : null;
				components.indexOf("house") >=0 && typeof item.house != 'undefined' ? parts.push(item.house) : null;
			}else{
				typeof item.country != 'undefined' ? parts.push(item.country) : null;
				typeof item.province != 'undefined' ? parts.push(item.province) : null;
				typeof item.locality != 'undefined' ? parts.push(item.locality) : null;
				typeof item.street != 'undefined' ? parts.push(item.street) : null;
				typeof item.house != 'undefined' ? parts.push(item.house) : null;
			}
			if(parts.length){
				this.html+= "<li class='place_item' data-country='"+item.country+"'"+
							" data-province='"+item.province+"'"+
							" data-locality='"+item.locality+"'"+
							" data-street='"+item.street+"'"+
							" data-house='"+item.house+"'"+
							">";
				this.html += parts.join(", ");
				this.html += "</li>";
			}
			
		});
	}
	this.html += "</ul>";

	return this.html;
}