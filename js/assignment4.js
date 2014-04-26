(function(artvguide, $, undefined) {
	
	artvguide.init = function(){
	
		var db; // Variable to store the database
		
		var search = localStorage.getItem("lastSearch");
		var number = localStorage.getItem("lastNumber");
		
		$("input[name='search']").val(search);
		$("select[name='number']").val(number);
		
		// Called when the add data function returns
		window.writeLog = function (title, image, overview, odd) {
			var table = $("<table class='aShow'><tr><th rowspan='2' class='left'><img class='poster' src=" + image +" /></th><th class='title text-left'>" + title + "</th><tr><td class='overview text-justify'>" + overview + "</td></tr></table>");
			$("#info").append(table);
			$("#info").append($("<div class='separate'></div>"));
			if (odd == 0){
				$(table).css('background-color', '#F5F5F5');
			}
		}


		
		/**
		* 1. First we must connect to the database
		* We can have many databases each with a unique name
		*/
		var openDbRequest = window.indexedDB.open("TVGuideDB", 46);

		ardatastore.init(openDbRequest);
		
		// If I have successfully opened the database
		openDbRequest.onsuccess = function (event) {
			db = this.result;
			var myShows = $.ajax( {type: "GET", url:"data/shows.json", contentType: "application/json; charset=utf-8"});
			myShows.done(function (data) {
				ardatastore.addShows(db, data)
			});
			
			var myEpisodes = $.ajax( {type: "GET", url:"data/episodes.json", contentType: "application/json; charset=utf-8"});
			myEpisodes.done(
				function (data) {
					ardatastore.addEpisodes(db, data)
				}
			);
		};
		
			
		$("form").submit( function(e){
			e.preventDefault();
			$("#info").empty();
			search = $("input[name='search']").val();
			number = $("select[name='number']").val();
			localStorage.setItem("lastSearch", search);
			localStorage.setItem("lastNumber", number);
			if (search) {
				ardatastore.queryDatabase(db, search, number);
			}
		});
	
	}
	
})(window.artvguide = window.artvguide || {} , jQuery)