/**
 * 
 */

$(document).ready(function(){


   $("#slToggle").click(function(){ $("#square").slideToggle(3000)});


});    

function fetchRSS() {
	const RSS_URL = "http://www.3dnews.ru/news/rss/";
	
	$(document).ready(function() {
		$.ajax({
			  type     : 'get',
			  url      : RSS_URL,
			  dataType : 'xml',
			  success  : function (data) {		
				  console.log("received data");
				  
				  var feed = $('<div class="feed"></div>');
				  $("#rss_content").append(feed);
				  
				  clearStorage();
				  var elements = [];
				  $(data).find("item").each(function () {
				      var el = $(this);
				      
				      var title       = $(this).find("title"    ).text();
				      var link        = $(this).find("link"     ).text();
				      var image       = $(this).find("enclosure").attr('url');
				      var description = $(this).find("description").text();  
				      
				      var ob = {
						    	title       : title,
						    	link        : link,
						    	image       : image,
						    	description : description
						      };
				      
				      var domOb = display(ob, feed);
				 
				      elements.push(ob);
				      setData(ob);
				      //setData(domOb);
				  });
				  console.log(elements);
				  
				  
			  },
			  error	: function() {
				  console.log("error");
				  getStorage(function(res) {
					  console.log(res);
					  var feed = $('<div class="feed"></div>');
					  $("#rss_content").append(feed);
					  
					  for (index in res) {
						  display(res[index], feed);
						  //feed.append(res[index]);
					  }
				  });
			  }
			});
	})
    
}


function display(ob) {
	var feed = $('<div class="feed"></div>');
	console.log("display");
	
	var rssElement = $('<div class="element"></div>')
    
    var domImage = $('<img>');
    domImage.attr('src', ob.image);
    domImage.attr('width', '100%');
    
    var domTitle = $('<h2>');
    var domLink  = $('<a>');
    domLink.attr('href', ob.link);
    domLink.text(ob.title);
    domTitle.append(domLink);
    
    rssElement.append(domImage);
    rssElement.append(domTitle);
    feed.append(rssElement);
    
    return rssElement;
}


// Indexed DB


var indexedDB 	  = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
baseName 	  = "filesBase",
storeName 	  = "filesStore";




function logerr(err){
	console.log(err);
}

function connectDB(f){
	var request = indexedDB.open(baseName, 1);
	request.onerror = logerr;
	request.onsuccess = function(){
		f(request.result);
	}
	request.onupgradeneeded = function(e){
		var objectStore = e.currentTarget.result.createObjectStore(storeName, { autoIncrement: true });
		connectDB(f);
	}
}

function getData(key, f){
	connectDB(function(db){
		var request = db.transaction([storeName], "readonly").objectStore(storeName).get(key);
		request.onerror = logerr;
		request.onsuccess = function(){
			f(request.result ? request.result : -1);
		}
	});
}

function getStorage(f){
	connectDB(function(db){
		var rows = [],
			store = db.transaction([storeName], "readonly").objectStore(storeName);

		if(store.mozGetAll)
			store.mozGetAll().onsuccess = function(e){
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor){
					rows.push(cursor.value);
					cursor.continue();
				}
				else {
					f(rows);
				}
			};
	});
}

function setData(obj){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).add(obj);
		request.onerror = logerr;
		request.onsuccess = function(){
			return request.result;
		}
	});
}

function delData(key){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
		request.onerror = logerr;
		request.onsuccess = function(){
			console.log("File delete from DB:", file);
		}
	});
}

function clearStorage(){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).clear();;
		request.onerror = logerr;
		request.onsuccess = function(){
			console.log("Clear");
		}
	});
}

