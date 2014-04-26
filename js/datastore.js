(function(ardatastore, $, undefined) {


	ardatastore.init = function(openDbRequest){

		// Called when upgrading the version
		openDbRequest.onupgradeneeded = function (event) {
			
			// 1a. we have a temporary connection we can use to upgrade
			var tempDb = event.target.result;
			
			// Delete object store "shows" if exist
			if (tempDb.objectStoreNames.contains("shows")) {
				tempDb.deleteObjectStore("shows");
			}
			// And create a new "shows" object store
			var showsObjectStore = tempDb.createObjectStore("shows", {
				keyPath: "title"
			});
			
			
			// Delete object store "episodes" if exist
			if (tempDb.objectStoreNames.contains("episodes")) {
				tempDb.deleteObjectStore("episodes");
			} 
			// And create a new "episodes" object store
			var episodesObjectStore = tempDb.createObjectStore("episodes", {
				keyPath: ["title", "season", "episode"]
			});

			
			// Create new index for "shows" object store
			showsObjectStore.createIndex("overview", "overview", {
				unique: false
			});
			
			
			// Create new index for "episodes" object store
			episodesObjectStore.createIndex("title", "title", {
				unique: false
			});

		};
	
	}
	


	// Function to add data from shows.json to its objectstore
	ardatastore.addShows = function (db, data) {
		if (!db)
			return;
		
		var parsed = data;
		for(var i in parsed){
			db.transaction("shows", "readwrite").objectStore("shows").add(parsed[i]);
		}
	 }
	 
	 // Function to add data from episodes.json to its objectstore
	 ardatastore.addEpisodes = function (db, data) {
		if (!db)
			return;
			
		var parsed = data;
		for(var i in parsed){
			db.transaction("shows", "readwrite").objectStore("shows").add(parsed[i].show);
			db.transaction("episodes", "readwrite").objectStore("episodes").add(parsed[i].episode);
		}
	}



		//6. After a db is setup, we can query it
		ardatastore.queryDatabase = function (db, search, number) {
			
			if (!db) //cant query without it!
				return;
			
			var results = 0;
			// Search in the shows objectstore
			db.transaction("shows").objectStore("shows").openCursor().onsuccess = function (event) {
				
				event.preventDefault();
				var cursor = event.target.result;
				if(cursor){
					if (results < number){
						if (cursor.key.toUpperCase().indexOf(search.toUpperCase()) != -1) { // I check if the user input is a partial match (I make it case insensitive
							writeLog(cursor.key, cursor.value.images.poster, cursor.value.overview, results%2);
							results++;
						}
						else if (cursor.value.overview.toUpperCase().indexOf(search.toUpperCase()) != -1) { // I check if the user input is a partial match (I make it case insensitive)
							writeLog(cursor.key, cursor.value.images.poster, cursor.value.overview, results%2);
							results++;
						}
						cursor.continue ();
					}
				}
			};
			
			// Search in the episodes objectstore
			db.transaction("episodes").objectStore("episodes").openCursor().onsuccess = function (event) {
				
				event.preventDefault();
				var cursor = event.target.result;
				if(cursor){
					if (results < number){
						if (cursor.value.title.toUpperCase().indexOf(search.toUpperCase()) != -1) { // I check if the user input is a partial match (I make it case insensitive)
							writeLog(cursor.value.title, cursor.value.images.screen, cursor.value.overview, results%2);
							results++;
						}
						else if (cursor.value.overview.toUpperCase().indexOf(search.toUpperCase()) != -1) { // I check if the user input is a partial match (I make it case insensitive)
							writeLog(cursor.value.title, cursor.value.images.screen, cursor.value.overview, results%2);
							results++;
						}
						cursor.continue ();
					}
				}
			};
		}


})(window.ardatastore = window.ardatastore || {} , jQuery)