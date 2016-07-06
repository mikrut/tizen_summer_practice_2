
function loadRSS() {
	const RSS_URL = "http://www.3dnews.ru/news/rss/";
	
	$(document).ready(function() {
		$.ajax({
			  type     : 'get',
			  url      : RSS_URL,
			  dataType : 'xml',
			  success  : function (data) {		
				  console.log("received data");
				  
				  var feed = $('#rss_content');
				  feed.empty();
				  
				  var db = prepareDatabase();
				  console.log(db);
				  
				  clearDB(db);
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
				      
				      var domOb = addElement(ob, feed);
				 
				      elements.push(ob);
				      saveToDB(db, ob);
				  });
				  console.log(elements);
				  
				  
			  },
			  error	: function() {
				  console.log("error");
				  loadByQuery("");
			  }
			});
	})
	
}

function doSearch() {
	var query = $("#rss_search").val();
	console.log('doSearch ' + query);
	loadByQuery(query);
}

function loadByQuery(query) {
	var db = prepareDatabase();
	findByTheme(db, query, function(rows){
		  var feed = $('#rss_content');
		  feed.empty();
		  
		  for (var i = 0; i < rows.length; i++) {
			  addElement(rows.item(i), feed);
		  }
	  });
}

function addElement(ob, feed) {
	console.log(feed);
	
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

const DB_NAME = 'rss';
const TABLE_ELEMENTS = 'elements';


function prepareDatabase() {
  db = openDatabase(DB_NAME, '1.0', 'Offline document storage', 5*1024*1024);
  db.transaction(function(t){
      t.executeSql('CREATE TABLE IF NOT EXISTS ' + TABLE_ELEMENTS + ' (title, link, image, description)',
    		  [],
    		  function(){console.log("success")},
    		  function(t, e){
    			  console.log("error");
    			  console.log(e)
    			  });
  }, function(t, e) {
	  console.log(e);
  });
  console.log(db);
  return db;
}

function findByTheme(db, q, resultCallback) {
	db.readTransaction(function (t) {
		t.executeSql('SELECT * FROM ' + TABLE_ELEMENTS + ' WHERE title LIKE ?',
				['%' + q + '%'],
		function (t, data) {
			console.log(data);
			resultCallback(data.rows);
		}, function(t, e){console.log(e)});
	});
}

function saveToDB(db, object) {
	db.transaction(function(t) {
		console.log('inserting');
		t.executeSql("INSERT INTO " + TABLE_ELEMENTS + " (title, link, image, description) values (?, ?, ?, ?)",
				[object.title, object.link, object.image, object.description],
				null,
		function(t, e) {
			console.log(e);
		});		
	});
}

function clearDB(db) {
	db.transaction(function(t) {
		console.log("clearing db");
		t.executeSql("DELETE FROM " + TABLE_ELEMENTS, [], null, null);
	})
}


function selectTheme() {
	console.log("theme");
	var theme = $("#select-choice-1 option:selected").val();
	pages = $("div[data-role='page']");
	pages.attr('data-theme', theme);

	//reset all the buttons widgets
	//$.mobile.activePage
	pages.find('.ui-btn')
	    .removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e')
	    .addClass('ui-btn-up-' + theme)
	    .attr('data-theme', theme);
	
	//reset the header/footer widgets
    //$.mobile.activePage
	pages.find('.ui-header, .ui-footer')
                       .removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e')
                       .addClass('ui-bar-' + theme)
                       .attr('data-theme', theme);

    //reset the page widget
    //$.mobile.activePage
	pages.removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e')
                       .addClass('ui-body-' + theme)
                       .attr('data-theme', theme);
}