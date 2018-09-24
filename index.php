<!DOCTYPE html>
<html>
<head>
	<title>Geocoder</title>
	<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
	<link href="geocoder.css" rel="stylesheet" type = "text/css"/>
	<script src="geocoder.js"></script>
</head>
<body>
	<div class="form-route" style="width: 610px;">
		<div class="geocoder geocoder-town" style="float: left;width:300px;margin-right:10px;" >
			<label>Населенный пункт:</label><br>
			<input type="text" name="town" class="town" style="width: 100%;height: 20px;" autocomplete="off">
		</div>
		<div class="geocoder geocoder-address" style="float: left;width:300px;" >
			<label>Адрес:</label><br>
			<input type="text" name="address" class="address" style="width: 100%;height: 20px;" autocomplete="off">
		</div>
	</div>
	
</body>
</html>