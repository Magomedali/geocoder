<?php

?>
<!DOCTYPE html>
<html>
<head>
	<title>Geocoder</title>
	<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
	<script src="place.js"></script>
	<style type="text/css">
		.output{
			width: 300px;
			height: 200px;
			overflow-y: hidden;
		}
		li.place_item{
			cursor: pointer;
		}
	</style>
</head>
<body>
	<label>Адрес:</label>
	<input type="text" name="key" class="key">
	<div class="output">
		
	</div>
	<script type="text/javascript">

		$(".key").keyup(function(event) {
			event.preventDefault();

			var host = "https://geocode-maps.yandex.ru/1.x/";
			var v = $(this).val();
			if(v.length > 3){
				$.ajax({
					url:host,
					data:{
						geocode:v,
						format:'json'
					},
					dataType:"json",
					success:function(resp){
						var places = [];
						if(resp.hasOwnProperty("response")){
							var collect = new PlacesCollection();
							collect.importYnadex(resp.response);

							places = collect.places;
						}
						var html = placesToHtml(places);

						$(".output").html(html);
						$(".output").show();
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
			var parts = [];
			data.country != 'undefined' && typeof data.country != 'undefined' ? parts.push(data.country) : null;
			data.province != 'undefined' && typeof data.province != 'undefined' ? parts.push(data.province) : null;
			data.province !== data.locality && data.locality != 'undefined' && typeof data.locality != 'undefined' ? parts.push(data.locality) : null;
			data.street != 'undefined' && typeof data.street != 'undefined' ? parts.push(data.street) : null;
			data.house != 'undefined' && typeof data.house != 'undefined' ? parts.push(data.house) : null;
			
			console.log(parts);
			$(this).parents(".output").siblings(".key").val(parts.join(", "));
			$(this).parents(".output").hide();
		});
	</script>
</body>
</html>